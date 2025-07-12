import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { CreateBoardDto } from 'src/generated/board/dto/create-board.dto'
import { Board } from 'src/generated/board/entities/board.entity'

import { BoardService } from './board.service'

@UseGuards(JwtGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

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
}
