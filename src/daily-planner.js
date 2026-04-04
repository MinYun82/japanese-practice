/**
 * daily-planner.js — 每日練習計畫模組
 *
 * 根據 weekConfig.dailyPlan 決定今天該練什麼。
 * 整合 Progress 模組做微調：已掌握的項目降低優先順序。
 *
 * 設計原則：
 *   KISS - 簡單的日期計算 + 項目過濾
 *   SRP  - 只負責「今天該練什麼」，不負責 UI 或進度記錄
 */
var DailyPlanner = (function () {
  'use strict';

  /**
   * 計算今天是上課後的第幾天 (1-7)
   * @param {string} classDate - 上課日期 (ISO: "2026-04-06")
   * @returns {number} 1-7，超過 7 天回傳 7（視為總複習日）
   */
  function getDayNumber(classDate) {
    if (!classDate) return 1;
    var classTime = new Date(classDate).getTime();
    var now = new Date().getTime();
    var diffDays = Math.floor((now - classTime) / (24 * 60 * 60 * 1000)) + 1;

    // 限制在 1-7 範圍
    if (diffDays < 1) return 1;
    if (diffDays > 7) return 7;
    return diffDays;
  }

  /**
   * 取得今天的練習計畫
   * @param {object} weekConfig - 週設定 JSON（含 dailyPlan 陣列）
   * @param {object} [options]  - { forceDay: number } 可強制指定第幾天
   * @returns {object|null} 今天的計畫物件，或 null
   */
  function getTodayPlan(weekConfig, options) {
    if (!weekConfig || !weekConfig.dailyPlan) return null;

    var opts = options || {};
    var dayNum = opts.forceDay || getDayNumber(weekConfig.date);
    var plan = null;

    // 找到對應天數的計畫
    for (var i = 0; i < weekConfig.dailyPlan.length; i++) {
      if (weekConfig.dailyPlan[i].day === dayNum) {
        plan = weekConfig.dailyPlan[i];
        break;
      }
    }

    if (!plan) {
      // 找不到就用最後一天（總複習）
      plan = weekConfig.dailyPlan[weekConfig.dailyPlan.length - 1];
    }

    return plan;
  }

  /**
   * 根據今日計畫，解析出實際要練習的項目物件
   * 整合 Progress 做微調：已精通的項目標記但不移除（讓使用者看到成就）
   *
   * @param {object} weekConfig - 週設定 JSON
   * @param {object} todayPlan  - getTodayPlan() 回傳的計畫
   * @returns {object} { newItems: [], reviewItems: [], allItems: [], masteredCount: number }
   */
  function resolveItems(weekConfig, todayPlan) {
    if (!todayPlan) return { newItems: [], reviewItems: [], allItems: [], masteredCount: 0 };

    var allNewItems = weekConfig.newItems || [];
    var rawIds = todayPlan.items || todayPlan.newItemIds || [];
    // Filter out concept IDs (they start with "concept-")
    var newIds = rawIds.filter(function (id) { return id.indexOf('concept-') !== 0; });
    var reviewIds = todayPlan.review || todayPlan.reviewItemIds || [];

    // 查找函式
    function findById(id) {
      for (var i = 0; i < allNewItems.length; i++) {
        if (allNewItems[i].id === id) return allNewItems[i];
      }
      // 從 KANA_POOL 查找（複習上週的假名）
      if (typeof QuizGenerator !== 'undefined' && QuizGenerator.KANA_POOL) {
        for (var j = 0; j < QuizGenerator.KANA_POOL.length; j++) {
          var k = QuizGenerator.KANA_POOL[j];
          if (k.reading === id) return { id: id, char: k.char, reading: k.reading, type: k.type };
        }
      }
      return null;
    }

    var newItems = [];
    var reviewItems = [];
    var masteredCount = 0;

    // 解析新項目
    newIds.forEach(function (id) {
      var item = findById(id);
      if (item) {
        item._mastery = (typeof Progress !== 'undefined') ? Progress.getMastery(id) : 0;
        if (item._mastery >= 4) masteredCount++;
        newItems.push(item);
      }
    });

    // 解析複習項目
    reviewIds.forEach(function (id) {
      var item = findById(id);
      if (item) {
        item._mastery = (typeof Progress !== 'undefined') ? Progress.getMastery(id) : 0;
        if (item._mastery >= 4) masteredCount++;
        reviewItems.push(item);
      }
    });

    return {
      newItems: newItems,
      reviewItems: reviewItems,
      allItems: newItems.concat(reviewItems),
      masteredCount: masteredCount
    };
  }

  /**
   * 取得整週進度總覽
   * @param {object} weekConfig - 週設定 JSON
   * @returns {array} 7 天的摘要陣列 [{ day, label, itemCount, masteredCount, isToday }]
   */
  function getWeekOverview(weekConfig) {
    if (!weekConfig || !weekConfig.dailyPlan) return [];

    var todayNum = getDayNumber(weekConfig.date);

    return weekConfig.dailyPlan.map(function (plan) {
      var resolved = resolveItems(weekConfig, plan);
      return {
        day: plan.day,
        label: plan.label || plan.title,
        title: plan.title || plan.label,
        description: plan.description,
        mode: plan.mode,
        itemCount: resolved.allItems.length,
        masteredCount: resolved.masteredCount,
        isToday: plan.day === todayNum,
        isPast: plan.day < todayNum
      };
    });
  }

  // 公開 API
  return {
    getDayNumber: getDayNumber,
    getTodayPlan: getTodayPlan,
    resolveItems: resolveItems,
    getWeekOverview: getWeekOverview
  };
})();
