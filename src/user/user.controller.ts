import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto'
import { PaginatedWorkspaceDto } from 'src/workspace/dto/paginated-workspace.dto'
import { WorkspaceService } from 'src/workspace/workspace.service'

import { PaginatedUsersDto } from './dto/paginated-users.dto'
import { UserService } from './user.service'

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService
  ) {}

  @ApiResponse({ status: 200, type: PaginatedUsersDto })
  @Get('list')
  async listUsers(
    @Query() pageOptions: PageOptionsDto,
    @Query('search', new DefaultValuePipe('')) search: string
  ) {
    return this.userService.listUsers(pageOptions, search)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceDto })
  @Get('workspaces')
  async findWorkSpaces(
    @User() { sub }: JwtDto,
    @Query() pageOptions: PageOptionsDto,
    @Query('search', new DefaultValuePipe('')) search: string
  ) {
    return this.workspaceService.findListByUserId(
      sub,
      pageOptions,
      search
    )
  }
}
