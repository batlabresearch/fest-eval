/* 심사위원 화면과 관리자 화면이 함께 쓰는 기능: 점수 환산, 저장소, 서버 통신 */
(() => {
  "use strict";

  const config = window.EVAL_CONFIG;
  const DEMO_KEY = "eval:v1:demo-store";
  const REQUEST_TIMEOUT_MS = 30000;

  const normalizeName = (name) => String(name || "").replace(/\s+/g, " ").trim();

  // 등급 → 점수: 평가항목마다 config.js의 points 표를 따른다
  function pointsFor(grade, criterion) {
    const value = criterion.points && criterion.points[grade];
    return typeof value === "number" ? value : 0;
  }

  const presenterCount = (type) =>
    config.types[type].categories.reduce((n, cat) => n + cat.presenters.length, 0);

  // localStorage는 사생활 보호 모드 등에서 막힐 수 있으므로 항상 감싸서 쓴다
  const storage = {
    get(key) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* 저장소 사용 불가 */ }
    }
  };

  const escapeHtml = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function formatDateTime(value) {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value || "");
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /* ── 서버 통신 ───────────────────────────────────────────────
   * appsScriptUrl이 있으면 구글 Apps Script로, 없으면 이 브라우저의
   * localStorage에 같은 형식으로 저장하는 테스트 모드로 동작한다. */
  const isDemo = !String(config.appsScriptUrl || "").trim();

  const SERVER_ERRORS = {
    bad_password: "관리자 비밀번호가 틀렸습니다.",
    password_not_set: "Apps Script의 [프로젝트 설정 → 스크립트 속성]에 ADMIN_PASSWORD를 먼저 등록해 주세요.",
    bad_request: "요청 형식이 올바르지 않습니다.",
    busy: "다른 제출을 처리 중입니다. 잠시 후 다시 시도해 주세요."
  };

  async function postToServer(body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      // text/plain으로 보내야 브라우저가 사전 요청(CORS preflight)을 하지 않는다
      const res = await fetch(config.appsScriptUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
      const data = await res.json();
      if (!data || data.ok !== true) {
        const code = data && data.error;
        throw new Error(SERVER_ERRORS[code] || `서버 오류: ${code || "알 수 없음"}`);
      }
      return data;
    } catch (err) {
      if (err.name === "AbortError") throw new Error("서버 응답이 너무 늦습니다. 네트워크를 확인해 주세요.");
      if (err instanceof TypeError) throw new Error("서버에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.");
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  // 테스트 모드: 서버와 같은 규칙(같은 심사위원의 이전 제출은 덮어쓰기)으로 브라우저에 저장
  function demoSubmit(payload) {
    const store = storage.get(DEMO_KEY) || {};
    const judge = normalizeName(payload.judge);
    const now = new Date().toISOString();
    const kept = (store[payload.type] || []).filter((r) => normalizeName(r.judge) !== judge);
    payload.rows.forEach((r) => {
      kept.push({
        time: now, judge, category: r.category, presenter: r.presenter, topic: r.topic,
        skipped: !!r.skipped, grades: r.grades.slice(), comment: r.comment || ""
      });
    });
    store[payload.type] = kept;
    if (!storage.set(DEMO_KEY, store)) return Promise.reject(new Error("이 브라우저에 저장할 수 없습니다."));
    return Promise.resolve({ ok: true, savedAt: now });
  }

  const api = {
    isDemo,
    submit(payload) {
      const body = Object.assign({ action: "submit" }, payload);
      return isDemo ? demoSubmit(body) : postToServer(body);
    },
    fetchResults(password) {
      if (isDemo) {
        const store = storage.get(DEMO_KEY) || {};
        return Promise.resolve({ ok: true, data: { oral: store.oral || [], poster: store.poster || [] } });
      }
      return postToServer({ action: "results", password });
    },
    clearDemo() { storage.remove(DEMO_KEY); }
  };

  window.EvalCommon = {
    config, normalizeName, pointsFor, presenterCount,
    storage, escapeHtml, formatDateTime, api
  };
})();
