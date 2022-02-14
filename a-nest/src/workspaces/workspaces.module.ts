import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';

@Module({
  imports: [TypeOrmModule.forFeature([
     WorkspaceMembers,
     ChannelMembers,
     Workspaces,
     Channels,
     Users
  ])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
