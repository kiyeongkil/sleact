import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({
    example: '일반',
    description: '채널명',
  })
  public name: string;
}