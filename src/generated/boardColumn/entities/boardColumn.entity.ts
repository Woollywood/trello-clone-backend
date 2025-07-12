import { ApiProperty } from '@nestjs/swagger'
import {
  Board,
  type Board as BoardAsType,
} from '../../board/entities/board.entity'
import {
  Task,
  type Task as TaskAsType,
} from '../../task/entities/task.entity'

export class BoardColumn {
  @ApiProperty({
    type: 'string',
  })
  id: string
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date
  @ApiProperty({
    type: 'string',
  })
  title: string
  @ApiProperty({
    type: () => Board,
    required: false,
  })
  board?: BoardAsType
  @ApiProperty({
    type: 'string',
  })
  boardId: string
  @ApiProperty({
    type: () => Task,
    isArray: true,
    required: false,
  })
  tasks?: TaskAsType[]
}
