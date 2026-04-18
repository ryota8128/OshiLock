import { OshiId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Oshi {
  id: OshiId;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
