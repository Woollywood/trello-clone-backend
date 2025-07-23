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

import { TaskSwapDto } from './dto/task-swap.dto'

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
      const column = await this.prismaService.boardColumn.findUnique({
        where: { id: dto.column.connect.id },
        include: { tasks: { orderBy: { idx: 'asc' } } },
      })
      const lastIdx = column?.tasks.slice().pop()?.idx ?? -1
      return this.prismaService.task.create({
        data: { ...dto, idx: lastIdx + 1 },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async getTasks(userId: string, boardId: string) {
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
      return this.prismaService.task.findMany({
        where: { board: { id: board.id } },
        orderBy: { idx: 'asc' },
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

  async deleteTask(userId: string, boardId: string, taskId: string) {
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
      return this.prismaService.task.delete({
        where: { id: taskId },
      })
    } else {
      throw new ForbiddenException()
    }
  }

  async swapTasks(
    userId: string,
    boardId: string,
    { srcId, destId, destColumnId }: TaskSwapDto
  ) {
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
      include: {
        boardColumns: {
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
      ability.can(BoardActions.Update, plainToInstance(Board, board))
    ) {
      const destColumn = board.boardColumns.find(({ tasks }) =>
        tasks.some(
          ({ boardColumnId }) => boardColumnId === destColumnId
        )
      )

      const srcTask = await this.prismaService.task.findUnique({
        where: { id: srcId },
      })

      if (!srcTask) {
        throw new BadRequestException()
      }

      if (destId) {
        const destTask = await this.prismaService.task.findUnique({
          where: { id: destId },
          include: { column: true },
        })

        if (!destTask) {
          throw new BadRequestException()
        }

        if (destColumn) {
          const isSameBoard =
            srcTask.boardColumnId === destTask.boardColumnId
          if (isSameBoard) {
            const isLeft = destTask.idx < srcTask.idx

            const transaction = [
              ...destColumn.tasks
                .filter(
                  ({ id, idx }) =>
                    id !== srcTask.id &&
                    (isLeft
                      ? idx >= destTask.idx && idx < srcTask.idx
                      : idx > srcTask.idx && idx <= destTask.idx)
                )
                .map(({ id, idx: oldIdx }) =>
                  this.prismaService.task.update({
                    where: { id },
                    data: { idx: isLeft ? oldIdx + 1 : oldIdx - 1 },
                  })
                ),
              this.prismaService.task.update({
                where: { id: srcTask.id },
                data: {
                  column: { connect: { id: destTask.boardColumnId } },
                  idx: destTask.idx,
                },
              }),
            ]
            return this.prismaService.$transaction(transaction)
          } else {
            const transaction = [
              ...destColumn.tasks
                .filter(({ idx }) => idx >= destTask.idx)
                .map(({ id, idx }) =>
                  this.prismaService.task.update({
                    where: { id },
                    data: { idx: idx + 1 },
                  })
                ),
              this.prismaService.task.update({
                where: { id: srcId },
                data: {
                  idx: destTask.idx,
                  column: { connect: { id: destTask.boardColumnId } },
                },
              }),
            ]
            return this.prismaService.$transaction(transaction)
          }
        }
      } else {
        const lastIdx = destColumn?.tasks.slice().pop()?.idx ?? -1

        await this.prismaService.task.update({
          where: { id: srcId },
          data: { idx: lastIdx + 1 },
        })
        return await this.prismaService.boardColumn.update({
          where: { id: destColumnId },
          data: {
            tasks: {
              connect: { id: srcTask.id },
            },
          },
        })
      }
    } else {
      throw new ForbiddenException()
    }
  }
}
