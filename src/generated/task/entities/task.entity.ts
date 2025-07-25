import { ApiProperty } from '@nestjs/swagger'

import {
  Board,
  type Board as BoardAsType,
} from '../../board/entities/board.entity'
import {
  BoardColumn,
  type BoardColumn as BoardColumnAsType,
} from '../../boardColumn/entities/boardColumn.entity'
import {
  BoardMember,
  type BoardMember as BoardMemberAsType,
} from '../../boardMember/entities/boardMember.entity'

export class Task {
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
    type: 'string',
    nullable: true,
  })
  description: string | null
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  idx: number
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
    type: () => BoardColumn,
    required: false,
  })
  column?: BoardColumnAsType
  @ApiProperty({
    type: 'string',
  })
  boardColumnId: string
  @ApiProperty({
    type: () => BoardMember,
    isArray: true,
    required: false,
  })
  participants?: BoardMemberAsType[]
}
