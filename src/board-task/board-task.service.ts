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
import { CreateTaskDto } from 'src/generated/task/dto/create-task.dto'
import { UpdateTaskDto } from 'src/generated/task/dto/update-task.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BoardTaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boardAbilityFactory: BoardAbilityFactory
  ) {}

  async createTask(
    userId: string,
    boardId: string,
    dto: CreateTaskDto
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
      return this.prismaService.task.create({
        data: dto,
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async getTask(userId: string, boardId: string, taskId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      throw new BadRequestException()
    }

    const ability =
      await this.boardAbilityFactory.createForUser(userId)
    if (
      ability.can(BoardActions.Read, plainToInstance(Board, board))
    ) {
      return this.prismaService.task.findUnique({
        where: { id: taskId },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async updateTask(
    userId: string,
    boardId: string,
    taskId: string,
    dto: UpdateTaskDto
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
      return this.prismaService.task.update({
        where: { id: taskId },
        data: { ...dto },
      })
    } else {
      throw new ForbiddenException()
    }
  }
}
