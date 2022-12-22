import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.random() * 999999, email, password } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('test@hotmail.com', 'pass12345');

    expect(user.password).not.toEqual('pass12345');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email in use', async () => {
    await service.signup('test1@hotmail.com', 'mypassword1');

    await expect(
      service.signup('test1@hotmail.com', 'mypassword1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if signin is called with an unusual email', async () => {
    await expect(
      service.signin('test2@hotmail.com', 'mypassword2'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('test3@hotmail.com', 'mypassword3');

    await expect(
      service.signin('test3@hotmail.com', 'mypassword333'),
    ).rejects.toThrow(BadRequestException);
  });

  it('return a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'test@hotmail.com',
    //       password:
    //         'b605e32f6a85e008.5f532f1216bcfa15c288a51f7c525b66e9754218aea257917d0a2df1b26aa0c1',
    //     } as User,
    //   ]);

    await service.signup('test@hotmail.com', 'mypassword');

    const user = await service.signin('test@hotmail.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
