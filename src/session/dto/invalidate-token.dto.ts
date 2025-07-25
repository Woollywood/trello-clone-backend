import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class InvalidateTokenDto {
  @ApiProperty()
  @IsUUID()
  userId: string
}
