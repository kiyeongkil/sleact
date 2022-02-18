import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { UsersService } from './users.service';

class MockUserRepository {
  #data = [
    { id: 1, email: 'test@test.com'}
  ];
  findOne({ where: {email} }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return this.#data;
    }
    return null;
  }
}
class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, 
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야함', () => {
    expect(service.findByEmail('test@test.com')).resolves.toStrictEqual({
      email: 'test@test.com',
      id: 1,
    });
  });

  it.todo('findByEmail은 유저를 못 찾으면 null을 반환해야함', () => {
    expect(service.findByEmail('test@te.com')).resolves.toBe(null);
  });
});
