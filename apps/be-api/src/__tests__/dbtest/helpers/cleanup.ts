import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME } from './table-definition.js';

export async function cleanupTable(client: DynamoDBDocument): Promise<void> {
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await client.scan({
      TableName: TABLE_NAME,
      ProjectionExpression: 'pk, sk',
      ExclusiveStartKey: lastEvaluatedKey,
    });

    if (result.Items && result.Items.length > 0) {
      const chunks = chunkArray(result.Items, 25);
      for (const chunk of chunks) {
        await client.batchWrite({
          RequestItems: {
            [TABLE_NAME]: chunk.map((item) => ({
              DeleteRequest: { Key: { pk: item['pk'], sk: item['sk'] } },
            })),
          },
        });
      }
    }

    lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastEvaluatedKey);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
