import { Injectable } from '@nestjs/common';
import { User } from './dto/get-users.dto';
@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      username: 'john_doe',
      email: 'john@example.com',
    },
  ];

  getAllUsers() {
    return this.users;
  }
}
