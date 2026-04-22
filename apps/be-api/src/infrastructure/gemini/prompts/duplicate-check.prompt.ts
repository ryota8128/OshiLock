import type { AiDuplicateInput } from '../../../domain/gateway/ai.gateway.interface.js';

export function buildDuplicateCheckPrompt(input: AiDuplicateInput): string {
  const pr = input.parseResult;

  return `あなたはファン向け情報アプリの重複判定 AI です。
新しい投稿のパース結果と、既存イベント情報のサマリ一覧を比較し、重複判定してください。

## 判定ルール
- NEW: 既存に該当なし。新規イベント情報を作成すべき
- DUPLICATE: 既存と同一の情報（同じイベント・同じニュース）。スキップ
- UPDATE: 既存に関連する追加情報（日程の詳細、会場情報の追加など）。既存を更新すべき

## 新しい投稿のパース結果
title: ${pr.title}
category: ${pr.category}
startDate: ${pr.startDate ?? 'null'}
startTime: ${pr.startTime ?? 'null'}
endDate: ${pr.endDate ?? 'null'}
endTime: ${pr.endTime ?? 'null'}
summary: ${pr.summary}

## 既存イベント情報サマリ（TOON形式）
@id category startDate startTime endDate endTime title
${input.filteredToon}

## 注意
- matchType が NEW の場合、matchedEventId は null にしてください
- matchType が DUPLICATE または UPDATE の場合、matchedEventId に該当イベントの ID を設定してください
- 迷った場合は NEW にしてください（誤マッチより見逃しの方が安全）`;
}
