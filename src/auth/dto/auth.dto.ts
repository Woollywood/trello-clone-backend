import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'
import { CreateUserDto } from 'src/generated/user/dto/create-user.dto'

export class JwtDto {
  @ApiProperty()
  @IsUUID()
  sub: string

  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string

  @ApiProperty()
  @IsEmail()
  email: string
}

export class TokensDto {
  @ApiProperty()
  @IsString()
  accessToken: string

  @ApiProperty()
  @IsString()
  refreshToken: string
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}

export class SignUpDto extends OmitType(CreateUserDto, ['email']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string
}

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(5)
  password: string
}
