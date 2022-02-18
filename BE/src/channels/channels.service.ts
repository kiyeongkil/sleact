import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, MoreThan, Repository } from 'typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    
    private eventsGateway: EventsGateway,
    private connection: Connection,
  ) {}
  
  async findById(id: number) {
    return this.channelsRepository.findByIds([id]);
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId }
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const workspace = await this.workspacesRepository.findOne({
        where: { url },
      });
  
      const channelReturnd = await queryRunner.manager.getRepository(Channels).save({
        name: name,
        WorkspaceId: workspace.id,
      });
  
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: myId,
        ChannelId: channelReturnd.id,
      });
    } catch(error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.Channels',
        'channels',
        'channels.name = :name',
        { name }
      )
      .innerJoin(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .getMany();
  }

  async createWorkspaceChannelMembers(url, name, email) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .where(
        'channel.name = :name',
        { name }
      )
      .getOne();
    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where(
        'user.email = :email',
        { email }
      )
      .innerJoin(
        'user.Workspaces',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .getOne();
    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin(
        'channelChats.Channel',
        'channel',
        'channel.name = :name',
        { name }
      )
      .innerJoin(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage) //limit
      .skip(perPage * (page - 1))
      .getMany();
  }

  async getChannelUnreadsCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .where('channel.name = :name', { name })
      .getOne();
    return this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }

  async postChat({ url, name, content, myId }) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .where('channel.name = :name', { name })
      .getOne();
    if(!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다');
    }

    const savedChat = await queryRunner.manager.getRepository(ChannelChats).save({
      content: content,
      UserId: myId,
      ChannelId: channel.id
    });

    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Channel'],
    });
    this.eventsGateway.server
      .to(`/ws-${url}-${chatWithUser.ChannelId}`)
      .emit('message', chatWithUser);
  }

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number,
  ) {
    console.log(files);
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }
      )
      .where('channel.name = :name', { name })
      .getOne();
    if(!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다');
    }

    for (let i = 0; i < files.length; i++) {
      const chats = new ChannelChats();
      chats.content = files[i].path;
      chats.UserId = myId;
      chats.ChannelId = channel.id;
      const savedChat = await this.channelChatsRepository.save(chats);
      const chatWithUser = await this.channelChatsRepository.findOne({
        where: { id: savedChat.id },
        relations: ['User', 'Channel'],
      });
      this.eventsGateway.server
        // .of(`/ws-${url}`)
        .to(`/ws-${url}-${chatWithUser.ChannelId}`)
        .emit('message', chatWithUser);
    }
  }
}
