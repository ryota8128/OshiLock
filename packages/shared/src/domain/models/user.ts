import { OshiId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { UserRank } from "../enum/user-rank";

export interface User {
  id: UserId;
  displayName: string;
  avatarUrl: string | null;
  rank: UserRank;
  oshiOrder: OshiId[];
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
