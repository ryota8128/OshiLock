import { mkdirSync, writeFileSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function jstNow(): string {
  return new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function jstTimestamp(): string {
  return jstNow().replace(/[\s/:]/g, '');
}

export function saveResult(inputPath: string, input: unknown, output: unknown, model: string) {
  const resultsDir = join(__dirname, 'results', model);
  mkdirSync(resultsDir, { recursive: true });

  const name = basename(inputPath, '.json');
  const content = [
    `# ${name}`,
    `モデル: ${model}`,
    `実行日時: ${jstNow()}`,
    '',
    '## Input',
    '```json',
    JSON.stringify(input, null, 2),
    '```',
    '',
    '## Output',
    '```json',
    JSON.stringify(output, null, 2),
    '```',
  ].join('\n');

  const filePath = join(resultsDir, `${name}-${jstTimestamp()}.md`);
  writeFileSync(filePath, content);
  console.log(`\n結果保存: ${filePath}`);
}
