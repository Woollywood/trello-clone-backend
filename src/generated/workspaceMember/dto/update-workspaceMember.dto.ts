import { ApiProperty } from '@nestjs/swagger'
import { WorkspacePermissions } from '@prisma/client'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

export class UpdateWorkspaceMemberDto {
  @ApiProperty({
    isArray: true,
    enum: WorkspacePermissions,
    enumName: 'WorkspacePermissions',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WorkspacePermissions, { each: true })
  permissions?: WorkspacePermissions[]
}
