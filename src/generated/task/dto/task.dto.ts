import { ApiProperty } from '@nestjs/swagger'

export class TaskDto {
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
    type: 'string',
    nullable: true,
  })
  description: string | null
}
