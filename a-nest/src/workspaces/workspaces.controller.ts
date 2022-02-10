import { Controller, Get, Post, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACES')
@Controller('api/workspaces')
export class WorkspacesController {
  @Get()
  getMyWorkspaces() {}

  @Post()
  createWorkspaces() {}

  @Get(':url/members')
  getAllMembersToWorkspaces() {}
  
  @Post(':usl/members')
  inviteMembersToWorkspaces() {}

  @Delete(':usl/members')
  kickMembersFromWorkspaces() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
