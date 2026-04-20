import { config } from 'dotenv';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { getTableDefinition } from './helpers/table-definition.js';

let container: StartedTestContainer;

export async function setup() {
  // .env.test を読み込み
  config({ path: '.env.test' });

  container = await new GenericContainer('amazon/dynamodb-local').withExposedPorts(8000).start();

  const port = container.getMappedPort(8000);
  const endpoint = `http://localhost:${port}`;

  // 動的ポートを環境変数に設定
  process.env.DYNAMODB_LOCAL_ENDPOINT = endpoint;

  const client = new DynamoDB({
    endpoint,
    region: 'ap-northeast-1',
    credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
  });

  await client.createTable(getTableDefinition());
}

export async function teardown() {
  await container?.stop();
}
