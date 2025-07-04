import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateWorkspaceDto {
  @ApiProperty({
    minimum: 3,
    minLength: 3,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string
}
