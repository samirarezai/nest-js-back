import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {

  @Get()
  getAllUsers() {
    return [
      {
        username: 'john_doe',
        email: 'john@example.com'
      }
    ]
  }
}
