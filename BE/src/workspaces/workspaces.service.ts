import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Workspaces } from '../entities/Workspaces';

@Injectable()
export class WorkspacesService {
  constructor (
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    private connection: Connection,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try{
      const workspace = this.workspacesRepository.create({
        name,
        url,
        OwnerId: myId,
      });
      const returned = await this.workspacesRepository.save(workspace);
  
      const [, channelReturned] = await Promise.all([
        queryRunner.manager.getRepository(WorkspaceMembers).save({
          UserId: myId,
          WorkspaceId: returned.id
        }),
        queryRunner.manager.getRepository(Channels).save({
          name: '일반',
          WorkspaceId: returned.id
        })
      ]);
  
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: myId,
        ChannelId: channelReturned.id
      });
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url
      })
      .getMany();
  }
  
  async createWorkspaceMembers(url, email) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const workspace = await this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoinAndSelect('workspace.Channels', 'Channels', 'workspace.url = :url', {
        url
      })
      .getOne();

      const user = await this.userRepository.findOne({ 
        where: { email }
      });
      if (!user) {
        throw new BadRequestException;
      }

      await queryRunner.manager.getRepository(Workspaces).save({
        id: workspace.id,
        UserId: user.id
      });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        ChannelId: workspace.Channels.find(
          (v) => v.name === '일반',
        ).id,
        UserId: user.id
      });
    } catch(error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { 
        id
      })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url
      })
      .getOne();
  }
}
