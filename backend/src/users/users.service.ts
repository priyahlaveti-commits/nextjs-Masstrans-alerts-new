import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'admin@masstrans.com',
      password: 'password123', // In a real app, this should be hashed
      name: 'John Carter',
      role: 'Admin',
      avatar: 'JC'
    },
    {
      userId: 2,
      email: 'user@masstrans.com',
      password: 'password123',
      name: 'Jane Doe',
      role: 'User',
      avatar: 'JD'
    }
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findOrCreateGoogleUser(profile: any): Promise<any> {
    let user = this.users.find(u => u.email === profile.emails[0].value);
    if (!user) {
      const newUser = {
        userId: this.users.length + 1,
        email: profile.emails[0].value,
        password: 'google-auth-no-password', // Placeholder for non-local users
        name: profile.displayName,
        role: 'User',
        avatar: profile.name?.givenName?.[0] || profile.displayName[0]
      };
      this.users.push(newUser);
      return newUser;
    }
    return user;
  }
}
