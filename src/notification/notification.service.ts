import { Injectable } from '@nestjs/common'
import { NotificationType } from '@prisma/client'
import { PageDto } from 'src/common/dto/page.dto'
import { PageMetaDto } from 'src/common/dto/pageMeta.dto'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { CreateNotificationDto } from 'src/generated/notification/dto/create-notification.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  sendWorkspaceInvite({
    recipient,
    sender,
    workspace,
  }: CreateNotificationDto) {
    return this.prismaService.notification.create({
      data: {
        type: NotificationType.WORKSPACE_INVITATION,
        recipient: { connect: { id: recipient.connect.id } },
        sender: { connect: { id: sender?.connect.id } },
        workspace: { connect: { id: workspace?.connect.id } },
      },
      include: { workspace: true },
    })
  }

  excludeWorkspaceInvite(dto: {
    workspaceId: string
    recipientId: string
  }) {
    return this.prismaService.notification.delete({
      where: { workspaceId_recipientId: dto },
      include: { workspace: true },
    })
  }

  acceptWorkspaceInvite({
    recipientId,
    workspaceId,
  }: {
    workspaceId: string
    recipientId: string
  }) {
    return this.prismaService.notification.delete({
      where: {
        workspaceId_recipientId: { recipientId, workspaceId },
      },
    })
  }

  rejectWorkspaceInvite({
    recipientId,
    workspaceId,
  }: {
    workspaceId: string
    recipientId: string
  }) {
    return this.prismaService.notification.delete({
      where: {
        workspaceId_recipientId: { recipientId, workspaceId },
      },
    })
  }

  async listNotifications(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ) {
    const { skip, order, take } = pageOptionsDto
    const [entities, entitiesCount] = await Promise.all([
      this.prismaService.notification.findMany({
        where: { recipientId: userId },
        skip,
        orderBy: { createdAt: order },
        take,
        include: { workspace: true, sender: true },
      }),
      this.prismaService.notification.count({
        where: { recipientId: userId },
      }),
    ])

    const pageMetaDto = new PageMetaDto({
      itemCount: entitiesCount,
      pageOptionsDto,
    })
    return new PageDto(entities, pageMetaDto)
  }

  countNotifications(userId: string) {
    return this.prismaService.notification.count({
      where: { recipientId: userId },
    })
  }
}
