import { ApiProperty } from '@nestjs/swagger'

import {
  Board,
  type Board as BoardAsType,
} from '../../board/entities/board.entity'
import {
  BoardMember,
  type BoardMember as BoardMemberAsType,
} from '../../boardMember/entities/boardMember.entity'
import {
  Notification,
  type Notification as NotificationAsType,
} from '../../notification/entities/notification.entity'
import {
  Session,
  type Session as SessionAsType,
} from '../../session/entities/session.entity'
import {
  Workspace,
  type Workspace as WorkspaceAsType,
} from '../../workspace/entities/workspace.entity'
import {
  WorkspaceMember,
  type WorkspaceMember as WorkspaceMemberAsType,
} from '../../workspaceMember/entities/workspaceMember.entity'

export class User {
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
  username: string
  @ApiProperty({
    type: 'string',
  })
  email: string
  @ApiProperty({
    minimum: 5,
    minLength: 5,
    type: 'string',
  })
  password: string
  @ApiProperty({
    type: () => Session,
    isArray: true,
    required: false,
  })
  sessions?: SessionAsType[]
  @ApiProperty({
    type: () => Workspace,
    isArray: true,
    required: false,
  })
  createdWorkspaces?: WorkspaceAsType[]
  @ApiProperty({
    type: () => Board,
    isArray: true,
    required: false,
  })
  createdBoards?: BoardAsType[]
  @ApiProperty({
    type: () => WorkspaceMember,
    isArray: true,
    required: false,
  })
  workspacesMemberships?: WorkspaceMemberAsType[]
  @ApiProperty({
    type: () => BoardMember,
    isArray: true,
    required: false,
  })
  boardMemberships?: BoardMemberAsType[]
  @ApiProperty({
    type: () => Notification,
    isArray: true,
    required: false,
  })
  notificationRecipient?: NotificationAsType[]
  @ApiProperty({
    type: () => Notification,
    isArray: true,
    required: false,
  })
  notificationSender?: NotificationAsType[]
}
