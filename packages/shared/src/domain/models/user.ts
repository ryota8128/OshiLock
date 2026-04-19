import { UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { AuthProvider } from "../enum/auth-provider";
import { UserRank } from "../enum/user-rank";

export interface User {
  id: UserId;
  authProvider: AuthProvider;
  authSub: string;
  displayName: string;
  avatarUrl: string | null;
  rank: UserRank;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
