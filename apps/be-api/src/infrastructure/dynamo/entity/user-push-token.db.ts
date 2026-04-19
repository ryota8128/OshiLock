import { Entity } from "electrodb";
import { PLATFORM } from "@oshilock/shared";
import { dynamoClient, TABLE_NAME } from "../client.js";

export const UserPushTokenEntity = new Entity(
  {
    model: {
      entity: "UserPushToken",
      version: "1",
      service: "oshilock",
    },
    attributes: {
      userId: { type: "string", required: true },
      token: { type: "string", required: true },
      platform: { type: Object.values(PLATFORM), required: true },
      createdAt: { type: "string", required: true },
    },
    indexes: {
      primary: {
        pk: { field: "pk", composite: ["userId"], template: "USER#${userId}" },
        sk: { field: "sk", composite: ["token"], template: "PUSH_TOKEN#${token}" },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);
