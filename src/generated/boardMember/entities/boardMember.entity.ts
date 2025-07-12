import { BoardRoles } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import {
  User,
  type User as UserAsType,
} from '../../user/entities/user.entity'
import {
  Board,
  type Board as BoardAsType,
} from '../../board/entities/board.entity'
import {
  Task,
  type Task as TaskAsType,
} from '../../task/entities/task.entity'

export class BoardMember {
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
    enum: BoardRoles,
    enumName: 'BoardRoles',
  })
  role: BoardRoles
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: UserAsType
  @ApiProperty({
    type: 'string',
  })
  userId: string
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
