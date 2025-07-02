import { WorkspacePermissions } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
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
