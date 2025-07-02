import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'
import { Notification } from 'src/generated/notification/entities/notification.entity'

export class PaginatedNotificationsDto extends PageDto<Notification> {
  @ApiProperty({ type: [Notification] })
  declare data: Notification[]
}
