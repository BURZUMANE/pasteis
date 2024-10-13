// src/controllers/UserController.ts
import { Get, Post, JsonController, Body, Res } from 'routing-controllers';
import { Response } from 'express';
import { createUser, getAllUsers, authenticateUser } from './userService';
import logger from '../../common/logger';
import { CreateUserRequest, LoginRequest } from './userRequests';

@JsonController('/users')
export class UserController {
  @Get('/')
  async getAllUsers() {
    const users = await getAllUsers();
    return users;
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
        vehiclePlate: user.vehiclePlate,
        token: 'xxxx-yyyy-xxxx-yyyyy'
      };
    } else {
      return response.status(401).json({ message: 'Invalid credentials' });
    }
  }
}
