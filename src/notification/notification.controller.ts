import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'

import { PaginatedNotificationsDto } from './dto/paginated-notifications.dto'
import { NotificationService } from './notification.service'

@UseGuards(JwtGuard)
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  @ApiResponse({ status: 200, type: PaginatedNotificationsDto })
  @Get('list')
  async listNotifications(
    @User() { sub }: JwtDto,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.notificationService.listNotifications(
      sub,
      pageOptions
    )
  }

  @ApiResponse({ status: 200, type: Number })
  @Get('list/count')
  async countNotifications(@User() { sub }: JwtDto) {
    return this.notificationService.countNotifications(sub)
  }
}
