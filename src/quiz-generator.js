/**
 * quiz-generator.js — 練習產生器引擎
 *
 * 針對 67 歲初學者設計的日文練習產生器。
 * 使用 Strategy Pattern + Factory Pattern，保持 KISS / DRY / SRP。
 *
 * 全域匯出：QuizGenerator
 */
var QuizGenerator = (function () {
  'use strict';

  // ========================================================================
  // 假名資料池 — 用於產生干擾選項（distractors）
  // ========================================================================

  // --- 基本平假名 46 音 ---
  var KANA_POOL = [
    // あ行
    { char: 'あ', reading: 'a',   type: 'hiragana' },
    { char: 'い', reading: 'i',   type: 'hiragana' },
    { char: 'う', reading: 'u',   type: 'hiragana' },
    { char: 'え', reading: 'e',   type: 'hiragana' },
    { char: 'お', reading: 'o',   type: 'hiragana' },
    // か行
    { char: 'か', reading: 'ka',  type: 'hiragana' },
    { char: 'き', reading: 'ki',  type: 'hiragana' },
    { char: 'く', reading: 'ku',  type: 'hiragana' },
    { char: 'け', reading: 'ke',  type: 'hiragana' },
    { char: 'こ', reading: 'ko',  type: 'hiragana' },
    // さ行
    { char: 'さ', reading: 'sa',  type: 'hiragana' },
    { char: 'し', reading: 'shi', type: 'hiragana' },
    { char: 'す', reading: 'su',  type: 'hiragana' },
    { char: 'せ', reading: 'se',  type: 'hiragana' },
    { char: 'そ', reading: 'so',  type: 'hiragana' },
    // た行
    { char: 'た', reading: 'ta',  type: 'hiragana' },
    { char: 'ち', reading: 'chi', type: 'hiragana' },
    { char: 'つ', reading: 'tsu', type: 'hiragana' },
    { char: 'て', reading: 'te',  type: 'hiragana' },
    { char: 'と', reading: 'to',  type: 'hiragana' },
    // な行
    { char: 'な', reading: 'na',  type: 'hiragana' },
    { char: 'に', reading: 'ni',  type: 'hiragana' },
    { char: 'ぬ', reading: 'nu',  type: 'hiragana' },
    { char: 'ね', reading: 'ne',  type: 'hiragana' },
    { char: 'の', reading: 'no',  type: 'hiragana' },
    // は行
    { char: 'は', reading: 'ha',  type: 'hiragana' },
    { char: 'ひ', reading: 'hi',  type: 'hiragana' },
    { char: 'ふ', reading: 'fu',  type: 'hiragana' },
    { char: 'へ', reading: 'he',  type: 'hiragana' },
    { char: 'ほ', reading: 'ho',  type: 'hiragana' },
    // ま行
    { char: 'ま', reading: 'ma',  type: 'hiragana' },
    { char: 'み', reading: 'mi',  type: 'hiragana' },
    { char: 'む', reading: 'mu',  type: 'hiragana' },
    { char: 'め', reading: 'me',  type: 'hiragana' },
    { char: 'も', reading: 'mo',  type: 'hiragana' },
    // や行
    { char: 'や', reading: 'ya',  type: 'hiragana' },
    { char: 'ゆ', reading: 'yu',  type: 'hiragana' },
    { char: 'よ', reading: 'yo',  type: 'hiragana' },
    // ら行
    { char: 'ら', reading: 'ra',  type: 'hiragana' },
    { char: 'り', reading: 'ri',  type: 'hiragana' },
    { char: 'る', reading: 'ru',  type: 'hiragana' },
    { char: 'れ', reading: 're',  type: 'hiragana' },
    { char: 'ろ', reading: 'ro',  type: 'hiragana' },
    // わ行
    { char: 'わ', reading: 'wa',  type: 'hiragana' },
    { char: 'を', reading: 'wo',  type: 'hiragana' },
    // ん
    { char: 'ん', reading: 'n',   type: 'hiragana' },

    // --- 濁音 (が行, ざ行, だ行, ば行) ---
    // が行
    { char: 'が', reading: 'ga',  type: 'dakuon' },
    { char: 'ぎ', reading: 'gi',  type: 'dakuon' },
    { char: 'ぐ', reading: 'gu',  type: 'dakuon' },
    { char: 'げ', reading: 'ge',  type: 'dakuon' },
    { char: 'ご', reading: 'go',  type: 'dakuon' },
    // ざ行
    { char: 'ざ', reading: 'za',  type: 'dakuon' },
    { char: 'じ', reading: 'ji',  type: 'dakuon' },
    { char: 'ず', reading: 'zu',  type: 'dakuon' },
    { char: 'ぜ', reading: 'ze',  type: 'dakuon' },
    { char: 'ぞ', reading: 'zo',  type: 'dakuon' },
    // だ行
    { char: 'だ', reading: 'da',  type: 'dakuon' },
    { char: 'ぢ', reading: 'di',  type: 'dakuon' },
    { char: 'づ', reading: 'du',  type: 'dakuon' },
    { char: 'で', reading: 'de',  type: 'dakuon' },
    { char: 'ど', reading: 'do',  type: 'dakuon' },
    // ば行
    { char: 'ば', reading: 'ba',  type: 'dakuon' },
    { char: 'び', reading: 'bi',  type: 'dakuon' },
    { char: 'ぶ', reading: 'bu',  type: 'dakuon' },
    { char: 'べ', reading: 'be',  type: 'dakuon' },
    { char: 'ぼ', reading: 'bo',  type: 'dakuon' },

    // --- 半濁音 (ぱ行) ---
    { char: 'ぱ', reading: 'pa',  type: 'handakuon' },
    { char: 'ぴ', reading: 'pi',  type: 'handakuon' },
    { char: 'ぷ', reading: 'pu',  type: 'handakuon' },
    { char: 'ぺ', reading: 'pe',  type: 'handakuon' },
    { char: 'ぽ', reading: 'po',  type: 'handakuon' }
  ];

  // 用 id → char 的快速查找表（從 KANA_POOL 建立）
  var _kanaByReading = {};
  KANA_POOL.forEach(function (k) {
    _kanaByReading[k.reading] = k;
  });

  // ========================================================================
  // 工具函式 (Utility Helpers)
  // ========================================================================

  /**
   * Fisher-Yates 洗牌 — 回傳新陣列，不改動原陣列
   */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /**
   * 在 weekConfig.newItems 中用 id 查找項目
   */
  function findItemById(weekConfig, id) {
    var allItems = weekConfig.newItems || [];
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i].id === id) return allItems[i];
    }
    // 找不到時，嘗試從 KANA_POOL 找（review items 可能只是 id）
    return _kanaByReading[id] || null;
  }

  /**
   * 把 weekConfig 的 reviewItems（id 陣列）解析成完整物件
   */
  function resolveReviewItems(weekConfig) {
    var ids = weekConfig.reviewItems || [];
    var result = [];
    ids.forEach(function (id) {
      var found = findItemById(weekConfig, id);
      if (found) {
        // 確保有 id 欄位
        result.push(Object.assign({ id: id }, found));
      }
    });
    return result;
  }

  /**
   * 合併新項目與複習項目，回傳完整物件陣列
   */
  function getAllItems(weekConfig) {
    var newItems = (weekConfig.newItems || []).slice();
    var reviewItems = resolveReviewItems(weekConfig);
    return newItems.concat(reviewItems);
  }

  /**
   * 為某個正確答案挑選干擾選項
   * 策略：優先挑同 type 的假名，若不夠再從整個 pool 補
   * @param {object} correct - 正確項目 {char, reading, type}
   * @param {number} count   - 需要幾個干擾項
   * @param {array}  exclude - 要排除的 char 清單
   */
  function pickDistractors(correct, count, exclude) {
    var excludeSet = {};
    (exclude || []).forEach(function (c) { excludeSet[c] = true; });
    excludeSet[correct.char] = true;

    // 優先同類型，增加難度與真實感
    var sameType = KANA_POOL.filter(function (k) {
      return k.type === correct.type && !excludeSet[k.char];
    });

    var others = KANA_POOL.filter(function (k) {
      return k.type !== correct.type && !excludeSet[k.char];
    });

    var pool = shuffle(sameType).concat(shuffle(others));
    return pool.slice(0, count);
  }

  // ========================================================================
  // 比較提示產生器 — 根據類型自動產生中文提示
  // ========================================================================

  var COMPARISON_HINTS = {
    // 清音 → 濁音
    'hiragana-dakuon': function (a, b) {
      return '加了゛（濁點），聲音變重了：' + a.reading + ' → ' + b.reading;
    },
    // 清音 → 半濁音
    'hiragana-handakuon': function (a, b) {
      return '加了゜（半濁點），發音變彈舌：' + a.reading + ' → ' + b.reading;
    },
    // 單字比較
    'vocab-vocab': function (a, b) {
      return '注意看哪裡不同！「' + a.char + '」(' + (a.meaning || a.reading) + ') vs 「' + b.char + '」(' + (b.meaning || b.reading) + ')';
    }
  };

  function generateHint(itemA, itemB) {
    var key = itemA.type + '-' + itemB.type;
    var fn = COMPARISON_HINTS[key];
    if (fn) return fn(itemA, itemB);
    // 預設提示
    return '比較看看：「' + itemA.char + '」(' + itemA.reading + ') 和 「' + itemB.char + '」(' + itemB.reading + ')';
  }

  // ========================================================================
  // 1. generateComparisonCards — 比較對照卡
  // ========================================================================

  /**
   * 從 weekConfig 中找出所有有 compareWith 的項目，配對成比較卡。
   * 適合拿來強化「清音 vs 濁音」或「相似單字」的辨識能力。
   *
   * @param {object} weekConfig - 週設定 JSON
   * @returns {array} 比較卡陣列
   */
  function generateComparisonCards(weekConfig) {
    var items = weekConfig.newItems || [];
    var cards = [];
    // 記錄已配對的組合，避免重複（A-B 和 B-A 只留一組）
    var paired = {};

    items.forEach(function (item) {
      if (!item.compareWith || !item.compareWith.length) return;

      item.compareWith.forEach(function (targetId) {
        // 排除重複配對
        var pairKey = [item.id, targetId].sort().join('|');
        if (paired[pairKey]) return;
        paired[pairKey] = true;

        var target = findItemById(weekConfig, targetId);
        if (!target) return;

        cards.push({
          itemA: {
            char: target.char,
            reading: target.reading,
            meaning: target.meaning || target.reading,
            chineseHint: target.chineseHint || '',
            zhuyinHint: target.zhuyinHint || ''
          },
          itemB: {
            char: item.char,
            reading: item.reading,
            meaning: item.meaning || item.reading,
            chineseHint: item.chineseHint || '',
            zhuyinHint: item.zhuyinHint || ''
          },
          hint: generateHint(target, item)
        });
      });
    });

    return cards;
  }

  // ========================================================================
  // 2. generateFlipCards — 翻牌卡片組
  // ========================================================================

  /**
   * 建立翻牌練習卡片。正面顯示假名/單字，翻面顯示讀音與意思。
   *
   * @param {object} weekConfig - 週設定 JSON
   * @param {object} [options]  - { shuffle: true, limit: 10 }
   * @returns {array} 翻牌卡片陣列
   */
  function generateFlipCards(weekConfig, options) {
    var opts = Object.assign({ shuffle: true, limit: 10 }, options || {});
    var allItems = getAllItems(weekConfig);

    // 根據項目類型決定卡片正反面內容
    var cards = allItems.map(function (item) {
      var isVocab = item.type === 'vocab';
      return {
        front: item.char,
        back: isVocab
          ? item.reading + '（' + item.meaning + '）'
          : item.reading,
        audioText: item.audioText || item.char,
        type: item.type || 'hiragana',
        id: item.id || item.reading,
        chineseHint: item.chineseHint || '',
        zhuyinHint: item.zhuyinHint || ''
      };
    });

    // 洗牌（預設開啟）
    if (opts.shuffle) {
      cards = shuffle(cards);
    }

    // 限制數量
    if (opts.limit && cards.length > opts.limit) {
      cards = cards.slice(0, opts.limit);
    }

    return cards;
  }

  // ========================================================================
  // 3. generateQuiz — 選擇題測驗
  // ========================================================================

  /**
   * 產生選擇題。每題 1 個正確答案 + 3 個干擾選項。
   * 干擾選項優先選同類型假名，讓題目更有挑戰性但不至於太難。
   *
   * @param {object} weekConfig - 週設定 JSON
   * @param {object} [options]  - { count: 10, includeReview: true }
   * @returns {array} 測驗題目陣列
   */
  function generateQuiz(weekConfig, options) {
    var opts = Object.assign({ count: 10, includeReview: true }, options || {});

    // 決定題庫範圍
    var pool = opts.includeReview
      ? getAllItems(weekConfig)
      : (weekConfig.newItems || []).slice();

    // 洗牌後取所需數量
    var selected = shuffle(pool).slice(0, opts.count);

    // 題目策略工廠：不同類型的項目用不同出題方式
    var questionStrategies = {
      // 假名題：看字選讀音
      kana: function (item) {
        return {
          question: '這個假名怎麼唸？ → ' + item.char,
          questionAudio: item.audioText || item.char,
          correctText: item.reading,
          type: 'kana-to-reading'
        };
      },
      // 單字題：看字選意思
      vocab: function (item) {
        return {
          question: '「' + item.char + '」是什麼意思？',
          questionAudio: item.audioText || item.char,
          correctText: item.meaning || item.reading,
          type: 'vocab-to-meaning'
        };
      }
    };

    var questions = selected.map(function (item) {
      var isVocab = item.type === 'vocab';
      var strategy = isVocab ? questionStrategies.vocab : questionStrategies.kana;
      var q = strategy(item);

      // 產生 3 個干擾選項
      var distractors = pickDistractors(item, 3);
      var distractorTexts = distractors.map(function (d) {
        // 假名題用 reading 當選項；單字題也用 reading（因為 pool 裡的假名沒有 meaning）
        return isVocab ? (d.meaning || d.reading) : d.reading;
      });

      // 組合所有選項並洗牌
      var allOptions = [
        { text: q.correctText, isCorrect: true, id: item.id || item.reading }
      ];
      distractors.forEach(function (d, idx) {
        allOptions.push({
          text: distractorTexts[idx],
          isCorrect: false,
          id: d.reading + '-distractor-' + idx
        });
      });
      allOptions = shuffle(allOptions);

      return {
        question: q.question,
        questionChar: item.char,
        questionAudio: q.questionAudio,
        options: allOptions,
        type: q.type,
        itemId: item.id || item.reading
      };
    });

    return questions;
  }

  // ========================================================================
  // 4. generateDailyPractice — 每日智慧練習
  // ========================================================================

  /**
   * 根據進度資料產生每日練習組合。
   * 包含：新項目 + 需複習項目 + 比較配對，總量不超過 dailyLimit。
   *
   * @param {object} weekConfig   - 週設定 JSON
   * @param {object} [progressData] - 學習進度 { masteredIds: [], lastPracticed: {} }
   * @returns {object} { cards: [], quiz: [], comparisons: [] }
   */
  function generateDailyPractice(weekConfig, progressData) {
    var progress = progressData || { masteredIds: [], lastPracticed: {} };
    var settings = weekConfig.settings || {};
    var dailyLimit = settings.dailyLimit || 8;

    var newItems = (weekConfig.newItems || []).slice();
    var masteredSet = {};
    (progress.masteredIds || []).forEach(function (id) { masteredSet[id] = true; });

    // --- 挑選新項目（2~3 個尚未掌握的） ---
    var unmasteredNew = newItems.filter(function (item) {
      return !masteredSet[item.id];
    });
    var newPick = shuffle(unmasteredNew).slice(0, 3);

    // --- 挑選需要複習的項目 ---
    // 簡易間隔重複：距離上次練習超過 1 天的項目優先
    var now = Date.now();
    var ONE_DAY = 24 * 60 * 60 * 1000;
    var reviewCandidates = resolveReviewItems(weekConfig).filter(function (item) {
      var lastTime = progress.lastPracticed && progress.lastPracticed[item.id];
      // 沒練過或超過一天就需要複習
      return !lastTime || (now - lastTime > ONE_DAY);
    });

    // 複習項目數量 = 每日上限 - 新項目數 - 預留給比較卡的 2 個位置
    var reviewSlots = Math.max(0, dailyLimit - newPick.length - 2);
    var reviewPick = shuffle(reviewCandidates).slice(0, reviewSlots);

    // --- 比較卡（1~2 組） ---
    var allComparisons = generateComparisonCards(weekConfig);
    var comparisonPick = shuffle(allComparisons).slice(0, 2);

    // --- 組合成翻牌卡 ---
    var cardItems = newPick.concat(reviewPick);
    // 建立一個臨時的 weekConfig 來產生卡片
    var tempConfig = {
      newItems: cardItems,
      reviewItems: [],
      settings: settings
    };
    var cards = generateFlipCards(tempConfig, {
      shuffle: true,
      limit: dailyLimit
    });

    // --- 產生小測驗（從今日練習項目出題） ---
    var quizCount = Math.min(cardItems.length, 5);
    var quiz = generateQuiz(tempConfig, {
      count: quizCount,
      includeReview: false
    });

    return {
      cards: cards,
      quiz: quiz,
      comparisons: comparisonPick
    };
  }

  // ========================================================================
  // 公開 API
  // ========================================================================

  return {
    generateComparisonCards: generateComparisonCards,
    generateFlipCards: generateFlipCards,
    generateQuiz: generateQuiz,
    generateDailyPractice: generateDailyPractice,

    // 暴露給測試或進階用途
    KANA_POOL: KANA_POOL,
    _utils: {
      shuffle: shuffle,
      findItemById: findItemById,
      pickDistractors: pickDistractors,
      resolveReviewItems: resolveReviewItems
    }
  };

})();
