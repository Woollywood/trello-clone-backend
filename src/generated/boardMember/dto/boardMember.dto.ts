import { ApiProperty } from '@nestjs/swagger'
import { BoardRoles } from '@prisma/client'

export class BoardMemberDto {
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
}
