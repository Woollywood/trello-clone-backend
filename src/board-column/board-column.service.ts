import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  BoardAbilityFactory,
  BoardActions,
} from 'src/board/board-ability.factory'
import { Board } from 'src/generated/board/entities/board.entity'
import { CreateBoardColumnDto } from 'src/generated/boardColumn/dto/create-boardColumn.dto'
import { UpdateBoardColumnDto } from 'src/generated/boardColumn/dto/update-boardColumn.dto'
import { PrismaService } from 'src/prisma/prisma.service'

import {
  ColumnSwapDto,
  ColumnSwapResponse,
} from './dto/columns-swap.dto'

@Injectable()
export class BoardColumnService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boardAbilityFactory: BoardAbilityFactory
  ) {}

  async createColumn(userId: string, dto: CreateBoardColumnDto) {
    const board = await this.prismaService.board.findUnique({
      where: { id: dto.board.connect.id },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)

    if (
      ability.can(BoardActions.Update, plainToInstance(Board, board))
    ) {
      return this.prismaService.boardColumn.create({
        data: dto,
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async deleteColumn(
    userId: string,
    boardId: string,
    columnId: string
  ) {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)

    if (
      ability.can(BoardActions.Update, plainToInstance(Board, board))
    ) {
      return this.prismaService.boardColumn.delete({
        where: { id: columnId },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async updateColumn(
    userId: string,
    boardId: string,
    columnId: string,
    dto: UpdateBoardColumnDto
  ) {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)

    if (
      ability.can(BoardActions.Update, plainToInstance(Board, board))
    ) {
      return this.prismaService.boardColumn.update({
        where: { id: columnId },
        data: { ...dto },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async swapColumns(
    userId: string,
    boardId: string,
    { srcId, destId }: ColumnSwapDto
  ): Promise<ColumnSwapResponse> {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)

    if (
      ability.can(BoardActions.Update, plainToInstance(Board, board))
    ) {
      const [srcColumn, destColumn] = await Promise.all([
        this.prismaService.boardColumn.findUnique({
          where: { id: srcId },
        }),
        this.prismaService.boardColumn.findUnique({
          where: { id: destId },
        }),
      ])
      if (!srcColumn || !destColumn) {
        throw new BadRequestException()
      }
      const [src, dest] = await Promise.all([
        this.prismaService.boardColumn.update({
          where: srcColumn,
          data: { idx: destColumn.idx },
        }),
        this.prismaService.boardColumn.update({
          where: destColumn,
          data: { idx: srcColumn.idx },
        }),
      ])
      return { src, dest }
    } else {
      throw new ForbiddenException()
    }
  }
}
