import { ApiProperty } from '@nestjs/swagger'

export class BoardColumnDto {
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
    type: 'string',
  })
  title: string
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  idx: number
}
