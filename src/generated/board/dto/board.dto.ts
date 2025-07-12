import { ApiProperty } from '@nestjs/swagger'
import { BoardVisibility } from '@prisma/client'

export class BoardDto {
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
}
