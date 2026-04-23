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

## 各フィールドの定義

### title（30文字以内）
イベントや情報の**固有名称**。公式名があればそのまま使う。

### summary（80文字以内）
titleだけでは分からない**補足情報**を1文で書く。
- 場所、出演者、チケット状況、条件、日時など、ユーザーが行動判断できる情報を優先する
- ⛔ titleの語句を繰り返さない
- ⛔ カテゴリ名（EVENT, GOODS等）は書かない

### detail（最大500文字）
情報の詳細。日時・場所・条件・注意事項・出演者・チケット情報など、ソースから読み取れる情報をできるだけ詳細にまとめる。情報量が少ない場合は無理に伸ばさなくてよい。

### category
EVENT（ライブ・イベント）、GOODS（グッズ発売）、MEDIA（TV・ラジオ出演）、SNS（SNS投稿関連）、NEWS（その他ニュース）

### 日付
- 「今夜」「明日」等の相対表現は上記の現在日時から絶対日付に変換。不明な場合は null
- startDate と endDate が同日の場合は endDate を null にする

## 出力例

### 例1
投稿: "MAIZURU PLAYBACK Fes.、4/26に舞鶴市で開催！UVERworldやウルフルズが出るよ"
→
title: "MAIZURU PLAYBACK Fes. 2026"
summary: "4/26に舞鶴市で開催。UVERworld、ウルフルズなど多数出演。チケット発売中"

❌ NG: summary: "MAIZURU PLAYBACK Fes. 2026、4/26開催！"
→ titleと重複している

### 例2
投稿: "明日のMステに初出演決定！新曲披露するみたい"
→
title: "Mステ初出演決定"
summary: "明日放送。新曲を披露予定"

❌ NG: summary: "Mステに初出演が決定"
→ titleと同じ内容

### 例3
投稿: "コラボグッズ、来週からローソンで売り出すって！アクスタとクリアファイル全6種"
→
title: "ローソン コラボグッズ発売"
summary: "4/28から販売開始。アクスタ・クリアファイル全6種ラインナップ"

## 投稿テキスト
${input.postBody}

## 参考情報
${sourceSection}`;
}
