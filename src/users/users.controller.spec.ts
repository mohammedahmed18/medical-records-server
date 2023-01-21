import { PrismaService } from '../database/prisma.service';
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService ;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService , PrismaService, ConfigService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    usersService = await moduleRef.resolve<UsersService>(UsersService);
    usersController = await moduleRef.resolve<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return array of all users', async () => {
      const result = [
        {
          id: 'aca5ed76-ff2a-4f8f-87b0-bd6848f17199',
          nationalId: '11111111111112',
          name: 'mohammed ahmed',
          email: 'm@m.com',
          createdAt: new Date('2023-01-16T13:39:09.581Z'),
          updatedAt: new Date('2023-01-16T13:39:09.581Z'),
        },
      ];
      jest
        .spyOn(usersService, 'getAll')
        .mockImplementation(() => Promise.resolve(result));

      
      expect(await usersService.getAll()).toBe(result);
    });
  });

  describe("createUser" , () => {
    it("should create a new user and returns it" , async () => {
        const inputData = {
            name : "john",
            nationalId : "23212342123454",
            email : "m@m.com",
            password : "123456"
        } as CreateUserDto

        const returnedData  = {
            id : Date.now().toString(),
            hashedRt : Date.now().toString(),
            createdAt: new Date('2023-01-16T13:39:09.581Z'),
            updatedAt: new Date('2023-01-16T13:39:09.581Z'),

            name : "john",
            nationalId : "23212342123454",
            email : "m@m.com",
            password : "123456",
        }
        jest.spyOn(usersService, 'createUser')
        .mockImplementation((i) => Promise.resolve({...returnedData , ...i}));

        const result = await usersController.createUser(inputData);
        expect(result).toStrictEqual(returnedData)
    })
  })


});
