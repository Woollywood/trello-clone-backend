import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import {
  BoardRoles,
  WorkspaceRoles,
  WorkspaceVisibility,
} from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PageDto } from 'src/common/dto/page.dto'
import { PageMetaDto } from 'src/common/dto/pageMeta.dto'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { CreateBoardDto } from 'src/generated/board/dto/create-board.dto'
import { CreateWorkspaceDto } from 'src/generated/workspace/dto/create-workspace.dto'
import { UpdateWorkspaceDto } from 'src/generated/workspace/dto/update-workspace.dto'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { WsGateway } from 'src/ws/ws.gateway'

import { PaginatedWorkspaceUsersDto } from './dto/paginated-users.dto'
import { WorkspaceUserDto } from './dto/user.dto'
import {
  WorkspaceAbilityFactory,
  WorkspaceActions,
} from './workspace-ability.factory'

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceAbilityFactory: WorkspaceAbilityFactory,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => WsGateway))
    private readonly wsGateway: WsGateway
  ) {}

  create(dto: CreateWorkspaceDto, userId: string) {
    return this.prismaService.workspace.create({
      data: {
        ...dto,
        visibility: WorkspaceVisibility.PRIVATE,
        members: {
          create: {
            userId,
            role: WorkspaceRoles.ADMIN,
          },
        },
        createBy: { connect: { id: userId } },
      },
    })
  }

  async createBoard(
    userId: string,
    workspaceId: string,
    dto: CreateBoardDto
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.CreateBoard,
        plainToInstance(Workspace, workspace)
      )
    ) {
      return this.prismaService.board.create({
        data: {
          ...dto,
          createBy: { connect: { id: userId } },
          workspace: { connect: { id: workspaceId } },
          boardMembers: {
            create: { userId, role: BoardRoles.ADMIN },
          },
        },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async findItemById(userId: string, workspaceId: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.Read,
        plainToInstance(Workspace, workspace)
      )
    ) {
      return workspace
    } else {
      throw new ForbiddenException()
    }
  }

  async updateItemById(
    userId: string,
    workspaceId: string,
    dto: UpdateWorkspaceDto
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.Update,
        plainToInstance(Workspace, workspace)
      )
    ) {
      return this.prismaService.workspace.update({
        where: { id: workspaceId },
        data: dto,
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async listMembers(
    userId: string,
    workspaceId: string,
    pageOptionsDto: PageOptionsDto
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.Read,
        plainToInstance(Workspace, workspace)
      )
    ) {
      const { search, skip, order, take } = pageOptionsDto
      const [entities, entitiesCount] = await Promise.all([
        this.prismaService.workspaceMember.findMany({
          include: { user: true },
          where: {
            workspaceId,
            user: {
              username: { contains: search, mode: 'insensitive' },
            },
          },
          skip,
          orderBy: { createdAt: order },
          take,
        }),
        this.prismaService.workspaceMember.count({
          where: {
            workspaceId,
            user: {
              username: { contains: search, mode: 'insensitive' },
            },
          },
        }),
      ])

      const pageMetaDto = new PageMetaDto({
        itemCount: entitiesCount,
        pageOptionsDto,
      })
      return new PageDto(entities, pageMetaDto)
    } else {
      throw new ForbiddenException()
    }
  }

  async listUsers(
    currentUserId: string,
    workspaceId: string,
    pageOptionsDto: PageOptionsDto
  ): Promise<PaginatedWorkspaceUsersDto> {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(currentUserId)

    if (
      ability.can(
        WorkspaceActions.Read,
        plainToInstance(Workspace, workspace)
      )
    ) {
      const { search, skip, order, take } = pageOptionsDto
      const [rawEntities, entitiesCount] = await Promise.all([
        this.prismaService.user.findMany({
          where: {
            id: { not: { equals: currentUserId } },
            username: { contains: search, mode: 'insensitive' },
            workspacesMemberships: {
              every: { NOT: { workspaceId } },
            },
          },
          skip,
          orderBy: { createdAt: order },
          take,
        }),
        this.prismaService.user.count({
          where: {
            id: { not: { equals: currentUserId } },
            username: { contains: search, mode: 'insensitive' },
            workspacesMemberships: {
              every: { NOT: { workspaceId } },
            },
          },
        }),
      ])

      const entityIds = rawEntities.map(({ id }) => id)
      const notifications =
        await this.prismaService.notification.findMany({
          where: {
            workspaceId,
            recipientId: { in: entityIds },
          },
          select: { recipientId: true },
          distinct: ['recipientId'],
        })

      const entities: WorkspaceUserDto[] = rawEntities.map(
        (entity) => ({
          ...entity,
          isInvited: notifications.some(
            ({ recipientId }) => recipientId === entity.id
          ),
        })
      )

      const pageMetaDto = new PageMetaDto({
        itemCount: entitiesCount,
        pageOptionsDto,
      })
      return new PageDto(entities, pageMetaDto)
    } else {
      throw new ForbiddenException()
    }
  }

  async findListByUserId(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ) {
    const { search, skip, order, take } = pageOptionsDto
    const [entities, entitiesCount] = await Promise.all([
      this.prismaService.workspace.findMany({
        where: {
          title: { contains: search, mode: 'insensitive' },
          members: { some: { userId } },
        },
        skip,
        orderBy: { createdAt: order },
        take,
      }),
      this.prismaService.workspace.count({
        where: {
          title: { contains: search, mode: 'insensitive' },
          members: { some: { userId } },
        },
      }),
    ])

    const pageMetaDto = new PageMetaDto({
      itemCount: entitiesCount,
      pageOptionsDto,
    })
    return new PageDto(entities, pageMetaDto)
  }

  async findListByUserIdWithBoards(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ) {
    const { search, skip, order, take } = pageOptionsDto
    const [entities, entitiesCount] = await Promise.all([
      this.prismaService.workspace.findMany({
        where: {
          title: { contains: search, mode: 'insensitive' },
          members: { some: { userId } },
        },
        skip,
        orderBy: { createdAt: order },
        take,
        include: { boards: true },
      }),
      this.prismaService.workspace.count({
        where: {
          title: { contains: search, mode: 'insensitive' },
          members: { some: { userId } },
        },
      }),
    ])

    const pageMetaDto = new PageMetaDto({
      itemCount: entitiesCount,
      pageOptionsDto,
    })
    return new PageDto(entities, pageMetaDto)
  }

  async inviteUser(
    workspaceId: string,
    senderId: string,
    recipientId: string
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(senderId)
    if (
      ability.can(
        WorkspaceActions.Invite,
        plainToInstance(Workspace, workspace)
      )
    ) {
      const recipient = await this.prismaService.user.findUnique({
        where: { id: recipientId },
        include: { workspacesMemberships: true },
      })

      if (!recipient) {
        throw new BadRequestException('recipient not found')
      }

      const { workspacesMemberships } = recipient
      if (
        workspacesMemberships.some(
          (item) => item.workspaceId === workspaceId
        )
      ) {
        throw new ForbiddenException('user is already in workspace')
      }

      const isNotificationExists =
        await this.prismaService.notification.findUnique({
          where: {
            senderId,
            workspaceId_recipientId: { workspaceId, recipientId },
          },
        })

      if (isNotificationExists) {
        throw new BadRequestException('user already invited')
      }

      const invitation =
        await this.notificationService.sendWorkspaceInvite({
          recipient: { connect: { id: recipientId } },
          sender: { connect: { id: senderId } },
          workspace: { connect: { id: workspaceId } },
        })

      this.wsGateway.sendNotification(recipient.id, invitation)

      return invitation
    } else {
      throw new ForbiddenException()
    }
  }

  async excludeInviteUser(
    workspaceId: string,
    senderId: string,
    recipientId: string
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(senderId)
    if (
      ability.can(
        WorkspaceActions.ExcludeInvite,
        plainToInstance(Workspace, workspace)
      )
    ) {
      const recipient = await this.prismaService.user.findUnique({
        where: { id: recipientId },
        include: { workspacesMemberships: true },
      })

      if (!recipient) {
        throw new BadRequestException('recipient not found')
      }

      const isNotificationExists =
        await this.prismaService.notification.findUnique({
          where: {
            senderId,
            workspaceId_recipientId: { workspaceId, recipientId },
          },
        })

      if (!isNotificationExists) {
        throw new BadRequestException(
          'user did not receive an invitation'
        )
      }

      const invitation =
        await this.notificationService.excludeWorkspaceInvite({
          recipientId,
          workspaceId,
        })

      this.wsGateway.removeNotification(recipient.id, invitation)

      return invitation
    } else {
      throw new ForbiddenException()
    }
  }

  async acceptInvite({
    workspaceId,
    userId,
  }: {
    workspaceId: string
    userId: string
  }) {
    const invitation =
      await this.notificationService.acceptWorkspaceInvite({
        workspaceId,
        recipientId: userId,
      })

    const newMember = this.prismaService.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role: WorkspaceRoles.PARTICIPANT,
      },
    })
    this.wsGateway.recipientAction(
      invitation.senderId ?? '',
      invitation
    )
    return newMember
  }

  async rejectInvite({
    workspaceId,
    userId,
  }: {
    workspaceId: string
    userId: string
  }) {
    const invitation =
      await this.notificationService.rejectWorkspaceInvite({
        workspaceId,
        recipientId: userId,
      })
    this.wsGateway.recipientAction(
      invitation.senderId ?? '',
      invitation
    )
  }

  async excludeUser(
    userId: string,
    excludeUserId: string,
    workspaceId: string
  ) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.ExcludeInvite,
        plainToInstance(Workspace, workspace)
      )
    ) {
      if (workspace.createById === excludeUserId) {
        throw new BadRequestException('you cannot exclude yourself')
      }

      return this.prismaService.workspaceMember.delete({
        where: {
          userId_workspaceId: { userId: excludeUserId, workspaceId },
        },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async leave(userId: string, workspaceId: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
      include: { boards: { include: { boardMembers: true } } },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    if (workspace.createById === userId) {
      throw new BadRequestException(
        'you cannot leave from your own workspace'
      )
    }

    await this.prismaService.boardMember.deleteMany({
      where: {
        userId,
        board: { boardMembers: { some: { userId } } },
      },
    })

    await this.prismaService.workspaceMember.delete({
      where: { userId_workspaceId: { userId, workspaceId } },
    })
  }

  async deleteWorkspace(userId: string, workspaceId: string) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (!workspace) {
      throw new BadRequestException()
    }

    const ability =
      await this.workspaceAbilityFactory.createForUser(userId)
    if (
      ability.can(
        WorkspaceActions.Delete,
        plainToInstance(Workspace, workspace)
      )
    ) {
      return this.prismaService.workspace.delete({
        where: { id: workspaceId },
      })
    } else {
      throw new ForbiddenException()
    }
  }
}
