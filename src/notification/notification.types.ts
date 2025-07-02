import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { User } from 'src/generated/user/entities/user.entity'

export class WorkspaceInvite {
  @ApiProperty()
  @IsUUID()
  sender: User

  @ApiProperty()
  @IsUUID()
  workspaceId: string
}
