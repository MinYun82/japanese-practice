/**
 * Progress Tracking Module - 學習進度追蹤模組
 *
 * 使用間隔重複法 (Spaced Repetition) 追蹤學習進度。
 * 資料儲存在 localStorage，key 為 "japanese_practice_progress"。
 *
 * 設計原則：
 *   KISS - 簡單實作，不過度設計
 *   SRP  - 只負責進度資料，不處理 UI
 *   DRY  - 熟練度計算可重複使用
 */
var Progress = (function () {
  'use strict';

  var STORAGE_KEY = 'japanese_practice_progress';

  // --- 間隔重複的天數對照表 (mastery level -> 幾天後複習) ---
  var REVIEW_INTERVALS = {
    1: 1,   // 見過一次 → 明天複習
    2: 2,   // 開始記住 → 2 天後
    3: 4,   // 快記住了 → 4 天後
    4: 7,   // 有信心了 → 7 天後
    5: 14   // 已精通   → 14 天後
  };

  // --- 熟練度標籤 (方便外部使用) ---
  var MASTERY_LABELS = [
    '未學習',     // 0
    '初次見面',   // 1
    '開始記住',   // 2
    '快記住了',   // 3
    '有信心了',   // 4
    '已精通'      // 5
  ];

  // ========== 工具函式 ==========

  /** 取得今天的日期字串 (YYYY-MM-DD) */
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  /** 把日期字串加上 N 天，回傳 ISO 日期字串 */
  function addDays(dateStr, days) {
    var d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  /** 從 localStorage 讀取所有進度資料 */
  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { items: {}, dailyLog: {} };
    } catch (e) {
      // localStorage 損壞時重新開始
      return { items: {}, dailyLog: {} };
    }
  }

  /** 將進度資料寫回 localStorage */
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * 計算熟練度 (0-5) — DRY：統一的計算邏輯
   * 根據正確次數與錯誤次數來決定等級。
   */
  function calculateMastery(correctCount, wrongCount) {
    var total = correctCount + wrongCount;
    if (total === 0) return 0;

    var ratio = correctCount / total;

    // 至少要練習過幾次才能升級
    if (total === 1) return 1;
    if (total < 3) return ratio >= 0.5 ? 2 : 1;
    if (total < 5) return ratio >= 0.8 ? 3 : (ratio >= 0.5 ? 2 : 1);
    if (total < 8) return ratio >= 0.85 ? 4 : (ratio >= 0.6 ? 3 : 2);

    // 8 次以上
    if (ratio >= 0.9) return 5;
    if (ratio >= 0.8) return 4;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.4) return 2;
    return 1;
  }

  // ========== 公開 API ==========

  /**
   * 記錄作答結果
   * @param {string} itemId - 題目 ID
   * @param {boolean} correct - 是否答對
   */
  function recordAnswer(itemId, correct) {
    var data = loadData();
    var todayStr = today();

    // 初始化該題目的紀錄
    if (!data.items[itemId]) {
      data.items[itemId] = {
        correctCount: 0,
        wrongCount: 0,
        lastPracticed: null,
        nextReview: null,
        mastery: 0
      };
    }

    var item = data.items[itemId];

    // 更新答題次數
    if (correct) {
      item.correctCount++;
    } else {
      item.wrongCount++;
    }

    // 更新熟練度（使用共用計算邏輯）
    item.mastery = calculateMastery(item.correctCount, item.wrongCount);
    item.lastPracticed = todayStr;

    // 根據熟練度設定下次複習日期
    var interval = REVIEW_INTERVALS[item.mastery] || 1;
    item.nextReview = addDays(todayStr, interval);

    // 記錄每日練習紀錄
    if (!data.dailyLog[todayStr]) {
      data.dailyLog[todayStr] = { practiced: 0, correct: 0 };
    }
    data.dailyLog[todayStr].practiced++;
    if (correct) {
      data.dailyLog[todayStr].correct++;
    }

    saveData(data);
  }

  /**
   * 取得某題目的熟練度 (0-5)
   * @param {string} itemId - 題目 ID
   * @returns {number} 0=未學習, 1=初次見面, 2=開始記住, 3=快記住了, 4=有信心了, 5=已精通
   */
  function getMastery(itemId) {
    var data = loadData();
    if (!data.items[itemId]) return 0;
    return data.items[itemId].mastery;
  }

  /**
   * 取得今天需要複習的題目 ID 列表
   * @returns {string[]} 需要複習的 itemId 陣列
   */
  function getItemsDueForReview() {
    var data = loadData();
    var todayStr = today();
    var due = [];

    var ids = Object.keys(data.items);
    for (var i = 0; i < ids.length; i++) {
      var item = data.items[ids[i]];
      // nextReview 為 null 或日期 <= 今天，都算該複習了
      if (!item.nextReview || item.nextReview <= todayStr) {
        due.push(ids[i]);
      }
    }

    return due;
  }

  /**
   * 取得今日統計
   * @returns {{ practiced: number, correct: number, newMastered: number, streak: number }}
   */
  function getDailyStats() {
    var data = loadData();
    var todayStr = today();
    var log = data.dailyLog[todayStr] || { practiced: 0, correct: 0 };

    // 計算今天新精通的題目數量（mastery == 5 且 lastPracticed == 今天）
    var newMastered = 0;
    var ids = Object.keys(data.items);
    for (var i = 0; i < ids.length; i++) {
      var item = data.items[ids[i]];
      if (item.mastery === 5 && item.lastPracticed === todayStr) {
        newMastered++;
      }
    }

    // 計算連續練習天數 (streak)
    var streak = 0;
    var checkDate = todayStr;
    while (data.dailyLog[checkDate] && data.dailyLog[checkDate].practiced > 0) {
      streak++;
      // 往前推一天
      checkDate = addDays(checkDate, -1);
    }

    return {
      practiced: log.practiced,
      correct: log.correct,
      newMastered: newMastered,
      streak: streak
    };
  }

  /**
   * 取得一週的進度摘要
   * @param {{ items: string[] }} weekConfig - 包含該週所有題目 ID 的設定物件
   * @returns {{ total: number, mastered: number, percentage: number, items: Array<{id: string, mastery: number, label: string}> }}
   */
  function getWeeklyProgress(weekConfig) {
    var itemIds = (weekConfig && weekConfig.items) || [];
    var total = itemIds.length;
    var mastered = 0;
    var result = [];

    for (var i = 0; i < itemIds.length; i++) {
      var id = itemIds[i];
      var mastery = getMastery(id);
      if (mastery >= 4) mastered++; // 4 (有信心) 和 5 (已精通) 都算掌握

      result.push({
        id: id,
        mastery: mastery,
        label: MASTERY_LABELS[mastery] || '未知'
      });
    }

    return {
      total: total,
      mastered: mastered,
      percentage: total > 0 ? Math.round((mastered / total) * 100) : 0,
      items: result
    };
  }

  /**
   * 清除所有進度資料
   * @param {boolean} confirm - 必須傳 true 才會執行，防止誤刪
   */
  function reset(confirm) {
    if (confirm !== true) {
      // 安全機制：需要明確傳入 true 才會清除
      return false;
    }
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  // 公開介面
  return {
    recordAnswer: recordAnswer,
    getMastery: getMastery,
    getItemsDueForReview: getItemsDueForReview,
    getDailyStats: getDailyStats,
    getWeeklyProgress: getWeeklyProgress,
    reset: reset,
    // 匯出常數，方便外部使用
    MASTERY_LABELS: MASTERY_LABELS,
    REVIEW_INTERVALS: REVIEW_INTERVALS
  };
})();
