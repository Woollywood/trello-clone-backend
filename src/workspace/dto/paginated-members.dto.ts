import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'
import { WorkspaceMember } from 'src/generated/workspaceMember/entities/workspaceMember.entity'

export class PaginatedWorkspaceMembersDto extends PageDto<WorkspaceMember> {
  @ApiProperty({ type: [WorkspaceMember] })
  declare data: WorkspaceMember[]
}
