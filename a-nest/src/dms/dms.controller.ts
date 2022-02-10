import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @ApiQuery({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiQuery({
    name: 'url',
    required: true,
    description: '워크스페이스  url',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가져오는 개수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러오는 페이지',
  })
  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url)
  }

  @Post(':id/chats')
  postChat(@Body() body) {} 
}
