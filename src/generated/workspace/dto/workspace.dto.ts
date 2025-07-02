import { WorkspaceVisibility } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class WorkspaceDto {
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
    type: 'string',
  })
  title: string
  @ApiProperty({
    enum: WorkspaceVisibility,
    enumName: 'WorkspaceVisibility',
  })
  visibility: WorkspaceVisibility
}
