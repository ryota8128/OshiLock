import { Entity } from "electrodb";
import { dynamoClient, TABLE_NAME } from "../client.js";

export const UserSettingsEntity = new Entity(
  {
    model: {
      entity: "UserSettings",
      version: "1",
      service: "oshilock",
    },
    attributes: {
      userId: { type: "string", required: true },
      notification: {
        type: "map",
        properties: {
          reminder: { type: "boolean", required: true, default: true },
          dailySummary: { type: "boolean", required: true, default: true },
        },
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["userId"], template: "USER#${userId}" },
        sk: { field: "sk", composite: [], template: "SETTINGS" },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);
