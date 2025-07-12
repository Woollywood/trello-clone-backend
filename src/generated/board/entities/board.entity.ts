import { BoardVisibility } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import {
  User,
  type User as UserAsType,
} from '../../user/entities/user.entity'
import {
  Workspace,
  type Workspace as WorkspaceAsType,
} from '../../workspace/entities/workspace.entity'
import {
  BoardMember,
  type BoardMember as BoardMemberAsType,
} from '../../boardMember/entities/boardMember.entity'
import {
  BoardColumn,
  type BoardColumn as BoardColumnAsType,
} from '../../boardColumn/entities/boardColumn.entity'

export class Board {
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
    enum: BoardVisibility,
    enumName: 'BoardVisibility',
  })
  visibility: BoardVisibility
  @ApiProperty({
    type: 'string',
  })
  title: string
  @ApiProperty({
    type: () => User,
    required: false,
  })
  createBy?: UserAsType
  @ApiProperty({
    type: 'string',
  })
  createById: string
  @ApiProperty({
    type: () => Workspace,
    required: false,
    nullable: true,
  })
  workspace?: WorkspaceAsType | null
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  workspaceId: string | null
  @ApiProperty({
    type: () => BoardMember,
    isArray: true,
    required: false,
  })
  boardMembers?: BoardMemberAsType[]
  @ApiProperty({
    type: () => BoardColumn,
    isArray: true,
    required: false,
  })
  boardColumns?: BoardColumnAsType[]
}
