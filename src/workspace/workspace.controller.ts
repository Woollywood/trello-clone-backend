import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { Notification } from 'src/generated/notification/entities/notification.entity'
import { UpdateWorkspaceDto } from 'src/generated/workspace/dto/update-workspace.dto'
import { Workspace } from 'src/generated/workspace/entities/workspace.entity'
import { WorkspaceMember } from 'src/generated/workspaceMember/entities/workspaceMember.entity'

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
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto
  ) {
    console.log('members')

    return this.workspaceService.listMembers(sub, id, pageOptions)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceUsersDto })
  @Get(':id/users')
  async listUsers(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto
  ) {
    console.log('users')

    return this.workspaceService.listUsers(sub, id, pageOptions)
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

  @ApiResponse({ status: 200, type: Notification })
  @Post(':id/invitation/invite')
  inviteUser(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: InviteDto
  ) {
    return this.workspaceService.inviteUser(id, sub, userId)
  }

  @ApiResponse({ status: 200, type: Notification })
  @Post(':id/invitation/exclude')
  excludeUserInvitation(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: ExcludeDto
  ) {
    return this.workspaceService.excludeInviteUser(id, sub, userId)
  }

  @ApiResponse({ status: 201, type: WorkspaceMember })
  @Post(':id/invitation/accept')
  acceptInvite(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) workspaceId: string
  ) {
    return this.workspaceService.acceptInvite({
      userId: sub,
      workspaceId,
    })
  }

  @ApiResponse({ status: 200 })
  @Post(':id/invitation/reject')
  rejectInvite(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) workspaceId: string
  ) {
    return this.workspaceService.rejectInvite({
      userId: sub,
      workspaceId,
    })
  }

  @ApiResponse({ status: 200, type: WorkspaceMember })
  @Post(':id/exclude')
  excludeUser(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: ExcludeDto
  ) {
    return this.workspaceService.excludeUser(sub, userId, id)
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post(':id/leave')
  leave(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) workspaceId: string
  ) {
    return this.workspaceService.leave(sub, workspaceId)
  }

  @ApiResponse({ status: HttpStatus.OK, type: Workspace })
  @Delete(':id')
  delete(
    @User() { sub }: JwtDto,
    @Param('id', ParseUUIDPipe) workspaceId: string
  ) {
    return this.workspaceService.deleteWorkspace(sub, workspaceId)
  }
}
