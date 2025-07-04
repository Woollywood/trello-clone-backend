import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import {
  WorkspacePermissions,
  WorkspaceVisibility,
} from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PageDto } from 'src/common/dto/page.dto'
import { PageMetaDto } from 'src/common/dto/pageMeta.dto'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { CreateWorkspaceDto } from 'src/generated/workspace/dto/create-workspace.dto'
import { UpdateWorkspaceDto } from 'src/generated/workspace/dto/update-workspace.dto'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { NotificationService } from 'src/notification/notification.service'
import { PrismaService } from 'src/prisma/prisma.service'

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
    private readonly notificationService: NotificationService
  ) {}

  create(dto: CreateWorkspaceDto, userId: string) {
    return this.prismaService.workspace.create({
      data: {
        ...dto,
        visibility: WorkspaceVisibility.PRIVATE,
        members: {
          create: {
            userId,
            permissions: [WorkspacePermissions.MANAGE],
          },
        },
        createBy: { connect: { id: userId } },
      },
    })
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

  async listMembers(id: string, pageOptionsDto: PageOptionsDto) {
    const { search, skip, order, take } = pageOptionsDto
    const [entities, entitiesCount] = await Promise.all([
      this.prismaService.workspaceMember.findMany({
        include: { user: true },
        where: {
          workspaceId: id,
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
          workspaceId: id,
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
  }

  async listUsers(
    workspaceId: string,
    currentUserId: string,
    pageOptionsDto: PageOptionsDto
  ): Promise<PaginatedWorkspaceUsersDto> {
    const { search, skip, order, take } = pageOptionsDto
    const [rawEntities, entitiesCount] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
          id: { not: { equals: currentUserId } },
          username: { contains: search, mode: 'insensitive' },
          workspacesMembership: { every: { NOT: { workspaceId } } },
        },
        skip,
        orderBy: { createdAt: order },
        take,
      }),
      this.prismaService.user.count({
        where: {
          id: { not: { equals: currentUserId } },
          username: { contains: search, mode: 'insensitive' },
          workspacesMembership: { every: { NOT: { workspaceId } } },
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
  }

  async findListByUserId(
    userId: string,
    pageOptionsDto: PageOptionsDto,
    search: string
  ) {
    const { skip, order, take } = pageOptionsDto
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
        include: { workspacesMembership: true },
      })

      if (!recipient) {
        throw new BadRequestException('recipient not found')
      }

      const { workspacesMembership } = recipient
      if (
        workspacesMembership.some(
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

      return this.notificationService.sendWorkspaceInvite({
        recipient: { connect: { id: recipientId } },
        sender: { connect: { id: senderId } },
        workspace: { connect: { id: workspaceId } },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async excludeUser(
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
        WorkspaceActions.Exclude,
        plainToInstance(Workspace, workspace)
      )
    ) {
      const recipient = await this.prismaService.user.findUnique({
        where: { id: recipientId },
        include: { workspacesMembership: true },
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

      return this.notificationService.excludeWorkspaceInvite({
        recipientId,
        workspaceId,
      })
    } else {
      throw new ForbiddenException()
    }
  }
}
