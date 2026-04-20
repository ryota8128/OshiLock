import { Service } from 'electrodb';
import { UserDb } from '../entity/user.db.js';
import { UserSettingsDb } from '../entity/user-settings.db.js';
import { dynamoClient, TABLE_NAME } from '../client.js';

export const userRegistrationService = new Service(
  {
    user: UserDb.entity,
    userSettings: UserSettingsDb.entity,
  },
  {
    client: dynamoClient,
    table: TABLE_NAME,
  },
);
