import { WorkspaceVisibility } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import {
  User,
  type User as UserAsType,
} from '../../user/entities/user.entity'
import {
  WorkspaceMember,
  type WorkspaceMember as WorkspaceMemberAsType,
} from '../../workspaceMember/entities/workspaceMember.entity'
import {
  Notification,
  type Notification as NotificationAsType,
} from '../../notification/entities/notification.entity'
import {
  Board,
  type Board as BoardAsType,
} from '../../board/entities/board.entity'

export class Workspace {
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
    minimum: 3,
    minLength: 3,
    type: 'string',
  })
  title: string
  @ApiProperty({
    enum: WorkspaceVisibility,
    enumName: 'WorkspaceVisibility',
  })
  visibility: WorkspaceVisibility
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
    type: () => WorkspaceMember,
    isArray: true,
    required: false,
  })
  members?: WorkspaceMemberAsType[]
  @ApiProperty({
    type: () => Notification,
    isArray: true,
    required: false,
  })
  notifications?: NotificationAsType[]
  @ApiProperty({
    type: () => Board,
    isArray: true,
    required: false,
  })
  boards?: BoardAsType[]
}
