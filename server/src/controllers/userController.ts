import { JsonController, Get, Post, Body, Res } from 'routing-controllers';
import { IsString, IsEnum } from 'class-validator';
import { createUser, getAllUsers, authenticateUser } from '../services/userService';
import logger from '../utils/logger';
import { Response } from 'express';

class CreateUserRequest {
  @IsString() userNickname: string;
  @IsString() name: string;
  @IsString() password: string;
  @IsEnum(['driver', 'manager']) role: 'driver' | 'manager';
}

class LoginRequest {
  @IsString() userNickname: string;
  @IsString() password: string;
}

@JsonController('/users')
export class UserController {
  @Get('/')
  async getAllUsers() {
    return await getAllUsers();
  }

  @Post('/')
  async createUser(@Body() user: CreateUserRequest) {
    logger.info("User data received:", user); 
    const newUser = await createUser(user);
    return { message: 'User created successfully', user: newUser, token: 'xxxx-yyyy-xxxx-yyyyy' };
  }

  @Post('/login')
  async login(@Body() loginRequest: LoginRequest, @Res() response: Response) {
    const { userNickname, password } = loginRequest;
    const user = await authenticateUser(userNickname, password);

    if (user) {
      return {
        ...user,
        message: 'Login successful',
        vehiclePlate: (user as any).vehiclePlate,
        token: 'xxxx-yyyy-xxxx-yyyyy'
      };
    } else {
      return response.status(401).json({ message: 'Invalid credentials' });
    }
  }
}
