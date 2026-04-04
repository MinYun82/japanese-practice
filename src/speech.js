/**
 * speech.js - 日語語音合成服務模組
 * 封裝 Web Speech API，提供日語 TTS 功能
 * 專為年長初學者設計，預設較慢語速
 */
var Speech = (function () {
  'use strict';

  // === 內部狀態 ===
  var _voice = null;       // 選定的日語語音
  var _ready = false;      // 語音是否已就緒
  var _error = null;       // 錯誤訊息

  // === 預設設定 ===
  var DEFAULT_RATE = 0.8;  // 較慢語速，適合長輩學習
  var TIMEOUT_MS = 3000;   // 語音載入超時（毫秒）

  // === 偏好語音名稱（依優先順序） ===
  var PREFERRED_VOICES = [
    'Google 日本語',
    'Google Japanese'
  ];

  /**
   * _findJapaneseVoice - 從可用語音中尋找日語語音
   * 優先選擇 Google 日本語，其次任何 ja-JP 語音
   * @returns {SpeechSynthesisVoice|null}
   */
  function _findJapaneseVoice() {
    var voices = speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return null;
    }

    // 第一輪：尋找偏好語音
    for (var p = 0; p < PREFERRED_VOICES.length; p++) {
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === PREFERRED_VOICES[p]) {
          return voices[i];
        }
      }
    }

    // 第二輪：任何 ja-JP 或 ja 語音
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].lang === 'ja-JP' || voices[j].lang === 'ja') {
        return voices[j];
      }
    }

    return null;
  }

  /**
   * _setReady - 設定就緒狀態
   * @param {SpeechSynthesisVoice|null} voice
   */
  function _setReady(voice) {
    if (voice) {
      _voice = voice;
      _ready = true;
      _error = null;
    } else {
      _ready = false;
      _error = '找不到日語語音';
    }
  }

  /**
   * init - 初始化語音服務
   * 監聽 voiceschanged 事件，並設定超時備案
   * @returns {Promise} 語音就緒時 resolve
   */
  function init() {
    return new Promise(function (resolve) {
      // 檢查瀏覽器是否支援 Speech API
      if (typeof speechSynthesis === 'undefined') {
        _error = '此瀏覽器不支援語音合成';
        _ready = false;
        resolve();
        return;
      }

      // 有些瀏覽器 getVoices() 第一次就有資料
      var voice = _findJapaneseVoice();
      if (voice) {
        _setReady(voice);
        resolve();
        return;
      }

      var settled = false;

      // 監聽 voiceschanged（Chrome 等瀏覽器非同步載入語音列表）
      function onVoicesChanged() {
        if (settled) return;
        var found = _findJapaneseVoice();
        if (found) {
          settled = true;
          speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          _setReady(found);
          resolve();
        }
      }
      speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

      // 超時備案：3 秒後若仍無語音，嘗試最後一次
      setTimeout(function () {
        if (settled) return;
        settled = true;
        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        _setReady(_findJapaneseVoice());
        resolve();
      }, TIMEOUT_MS);
    });
  }

  /**
   * speak - 朗讀日語文字
   * @param {string} text - 要朗讀的日語文字
   * @param {number} [rate] - 語速（預設 0.8，較慢適合學習）
   */
  function speak(text, rate) {
    if (typeof speechSynthesis === 'undefined') return;
    if (!text) return;

    // 取消目前正在播放的語音，避免佇列堆積
    speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = (typeof rate === 'number') ? rate : DEFAULT_RATE;

    // 設定語音（若已載入）
    if (_voice) {
      utterance.voice = _voice;
    }

    // iOS Safari 修正：cancel 後需短暫延遲再播放
    // 否則可能靜音無聲
    setTimeout(function () {
      speechSynthesis.speak(utterance);
    }, 50);
  }

  /**
   * isReady - 檢查語音服務是否就緒
   * @returns {boolean}
   */
  function isReady() {
    return _ready;
  }

  /**
   * getStatus - 取得語音服務狀態
   * @returns {{ ready: boolean, voiceName: string, error: string|null }}
   */
  function getStatus() {
    return {
      ready: _ready,
      voiceName: _voice ? _voice.name : '',
      error: _error
    };
  }

  // === 公開 API ===
  return {
    init: init,
    speak: speak,
    isReady: isReady,
    getStatus: getStatus
  };
})();
