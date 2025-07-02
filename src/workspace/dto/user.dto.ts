import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'
import { User } from 'src/generated/user/entities/user.entity'

export class WorkspaceUserDto extends User {
  @ApiProperty()
  @IsBoolean()
  isInvited: boolean
}
