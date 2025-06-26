import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'
import { CreateUserDto } from 'src/generated/user/dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  comparePassword(encryptedPassword: string, password: string) {
    return verify(encryptedPassword, password)
  }

  async createUser(dto: CreateUserDto) {
    const password = await hash(dto.password)
    return this.prismaService.user.create({
      data: { ...dto, password },
    })
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } })
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } })
  }

  findByUsername(username: string) {
    return this.prismaService.user.findUnique({ where: { username } })
  }
}
