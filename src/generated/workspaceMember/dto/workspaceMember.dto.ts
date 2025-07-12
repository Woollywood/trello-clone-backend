import { ApiProperty } from '@nestjs/swagger'
import { WorkspaceRoles } from '@prisma/client'

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
    enum: WorkspaceRoles,
    enumName: 'WorkspaceRoles',
  })
  role: WorkspaceRoles
}
