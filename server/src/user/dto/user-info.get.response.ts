import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  fans: number;

  @ApiProperty()
  watchers: number;

  @ApiProperty()
  watchees: number;
}
