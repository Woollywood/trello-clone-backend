import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class NotificationWorkspaceIdRecipientIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  workspaceId: string
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  recipientId: string
}

@ApiExtraModels(NotificationWorkspaceIdRecipientIdUniqueInputDto)
export class ConnectNotificationDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string
  @ApiProperty({
    type: NotificationWorkspaceIdRecipientIdUniqueInputDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationWorkspaceIdRecipientIdUniqueInputDto)
  workspaceId_recipientId?: NotificationWorkspaceIdRecipientIdUniqueInputDto
}
