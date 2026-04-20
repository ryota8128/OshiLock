import { OshiId } from '../../types/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface Oshi {
  id: OshiId;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
