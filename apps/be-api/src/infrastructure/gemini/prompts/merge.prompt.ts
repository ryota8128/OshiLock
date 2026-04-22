import type { AiMergeInput } from '../../../domain/gateway/ai.gateway.interface.js';

export function buildMergePrompt(input: AiMergeInput): string {
  const event = input.existingEventInfo;
  const pr = input.parseResult;

  return `あなたはファン向け情報アプリの情報マージ AI です。
既存のイベント情報に新しい投稿の情報をマージしてください。

## マージルール
- 既存の情報を基本とし、新しい投稿で補完・更新する
- null だったフィールドが新情報で埋まる場合は更新する
- 既存の情報と矛盾する場合は、より信頼性の高い情報を採用する
- detail は既存の内容に新情報を追記する形で統合する
- title は既存を維持。新情報でより正確なタイトルが分かった場合のみ更新

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
