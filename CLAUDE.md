# Japanese Learning Practice Generator

為 67 歲母親設計的日文週練習產生器，配合「大家的日本語 初級 I」（大新出版社）教材進度。

## 架構

```
index.html              — 主頁面（老人友善 UI + 每日時間線）
src/
  speech.js             — Web Speech API 日語 TTS 封裝
  progress.js           — 學習進度追蹤 + 間隔重複
  quiz-generator.js     — 練習產生器（翻卡、對比、測驗）
  daily-planner.js      — 每日計畫模組（週→日拆分 + 進度微調）
weeks/
  week-sample.json      — 週設定範本（含 dailyPlan 7 天拆分）
docs/
  BDD-SPECS.md          — BDD 行為規格
  DAG-TODO.md           — 開發任務追蹤
  PITFALLS.md           — 地雷經驗總結 ⚠️ 必讀
```

## 每週工作流程

```
1. 媽媽上完課
2. 你跟 Claude 說：「老師這週教了 さ行 和 ざ行，還有xxx單字」
3. Claude 產出 week-XX.json（含 7 天 dailyPlan）
4. 你放到 weeks/ 資料夾
5. 瀏覽器開啟 index.html?week=week-XX
6. 媽媽每天打開 → 自動顯示「今天是第 N 天」的練習
```

## 每日學習節奏（7 天設計）

| Day | 重點 | 模式 |
|-----|------|------|
| 1 | 認識新字（前半） | 概念說明 + 翻卡 |
| 2 | 認識新字（後半）+ 對比 | 概念 + 對比 |
| 3 | 小測驗（Day 1-2） | 測驗 |
| 4 | 單字練習 | 翻卡 |
| 5 | 對比挑戰 + 混合測驗 | 對比 + 測驗 |
| 6 | 綜合翻卡複習 | 翻卡 |
| 7 | 總測驗（上課前） | 測驗 |

## 快速開始（手動）

1. 複製 `weeks/week-sample.json` 為 `weeks/week-XX.json`
2. 編輯 JSON：填入本週老師教的內容 + dailyPlan
3. 瀏覽器開啟 `index.html?week=week-XX`

## 設計原則

- **KISS**：vanilla JS，無框架，無建構工具
- **DDD**：Learning Content / Practice / Progress 三個 bounded context
- **SRP**：每個 .js 檔只負責一個領域
- **DRY**：掌握度計算統一在 progress.js
- **資料驅動**：改 JSON 設定檔就能產出新練習，不改程式碼

## 地雷索引

詳見 [docs/PITFALLS.md](docs/PITFALLS.md)：
- Web Speech API 瀏覽器差異處理
- 老人認知負荷設計（做減法）
- 間隔重複不要過度工程
- localStorage 防禦性讀取
- 干擾選項品質控制
- 教材進度對齊的重要性
- 學習節奏不是平均分配，是漸進加深
- 不可預測進度要用事後反應式工作流
- dailyPlan mode 字串用 + 分隔，KISS

## 教材資訊

- 教材：大家的日本語 初級 I 改訂版（みんなの日本語 初級Ⅰ 第2版）
- 出版：大新書局
- 程度：N5
- 連結：https://www.dahhsin.com.tw/bookIntro.php?lv01_type=Japan-s01&prd_id=A151
