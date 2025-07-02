import { WorkspacePermissions } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator'

export class CreateWorkspaceMemberDto {
  @ApiProperty({
    isArray: true,
    enum: WorkspacePermissions,
    enumName: 'WorkspacePermissions',
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(WorkspacePermissions, { each: true })
  permissions: WorkspacePermissions[]
}
