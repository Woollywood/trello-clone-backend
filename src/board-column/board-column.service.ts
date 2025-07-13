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
}
