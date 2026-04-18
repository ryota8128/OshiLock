import { UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { Platform } from "../enum/platform";

export interface UserPushToken {
  userId: UserId;
  token: string;
  platform: Platform;
  createdAt: UtcIsoString;
}
