import { WorkspacePermissions } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class WorkspaceMemberDto {
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
    isArray: true,
    enum: WorkspacePermissions,
    enumName: 'WorkspacePermissions',
  })
  permissions: WorkspacePermissions[]
}
