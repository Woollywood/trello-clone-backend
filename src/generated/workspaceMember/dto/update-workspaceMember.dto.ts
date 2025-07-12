import { WorkspaceRoles } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

export class UpdateWorkspaceMemberDto {
  @ApiProperty({
    enum: WorkspaceRoles,
    enumName: 'WorkspaceRoles',
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkspaceRoles)
  role?: WorkspaceRoles
}
