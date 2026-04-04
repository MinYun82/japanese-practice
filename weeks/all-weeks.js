/**
 * all-weeks.js — 所有週的學習設定
 *
 * 每週上完課後，把新的一週 push 到這個陣列尾巴即可。
 * 系統自動顯示最新週，也可以切換回顧舊週。
 *
 * 格式：var ALL_WEEKS = [ {week1}, {week2}, ... ];
 */
var ALL_WEEKS = [

// ============================================================
// 第 1 週：あ行 — 五十音的開始
// ============================================================
{
  "week": 1,
  "date": "2026-03-30",
  "title": "あ行 — 五十音的開始",

  "newItems": [
    { "id": "a",  "type": "hiragana", "char": "あ", "reading": "a",  "audioText": "あ" },
    { "id": "i",  "type": "hiragana", "char": "い", "reading": "i",  "audioText": "い" },
    { "id": "u",  "type": "hiragana", "char": "う", "reading": "u",  "audioText": "う" },
    { "id": "e",  "type": "hiragana", "char": "え", "reading": "e",  "audioText": "え" },
    { "id": "o",  "type": "hiragana", "char": "お", "reading": "o",  "audioText": "お" }
  ],

  "reviewItems": [],

  "concepts": [
    {
      "title": "平假名是什麼？",
      "explanation": "平假名是日文最基本的文字，就像注音符號一樣。日文有 46 個基本平假名，我們從最簡單的 5 個開始：あ、い、う、え、お，就是母音 a、i、u、e、o。",
      "examples": [
        { "char": "あ", "reading": "a", "meaning": "像中文的「啊」" },
        { "char": "い", "reading": "i", "meaning": "像中文的「衣」" },
        { "char": "う", "reading": "u", "meaning": "像中文的「嗚」" },
        { "char": "え", "reading": "e", "meaning": "像中文的「欸」" },
        { "char": "お", "reading": "o", "meaning": "像中文的「喔」" }
      ]
    }
  ],

  "dailyPlan": [
    {
      "day": 1, "label": "第一步：認識あいうえお",
      "description": "日文的第一步！先看過、聽過這五個字",
      "mode": "concepts+flipcard",
      "newItemIds": ["a", "i", "u"],
      "reviewItemIds": [],
      "showConcepts": true
    },
    {
      "day": 2, "label": "繼續認識 え 和 お",
      "description": "再加兩個，湊齊五個母音",
      "mode": "flipcard",
      "newItemIds": ["e", "o"],
      "reviewItemIds": ["a", "i", "u"]
    },
    {
      "day": 3, "label": "小測驗",
      "description": "測試看看五個母音記住多少",
      "mode": "quiz",
      "newItemIds": [],
      "reviewItemIds": ["a", "i", "u", "e", "o"]
    },
    {
      "day": 4, "label": "翻卡複習",
      "description": "再翻一次，加深印象",
      "mode": "flipcard",
      "newItemIds": [],
      "reviewItemIds": ["a", "i", "u", "e", "o"]
    },
    {
      "day": 5, "label": "再測一次",
      "description": "隔兩天再測，看看還記不記得",
      "mode": "quiz",
      "newItemIds": [],
      "reviewItemIds": ["a", "i", "u", "e", "o"]
    },
    {
      "day": 6, "label": "輕鬆翻卡",
      "description": "放輕鬆，翻一翻就好",
      "mode": "flipcard",
      "newItemIds": [],
      "reviewItemIds": ["a", "i", "u", "e", "o"]
    },
    {
      "day": 7, "label": "總測驗",
      "description": "上課前的總複習！",
      "mode": "quiz",
      "newItemIds": [],
      "reviewItemIds": ["a", "i", "u", "e", "o"]
    }
  ],

  "settings": {
    "dailyLimit": 10,
    "fontSize": "large",
    "showRomaji": true,
    "playAudioAutomatically": true,
    "reviewRatio": 0.3,
    "classDay": "saturday"
  }
},

// ============================================================
// 第 2 週：か行與が行 — 清音與濁音
// ============================================================
{
  "week": 2,
  "date": "2026-04-06",
  "title": "か行與が行 — 清音與濁音",

  "newItems": [
    { "id": "ka", "type": "hiragana", "char": "か", "reading": "ka", "audioText": "か" },
    { "id": "ki", "type": "hiragana", "char": "き", "reading": "ki", "audioText": "き" },
    { "id": "ku", "type": "hiragana", "char": "く", "reading": "ku", "audioText": "く" },
    { "id": "ke", "type": "hiragana", "char": "け", "reading": "ke", "audioText": "け" },
    { "id": "ko", "type": "hiragana", "char": "こ", "reading": "ko", "audioText": "こ" },

    { "id": "ga", "type": "dakuon", "char": "が", "reading": "ga", "compareWith": ["ka"], "audioText": "が" },
    { "id": "gi", "type": "dakuon", "char": "ぎ", "reading": "gi", "compareWith": ["ki"], "audioText": "ぎ" },
    { "id": "gu", "type": "dakuon", "char": "ぐ", "reading": "gu", "compareWith": ["ku"], "audioText": "ぐ" },
    { "id": "ge", "type": "dakuon", "char": "げ", "reading": "ge", "compareWith": ["ke"], "audioText": "げ" },
    { "id": "go", "type": "dakuon", "char": "ご", "reading": "go", "compareWith": ["ko"], "audioText": "ご" },

    { "id": "kaki", "type": "vocab", "char": "かき", "reading": "kaki", "meaning": "柿子", "audioText": "かき" },
    { "id": "eki",  "type": "vocab", "char": "えき", "reading": "eki",  "meaning": "車站", "audioText": "えき" },
    { "id": "kagi", "type": "vocab", "char": "かぎ", "reading": "kagi", "meaning": "鑰匙", "compareWith": ["kaki"], "audioText": "かぎ" },
    { "id": "kao",  "type": "vocab", "char": "かお", "reading": "kao",  "meaning": "臉",   "audioText": "かお" },
    { "id": "ike",  "type": "vocab", "char": "いけ", "reading": "ike",  "meaning": "池塘", "audioText": "いけ" }
  ],

  "reviewItems": ["a", "i", "u", "e", "o"],

  "concepts": [
    {
      "title": "濁音是什麼？",
      "explanation": "在清音的右上角加上兩個小點（゛），聲音就會變「重」一點。例如「か」(ka) 加上濁點就變成「が」(ga)。嘴巴的形狀一樣，只是喉嚨會震動。",
      "examples": [
        { "char": "か → が", "reading": "ka → ga", "meaning": "清音 → 濁音" },
        { "char": "き → ぎ", "reading": "ki → gi", "meaning": "清音 → 濁音" },
        { "char": "く → ぐ", "reading": "ku → gu", "meaning": "清音 → 濁音" },
        { "char": "け → げ", "reading": "ke → ge", "meaning": "清音 → 濁音" },
        { "char": "こ → ご", "reading": "ko → go", "meaning": "清音 → 濁音" }
      ]
    },
    {
      "title": "清音和濁音的差別很重要！",
      "explanation": "「かき」是柿子，「かぎ」是鑰匙。只差一個濁點，意思完全不同！練習時要注意聽清楚差別。",
      "examples": [
        { "char": "かき", "reading": "kaki", "meaning": "柿子" },
        { "char": "かぎ", "reading": "kagi", "meaning": "鑰匙" }
      ]
    }
  ],

  "dailyPlan": [
    {
      "day": 1, "label": "認識新朋友",
      "description": "今天先認識か行五個字，不用急著記住，看過聽過就好",
      "mode": "concepts+flipcard",
      "newItemIds": ["ka", "ki", "ku", "ke", "ko"],
      "reviewItemIds": ["a", "i", "u", "e", "o"],
      "showConcepts": true
    },
    {
      "day": 2, "label": "聽出濁音的差別",
      "description": "今天來認識濁音が行，重點是「聽出」か和が的差別",
      "mode": "concepts+compare",
      "newItemIds": ["ga", "gi", "gu", "ge", "go"],
      "reviewItemIds": ["ka", "ki", "ku", "ke", "ko"],
      "showConcepts": true
    },
    {
      "day": 3, "label": "小測驗 - 前兩天學的",
      "description": "測試看看前兩天的か行和が行記住多少",
      "mode": "quiz",
      "newItemIds": [],
      "reviewItemIds": ["ka", "ki", "ku", "ke", "ko", "ga", "gi", "gu", "ge", "go"]
    },
    {
      "day": 4, "label": "學單字 - 用學過的字拼單字",
      "description": "今天來看幾個用か行拼成的單字",
      "mode": "flipcard",
      "newItemIds": ["kaki", "eki", "kao", "ike"],
      "reviewItemIds": ["ka", "ki", "ku", "ke", "ko"]
    },
    {
      "day": 5, "label": "對比挑戰 - かき vs かぎ",
      "description": "柿子和鑰匙只差一個濁點！來挑戰分辨",
      "mode": "compare+quiz",
      "newItemIds": ["kagi"],
      "reviewItemIds": ["kaki", "ga", "gi", "gu", "ge", "go"]
    },
    {
      "day": 6, "label": "綜合翻卡複習",
      "description": "把這週學的全部翻一遍",
      "mode": "flipcard",
      "newItemIds": [],
      "reviewItemIds": ["ka", "ki", "ku", "ke", "ko", "ga", "gi", "gu", "ge", "go", "kaki", "kagi", "eki", "kao", "ike"]
    },
    {
      "day": 7, "label": "週末總測驗",
      "description": "上課前的總複習！看看這週學會了多少",
      "mode": "quiz",
      "newItemIds": [],
      "reviewItemIds": ["ka", "ki", "ku", "ke", "ko", "ga", "gi", "gu", "ge", "go", "kaki", "kagi", "eki", "kao", "ike", "a", "i", "u", "e", "o"]
    }
  ],

  "settings": {
    "dailyLimit": 15,
    "fontSize": "large",
    "showRomaji": true,
    "playAudioAutomatically": true,
    "reviewRatio": 0.3,
    "classDay": "saturday"
  }
}

// ↑ 每週上完課後，在這裡加一個逗號，然後貼上新的 {...} 即可
];
