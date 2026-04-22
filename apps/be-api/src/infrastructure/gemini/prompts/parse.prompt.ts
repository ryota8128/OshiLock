import { DateString, TimeString } from '@oshilock/shared';
import type { AiParseInput } from '../../../domain/gateway/ai.gateway.interface.js';

export function buildParsePrompt(input: AiParseInput): string {
  const sourceSection =
    input.sourceTexts.length > 0
      ? input.sourceTexts.map((text, i) => `--- ソース ${i + 1} ---\n${text}`).join('\n\n')
      : 'なし';

  const currentDate = DateString.now(input.timezone);
  const currentTime = TimeString.now(input.timezone);

  return `あなたはファン向け情報アプリの情報整理 AI です。
ユーザーの投稿から、推し活に関するイベント・ニュース情報を構造化してください。

## 現在日時
日付: ${currentDate}
時刻: ${currentTime}
タイムゾーン: ${input.timezone.iana}

## ルール
- title: イベントや情報の簡潔なタイトル（30文字以内）
- category: EVENT（ライブ・イベント）、GOODS（グッズ発売）、MEDIA（TV・ラジオ出演）、SNS（SNS投稿関連）、NEWS（その他ニュース）
- 日付: 「今夜」「明日」等の相対表現は上記の現在日時から絶対日付に変換
- startDate と endDate が同日の場合は endDate を null にする
- summary: サマリファイル用の1行サマリ（50文字以内）
- detail: 情報の詳細。日時・場所・条件・注意事項など、ソースから読み取れる情報をまとめる

## 投稿テキスト
${input.postBody}

## 参考情報
${sourceSection}`;
}
