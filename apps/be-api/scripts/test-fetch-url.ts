import { UrlProcessor } from '../src/application/services/post/url-processor.js';

const url = process.argv[2];

if (!url) {
  console.error('Usage: npx tsx scripts/test-fetch-url.ts <URL>');
  process.exit(1);
}

const processor = new UrlProcessor();
const text = await processor.fetchUrlText(url);

if (text === null) {
  console.log('取得失敗（非HTML or タイムアウト）');
} else {
  console.log(`文字数: ${text.length}`);
  console.log('---');
  console.log(text);
}
