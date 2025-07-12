import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'
import { Board } from 'src/generated/board/entities/board.entity'

export class PaginatedBoardsDto extends PageDto<Board> {
  @ApiProperty({ type: [Board] })
  declare data: Board[]
}
