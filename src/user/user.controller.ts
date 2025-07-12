import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'src/auth/decorators/user.decorator'
import { JwtDto } from 'src/auth/dto/auth.dto'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { BoardService } from 'src/board/board.service'
import { PaginatedBoardsDto } from 'src/board/dto/paginated-boards.dto'
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
    private readonly workspaceService: WorkspaceService,
    private readonly boardService: BoardService
  ) {}

  @ApiResponse({ status: 200, type: PaginatedUsersDto })
  @Get('list')
  listUsers(@Query() pageOptions: PageOptionsDto) {
    return this.userService.listUsers(pageOptions)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceDto })
  @Get('workspaces')
  findWorkSpaces(
    @User() { sub }: JwtDto,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.workspaceService.findListByUserId(sub, pageOptions)
  }

  @ApiResponse({ status: 200, type: PaginatedWorkspaceDto })
  @Get('workspaces/boards')
  listWorkspaceBoards(
    @User() { sub }: JwtDto,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.workspaceService.findListByUserIdWithBoards(
      sub,
      pageOptions
    )
  }

  @ApiResponse({ status: 200, type: PaginatedBoardsDto })
  @Get('boards')
  listBoards(
    @User() { sub }: JwtDto,
    @Query() pageOptions: PageOptionsDto
  ) {
    return this.boardService.getUserBoards(sub, pageOptions)
  }
}
