import { NotificationType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class NotificationDto {
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
}
