import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { env } from "../../config/env.js";

export const dynamoClient = new DynamoDBClient({ region: env.AWS_REGION });
export const TABLE_NAME = env.DYNAMODB_TABLE_NAME;
