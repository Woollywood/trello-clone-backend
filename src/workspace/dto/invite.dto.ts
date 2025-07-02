import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class InviteDto {
  @ApiProperty()
  @IsString()
  userId: string
}
