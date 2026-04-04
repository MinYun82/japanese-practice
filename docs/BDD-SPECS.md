# BDD 行為驅動規格 — 日文週練習產生器

> 用 Given-When-Then 描述系統行為，確保每個功能都對應到使用者動機

## Feature 1: 每週練習配置（對應動機 4 — 課程同步）

```gherkin
Scenario: 兒子為媽媽配置本週練習
  Given 媽媽這週在課堂上學了「か行」和「が行」
  When 兒子編輯 weeks/week-15.json 加入新的學習項目
  Then 系統自動產生對應的翻卡、對比卡、測驗題
  And 產生時間不超過頁面載入的 1 秒

Scenario: 自動包含複習項目
  Given 上週學的「あ行」掌握度低於 4
  When 系統產生本週練習
  Then 「あ行」會自動出現在複習區
```

## Feature 2: 概念對比練習（對應動機 3 — 概念釐清）

```gherkin
Scenario: 濁音對比練習
  Given 本週學了「か」和「が」
  And 設定中標記了 compareWith 關係
  When 進入「對比練習」模式
  Then 顯示「か」和「が」並排
  And 播放兩者發音讓使用者聽出差異
  And 顯示提示「加了゛，聲音變重了」

Scenario: 不混淆不相關的項目
  Given 「か」設定了 compareWith: ["ga"]
  When 產生對比卡
  Then 只配對「か↔が」，不會隨機配其他字
```

## Feature 3: 每日限量練習（對應動機 1 — 認知負荷）

```gherkin
Scenario: 每日練習不超過限量
  Given dailyLimit 設定為 8
  And 本週有 10 個新項目 + 5 個複習項
  When 產生每日練習
  Then 最多只包含 8 個項目
  And 優先包含到期複習項，再補新項目

Scenario: 字體大小適合老人閱讀
  Given 使用者是 67 歲長者
  When 顯示練習介面
  Then 主要日文字體不小於 48px
  And 說明文字不小於 20px
  And 按鈕點擊區域不小於 48x48px
```

## Feature 4: 成就感回饋（對應動機 2 — 看見進步）

```gherkin
Scenario: 顯示具體進步
  Given 媽媽昨天答錯了「き」「く」
  And 今天練習時兩個都答對了
  When 顯示練習結果
  Then 顯示「太棒了！昨天還不會的 2 個字今天都答對了！」
  And 不只顯示分數，要顯示具體進步的項目

Scenario: 累計掌握數可視化
  Given 媽媽目前掌握了 15 個假名
  When 進入首頁
  Then 顯示「已經學會 15 個字了！」
  And 用進度條顯示佔全部五十音的比例
```

## Feature 5: 低維護成本（對應動機 5 — 可持續性）

```gherkin
Scenario: 新增一週只需編輯 JSON
  Given 框架已建好
  When 兒子要加入第 16 週的內容
  Then 只需複製 week-sample.json 並修改內容
  And 不需要改任何 HTML 或 JS 程式碼
```
