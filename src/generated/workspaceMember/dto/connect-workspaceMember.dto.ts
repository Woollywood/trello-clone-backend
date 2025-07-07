import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class WorkspaceMemberUserIdWorkspaceIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  userId: string
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  workspaceId: string
}

@ApiExtraModels(WorkspaceMemberUserIdWorkspaceIdUniqueInputDto)
export class ConnectWorkspaceMemberDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string
  @ApiProperty({
    type: WorkspaceMemberUserIdWorkspaceIdUniqueInputDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspaceMemberUserIdWorkspaceIdUniqueInputDto)
  userId_workspaceId?: WorkspaceMemberUserIdWorkspaceIdUniqueInputDto
}
