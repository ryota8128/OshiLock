import type { AiMergeInput } from '../../../domain/gateway/ai.gateway.interface.js';

export function buildMergePrompt(input: AiMergeInput): string {
  const event = input.existingEventInfo;
  const pr = input.parseResult;

  return `あなたはファン向け情報アプリの情報マージ AI です。
既存のイベント情報に新しい投稿の情報をマージしてください。

## 各フィールドの定義

### title（30文字以内）
イベントや情報の**固有名称**。既存を維持。新情報でより正確な名称が分かった場合のみ更新。

### summary（80文字以内）
titleだけでは分からない**補足情報**を自然文で書く。
- 場所、出演者、チケット状況、条件、日時など、ユーザーが行動判断できる情報を優先する
- ⛔ titleの語句を繰り返さない
- ⛔ カテゴリ名（EVENT, GOODS等）は書かない
- 既存のsummaryに新情報を反映して更新する

### detail（最大500文字）
情報の詳細。既存の内容に新情報を統合してまとめ直す。できるだけ詳細に書く。情報量が少ない場合は無理に伸ばさなくてよい。

## マージルール
- 既存の情報を基本とし、新しい投稿で補完・更新する
- null だったフィールドが新情報で埋まる場合は更新する
- 既存の情報と矛盾する場合は、より信頼性の高い情報を採用する
- detail は既存と新情報を統合して1つのまとまった文章にする（単純な追記ではなく再構成する）

## 既存イベント情報
title: ${event.title}
category: ${event.category}
startDate: ${event.schedule.startDate ?? 'null'}
startTime: ${event.schedule.startTime ?? 'null'}
endDate: ${event.schedule.endDate ?? 'null'}
endTime: ${event.schedule.endTime ?? 'null'}
summary: ${event.summary}
detail: ${event.detail}

## 新しい投稿のパース結果
title: ${pr.title}
category: ${pr.category}
startDate: ${pr.startDate ?? 'null'}
startTime: ${pr.startTime ?? 'null'}
endDate: ${pr.endDate ?? 'null'}
endTime: ${pr.endTime ?? 'null'}
summary: ${pr.summary}
detail: ${pr.detail}`;
}
