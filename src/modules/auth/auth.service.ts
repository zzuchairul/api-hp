import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { UsersRepository } from '../users/users.repository';
import { LoginResponseDTO } from './dto/login-response.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDTO): Promise<PublicUserDto> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const savedUser = await this.usersRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    const userData = plainToInstance(PublicUserDto, savedUser, {
      excludeExtraneousValues: true,
    });

    return userData;
  }

  async loginUser(dto: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      accessToken,
      role: user.role,
    };
  }
}
