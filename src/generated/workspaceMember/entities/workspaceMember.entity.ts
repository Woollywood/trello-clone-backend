import { ApiProperty } from '@nestjs/swagger'
import { WorkspaceRoles } from '@prisma/client'

import {
  User,
  type User as UserAsType,
} from '../../user/entities/user.entity'
import {
  Workspace,
  type Workspace as WorkspaceAsType,
} from '../../workspace/entities/workspace.entity'

export class WorkspaceMember {
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
    enum: WorkspaceRoles,
    enumName: 'WorkspaceRoles',
  })
  role: WorkspaceRoles
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
    type: () => Workspace,
    required: false,
  })
  workspace?: WorkspaceAsType
  @ApiProperty({
    type: 'string',
  })
  workspaceId: string
}
