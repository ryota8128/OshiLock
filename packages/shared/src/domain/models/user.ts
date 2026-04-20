import { UserId } from '../../types/branded';
import { UtcIsoString } from '../../types/utc-iso-string';
import { AuthProvider } from '../enum/auth-provider';
import { UserRank } from '../enum/user-rank';

export interface User {
  id: UserId;
  authProvider: AuthProvider;
  authSub: string;
  displayName: string;
  avatarPath: string | null;
  rank: UserRank;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}

export interface UserWithAvatarUrl extends User {
  avatarUrl: { sm: string; lg: string } | null;
}
