/**
 * 학술제 심사 평가 — 결과 수집 서버 (Google Apps Script)
 *
 * 구글 시트의 [확장 프로그램 → Apps Script]에 이 파일 내용을 그대로 붙여 넣고
 * 웹 앱으로 배포하세요. 자세한 순서는 README.md의 "구글 시트 연결"을 참고하세요.
 *
 * 시트 구성 (자동 생성)
 *   - 구두발표 / 포스터발표 : 심사위원 × 발표자마다 한 줄 (현재 유효한 최신 제출)
 *   - 제출기록             : 모든 제출 원본 (다시 제출해 덮어쓴 내용도 여기에 남음)
 */

// 관리자 결과 화면(admin.html)의 비밀번호는 코드가 아니라
// [프로젝트 설정 → 스크립트 속성]에 ADMIN_PASSWORD 라는 이름으로 넣습니다.
// (그래서 이 파일은 GitHub에 그대로 올려도 비밀번호가 드러나지 않습니다.)
const SHEETS = { oral: "구두발표", poster: "포스터발표" };
const LOG_SHEET = "제출기록";
const GRADES = ["A", "B", "C", "D", "E"];
const FIXED_HEADERS = ["제출시각", "심사위원", "부문", "발표자", "발표주제", "평가여부"];
const SKIPPED = "평가 안 함";
const EVALUATED = "평가";

function doGet() {
  return json_({ ok: true, message: "심사 결과 수집 서버가 동작 중입니다." });
}

function doPost(e) {
  let req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "bad_request" });
  }
  try {
    if (req.action === "submit") return json_(submit_(req));
    if (req.action === "results") return json_(results_(req));
    return json_({ ok: false, error: "bad_request" });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

/* ── 심사위원 제출 ─────────────────────────────────────────────
 * 같은 심사위원·같은 발표유형으로 다시 제출하면 이전 줄을 지우고 새로 기록한다. */
function submit_(req) {
  const sheetName = SHEETS[req.type];
  const judge = normalize_(req.judge);
  const criteria = Array.isArray(req.criteria) ? req.criteria.slice(0, 10).map((c) => text_(c, 100)) : [];
  const rows = Array.isArray(req.rows) ? req.rows.slice(0, 200) : [];
  if (!sheetName || !judge || judge.length > 50 || !criteria.length || !rows.length) {
    return { ok: false, error: "bad_request" };
  }

  const now = new Date();
  const newRows = rows.map((r) => {
    const skipped = !!r.skipped;
    const grades = criteria.map((_, i) => {
      const g = r.grades && String(r.grades[i] || "").toUpperCase();
      return !skipped && GRADES.indexOf(g) >= 0 ? g : "";
    });
    return [now, judge, text_(r.category, 100), text_(r.presenter, 50), text_(r.topic, 300), skipped ? SKIPPED : EVALUATED]
      .concat(grades, [text_(r.comment, 2000)])
      .map(cell_);
  });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { ok: false, error: "busy" };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheet_(ss, sheetName);
    const headers = FIXED_HEADERS.concat(criteria, ["의견"]);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);

    // 이 심사위원의 이전 제출 줄 삭제 (아래에서부터 지워야 줄 번호가 밀리지 않는다)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const judges = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = judges.length - 1; i >= 0; i--) {
        if (normalize_(unescape_(judges[i][0])) === judge) sheet.deleteRow(i + 2);
      }
    }
    const startRow = sheet.getLastRow() + 1;
    // 글자 칸은 '일반 텍스트' 서식으로 — "10/15" 같은 의견이 날짜·숫자로 바뀌지 않게
    sheet.getRange(startRow, 2, newRows.length, headers.length - 1).setNumberFormat("@");
    sheet.getRange(startRow, 1, newRows.length, headers.length).setValues(newRows);

    const log = getSheet_(ss, LOG_SHEET);
    if (log.getLastRow() === 0) {
      log.appendRow(["제출시각", "발표유형", "심사위원", "제출내용(JSON)"]);
      log.getRange(1, 1, 1, 4).setFontWeight("bold");
      log.setFrozenRows(1);
    }
    log.appendRow([now, sheetName, cell_(judge), cell_(JSON.stringify({ criteria: criteria, rows: rows }).slice(0, 49000))]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, savedAt: now.toISOString() };
}

/* ── 관리자 결과 조회 ─────────────────────────────────────────── */
function results_(req) {
  const adminPassword = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  if (!adminPassword) return { ok: false, error: "password_not_set" };
  if (String(req.password || "") !== adminPassword) return { ok: false, error: "bad_password" };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = {};
  Object.keys(SHEETS).forEach((type) => {
    data[type] = [];
    const sheet = ss.getSheetByName(SHEETS[type]);
    if (!sheet || sheet.getLastRow() < 2) return;
    const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    const header = values[0].filter((h) => h !== "");
    const criteriaCount = header.length - FIXED_HEADERS.length - 1;
    values.slice(1).forEach((row) => {
      if (!row[1]) return;
      data[type].push({
        time: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        judge: unescape_(row[1]),
        category: unescape_(row[2]),
        presenter: unescape_(row[3]),
        topic: unescape_(row[4]),
        skipped: row[5] === SKIPPED,
        grades: row.slice(6, 6 + criteriaCount).map((g) => String(g)),
        comment: unescape_(row[6 + criteriaCount])
      });
    });
  });
  return { ok: true, data: data };
}

/* ── 도우미 ──────────────────────────────────────────────────── */
function getSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function normalize_(value) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
}

function text_(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}

// =, +, -, @ 로 시작하는 글이 수식으로 실행되지 않도록 앞에 ' 를 붙인다
function cell_(value) {
  return typeof value === "string" && /^[=+\-@]/.test(value) ? "'" + value : value;
}

function unescape_(value) {
  const s = String(value == null ? "" : value);
  return /^'[=+\-@]/.test(s) ? s.slice(1) : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
