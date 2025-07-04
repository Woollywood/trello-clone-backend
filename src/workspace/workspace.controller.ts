import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { UpdateWorkspaceDto } from 'src/generated/workspace/dto/update-workspace.dto'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'

import { ExcludeDto } from './dto/exclude.dto'
import { InviteDto } from './dto/invite.dto'
import { PaginatedWorkspaceMembersDto } from './dto/paginated-members.dto'
import { PaginatedWorkspaceUsersDto } from './dto/paginated-users.dto'
import { UpdateWorkspaceVisibilityDto } from './dto/update.dto'
import { WorkspaceService } from './workspace.service'

@UseGuards(JwtGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiResponse({ status: 200, type: Workspace })
  @Get(':id')
  findWorkspace(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.workspaceService.findItemById(sub, id)
  }

  @ApiResponse({ status: 200, type: Workspace })
  @Patch(':id')
  updateWorkspace(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkspaceDto
  ) {
    return this.workspaceService.updateItemById(sub, id, dto)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceMembersDto })
  @Get(':id/members')
  async listMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.workspaceService.listMembers(id, pageOptions)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceUsersDto })
  @Get(':id/users')
  async listUsers(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.workspaceService.listUsers(id, sub, pageOptions)
  }

  @ApiResponse({ status: 200, type: Workspace })
  @Patch(':id/visibility')
  updateVisibility(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { visibility }: UpdateWorkspaceVisibilityDto
  ) {
    return this.workspaceService.updateItemById(sub, id, {
      visibility,
    })
  }

  @ApiResponse({ status: 200, type: Workspace })
  @Post(':id/invite')
  inviteUser(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: InviteDto
  ) {
    return this.workspaceService.inviteUser(id, sub, userId)
  }

  @ApiResponse({ status: 200, type: Workspace })
  @Post(':id/exclude')
  excludeUser(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: ExcludeDto
  ) {
    return this.workspaceService.excludeUser(id, sub, userId)
  }
}
