import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  ConnectWorkspaceDto,
  type ConnectWorkspaceDto as ConnectWorkspaceDtoAsType,
} from '../../workspace/dto/connect-workspace.dto'
import {
  ConnectUserDto,
  type ConnectUserDto as ConnectUserDtoAsType,
} from '../../user/dto/connect-user.dto'

export class CreateNotificationWorkspaceRelationInputDto {
  @ApiProperty({
    type: ConnectWorkspaceDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectWorkspaceDto)
  connect: ConnectWorkspaceDtoAsType
}
export class CreateNotificationRecipientRelationInputDto {
  @ApiProperty({
    type: ConnectUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectUserDto)
  connect: ConnectUserDtoAsType
}
export class CreateNotificationSenderRelationInputDto {
  @ApiProperty({
    type: ConnectUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectUserDto)
  connect: ConnectUserDtoAsType
}

@ApiExtraModels(
  ConnectWorkspaceDto,
  CreateNotificationWorkspaceRelationInputDto,
  ConnectUserDto,
  CreateNotificationRecipientRelationInputDto,
  ConnectUserDto,
  CreateNotificationSenderRelationInputDto
)
export class CreateNotificationDto {
  @ApiProperty({
    required: false,
    type: CreateNotificationWorkspaceRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNotificationWorkspaceRelationInputDto)
  workspace?: CreateNotificationWorkspaceRelationInputDto
  @ApiProperty({
    type: CreateNotificationRecipientRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateNotificationRecipientRelationInputDto)
  recipient: CreateNotificationRecipientRelationInputDto
  @ApiProperty({
    required: false,
    type: CreateNotificationSenderRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNotificationSenderRelationInputDto)
  sender?: CreateNotificationSenderRelationInputDto
}
