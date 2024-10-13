import { IsString, IsEnum } from 'class-validator';

export class CreateUserRequest {
  @IsString() userNickname: string;
  @IsString() name: string;
  @IsString() password: string;
  @IsEnum(['driver', 'manager']) role: 'driver' | 'manager';
}

export class LoginRequest {
  @IsString() userNickname: string;
  @IsString() password: string;
}
