import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { BoardColumnService } from 'src/board-column/board-column.service'
import { ColumnSwapDto } from 'src/board-column/dto/columns-swap.dto'
import { BoardTaskService } from 'src/board-task/board-task.service'
import { TaskSwapDto } from 'src/board-task/dto/task-swap.dto'
import { CreateBoardDto } from 'src/generated/board/dto/create-board.dto'
import { Board } from 'src/generated/board/entities/board.entity'
import { CreateBoardColumnDto } from 'src/generated/boardColumn/dto/create-boardColumn.dto'
import { UpdateBoardColumnDto } from 'src/generated/boardColumn/dto/update-boardColumn.dto'
import { BoardColumn } from 'src/generated/boardColumn/entities/boardColumn.entity'
import { CreateTaskDto } from 'src/generated/task/dto/create-task.dto'
import { UpdateTaskDto } from 'src/generated/task/dto/update-task.dto'
import { Task } from 'src/generated/task/entities/task.entity'

import { BoardService } from './board.service'

@UseGuards(JwtGuard)
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly boardColumnService: BoardColumnService,
    private readonly boardTaskService: BoardTaskService
  ) {}

  @ApiResponse({ status: 200, type: Board })
  @Get(':id')
  getBoard(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string
  ) {
    return this.boardService.getBoardById(sub, boardId)
  }

  @ApiResponse({ status: 201, type: Board })
  @Post()
  createBoard(@User() { sub }: JwtDto, @Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(sub, dto)
  }

  @ApiResponse({ status: 201, type: BoardColumn })
  @Post(':id/column')
  createColumn(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateBoardColumnDto
  ) {
    return this.boardColumnService.createColumn(sub, dto)
  }

  @ApiResponse({ status: 201, type: BoardColumn })
  @Patch(':id/column/:columnId')
  updateColumn(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: UpdateBoardColumnDto
  ) {
    return this.boardColumnService.updateColumn(
      sub,
      boardId,
      columnId,
      dto
    )
  }

  @ApiResponse({ status: 201, type: BoardColumn })
  @Delete(':id/column/:columnId')
  deleteColumn(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string
  ) {
    return this.boardColumnService.deleteColumn(
      sub,
      boardId,
      columnId
    )
  }

  @ApiResponse({ status: 201, type: Task })
  @Post(':id/tasks')
  createTask(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.boardTaskService.createTask(sub, boardId, dto)
  }

  @ApiResponse({ status: 200, type: [Task] })
  @Get(':id/tasks')
  getTasks(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string
  ) {
    return this.boardTaskService.getTasks(sub, boardId)
  }

  @ApiResponse({ status: 200, type: Task })
  @Get(':id/tasks/:taskId')
  getTask(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.boardTaskService.getTask(sub, boardId, taskId)
  }

  @ApiResponse({ status: 201, type: Task })
  @Patch(':id/tasks/:taskId')
  updateTask(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskDto
  ) {
    return this.boardTaskService.updateTask(sub, boardId, taskId, dto)
  }

  @ApiResponse({ status: 201, type: Task })
  @Delete(':id/tasks/:taskId')
  deleteTask(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string
  ) {
    return this.boardTaskService.deleteTask(sub, boardId, taskId)
  }

  @ApiResponse({ status: 200, type: Board })
  @Patch(':id/swap/columns')
  swapColumns(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Body() dto: ColumnSwapDto
  ) {
    return this.boardColumnService.swapColumns(sub, boardId, dto)
  }

  @ApiResponse({ status: 200, type: BoardColumn })
  @Patch(':id/swap/tasks')
  swapTasks(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) boardId: string,
    @Body() dto: TaskSwapDto
  ) {
    return this.boardTaskService.swapTasks(sub, boardId, dto)
  }
}
