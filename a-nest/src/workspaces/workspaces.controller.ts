import { Controller, Get, Post, Delete, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Users } from '../entities/Users';
import { User } from '../common/decorators/user.decorator';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.request.dto';

@ApiTags('WORKSPACES')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(
    private workspacesService: WorkspacesService
  ) {}

  @ApiOperation({ summary: '내 워크스페이스 가져오기' })
  @Get('/:myId')
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @ApiOperation({ summary: '워크스페이스 만들기' })
  @Post()
  createWorkspaces(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @ApiOperation({ summary: '워크스페이스 멤버 가져오기' })
  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body('email') email,
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/users/:id')
  async getWorkspaceUser(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
