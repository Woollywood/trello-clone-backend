import { NotificationType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import {
  Workspace,
  type Workspace as WorkspaceAsType,
} from '../../workspace/entities/workspace.entity'
import {
  User,
  type User as UserAsType,
} from '../../user/entities/user.entity'

export class Notification {
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
    enum: NotificationType,
    enumName: 'NotificationType',
  })
  type: NotificationType
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
    type: () => User,
    required: false,
  })
  recipient?: UserAsType
  @ApiProperty({
    type: 'string',
  })
  recipientId: string
  @ApiProperty({
    type: () => User,
    required: false,
    nullable: true,
  })
  sender?: UserAsType | null
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  senderId: string | null
}
