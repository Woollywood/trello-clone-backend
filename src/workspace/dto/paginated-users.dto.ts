import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'

import { WorkspaceUserDto } from './user.dto'

export class PaginatedWorkspaceUsersDto extends PageDto<WorkspaceUserDto> {
  @ApiProperty({ type: [WorkspaceUserDto] })
  declare data: WorkspaceUserDto[]
}
