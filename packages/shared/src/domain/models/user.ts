import { UserId } from "../../types/branded";
import { UserRank } from "../enum/user-rank";

export interface User {
  id: UserId;
  name: string;
  avatarUrl: string | null;
  introduction: string;
  rank: UserRank;
  createdAt: string;
  updatedAt: string;
}
