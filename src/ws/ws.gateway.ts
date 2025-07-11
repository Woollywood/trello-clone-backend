import { OnModuleInit, UseGuards } from '@nestjs/common'
import {
  GatewayMetadata,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { jwtDecode } from 'jwt-decode'
import { Server, type Socket } from 'socket.io'
import { AuthService } from 'src/auth/auth.service'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { Notification } from 'src/generated/notification/entities/notification.entity'
import { getAccessTokenFromHeader } from 'src/utils'

@UseGuards(JwtGuard)
@WebSocketGateway<GatewayMetadata>({
  cors: { origin: '*', credentials: true },
})
export class WsGateway implements OnModuleInit {
  private clients: Map<string, Socket> = new Map()

  @WebSocketServer()
  server: Server

  constructor(private readonly authService: AuthService) {}

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log(this.clients.keys())

      let isAuth = false
      if (socket.handshake.headers.authorization) {
        const accessToken = getAccessTokenFromHeader(
          socket.handshake.headers.authorization
        )
        const jwt = jwtDecode<JwtDto>(accessToken)
        if (jwt) {
          console.log({ sub: jwt.sub })

          await this.authService.validateJwtUser(jwt, accessToken)
          this.clients.set(jwt.sub, socket)
          isAuth = true

          socket.on('disconnect', () => {
            console.log(`${jwt.sub} disconnect`)

            this.clients.delete(jwt.sub)
          })
        }
      }

      if (!isAuth) {
        socket.disconnect()
      }
    })
    this.server.on('disconnect', () => {
      console.log('disconnect')
    })
  }

  sendNotification(userId: string, invitation: Notification) {
    this.clients.get(userId)?.emit('notifications/get', invitation)
  }

  removeNotification(userId: string, invitation: Notification) {
    this.clients.get(userId)?.emit('notifications/remove', invitation)
  }

  recipientAction(userId: string, invitation: Notification) {
    this.clients
      .get(userId)
      ?.emit('notifications/recipient/action', invitation)
  }

  @SubscribeMessage('notifications/get')
  notificationGetSubscribe(@MessageBody() body: Notification) {
    console.log(body)
  }

  @SubscribeMessage('notifications/remove')
  notificationRemoveSubscribe(@MessageBody() body: Notification) {
    console.log(body)
  }

  @SubscribeMessage('notifications/recipient/action')
  notificationRecipientActionSubscribe(
    @MessageBody() { senderId }: Notification
  ) {
    console.log({ senderId })
  }
}
