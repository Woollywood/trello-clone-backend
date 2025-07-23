import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { BoardRoles } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PageDto } from 'src/common/dto/page.dto'
import { PageMetaDto } from 'src/common/dto/pageMeta.dto'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { CreateBoardDto } from 'src/generated/board/dto/create-board.dto'
import { Board } from 'src/generated/board/entities/board.entity'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  WorkspaceAbilityFactory,
  WorkspaceActions,
} from 'src/workspace/workspace-ability.factory'

import {
  BoardAbilityFactory,
  BoardActions,
} from './board-ability.factory'

@Injectable()
export class BoardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boardAbilityFactory: BoardAbilityFactory,
    private readonly workspaceAbilityFactory: WorkspaceAbilityFactory
  ) {}

  async getBoardById(userId: string, boardId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
      include: {
        boardColumns: {
          orderBy: { idx: 'asc' },
          include: { tasks: { orderBy: { idx: 'asc' } } },
        },
      },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)
    if (
      ability.can(BoardActions.Read, plainToInstance(Board, board))
    ) {
      return board
    } else {
      throw new ForbiddenException()
    }
  }

  createBoard(userId: string, dto: CreateBoardDto) {
    return this.prismaService.board.create({
      data: {
        ...dto,
        createBy: { connect: { id: userId } },
        boardMembers: { create: { userId, role: BoardRoles.ADMIN } },
      },
    })
  }

  async getWorkspaceBoards(
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
        this.prismaService.board.findMany({
          where: {
            title: { contains: search, mode: 'insensitive' },
            workspaceId,
          },
          skip,
          orderBy: { createdAt: order },
          take,
        }),
        this.prismaService.board.count({
          where: {
            title: { contains: search, mode: 'insensitive' },
            workspaceId,
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

  async getUserBoards(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ) {
    const { search, skip, order, take } = pageOptionsDto
    const [entities, entitiesCount] = await Promise.all([
      this.prismaService.board.findMany({
        where: {
          title: { contains: search, mode: 'insensitive' },
          createById: userId,
          boardMembers: { some: { userId } },
        },
        skip,
        orderBy: { createdAt: order },
        take,
      }),
      this.prismaService.board.count({
        where: {
          title: { contains: search, mode: 'insensitive' },
          createById: userId,
        },
      }),
    ])

    const pageMetaDto = new PageMetaDto({
      itemCount: entitiesCount,
      pageOptionsDto,
    })
    return new PageDto(entities, pageMetaDto)
  }
}
