import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ExcludeDto {
  @ApiProperty()
  @IsString()
  userId: string
}
