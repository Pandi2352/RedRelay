import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/types';

export class UserProfileDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' })
  id!: string;

  @ApiProperty({ example: 'donor@example.com' })
  email!: string;

  @ApiProperty({ example: 'Sarah Jenkins' })
  name!: string;

  @ApiProperty({ enum: Role, example: Role.Donor })
  role!: Role;

  @ApiProperty({ example: 'active' })
  status!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserProfileDto })
  user!: UserProfileDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;
}
