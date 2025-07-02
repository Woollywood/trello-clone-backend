import { ApiProperty } from '@nestjs/swagger'
import { PageDto } from 'src/common/dto/page.dto'
import { User } from 'src/generated/user/entities/user.entity'

export class PaginatedUsersDto extends PageDto<User> {
  @ApiProperty({ type: [User] })
  declare data: User[]
}
