/* =====================================================================
 *  학술제 심사 평가 — 설정 파일
 *  ---------------------------------------------------------------------
 *  행사 정보, 결과 저장 주소, 평가항목과 등급별 점수, 발표자 명단·발표주제를
 *  모두 이 파일 한 곳에서 관리합니다. 이 파일만 고쳐서 GitHub에 올리면 됩니다.
 *
 *  ※ 주의
 *   - 문자열은 반드시 큰따옴표(" ") 안에 쓰고, 항목 끝의 쉼표(,)를 지워 먹지 않게 해 주세요.
 *   - 심사가 시작된 뒤에는 발표자 "이름"과 평가항목 "순서"를 바꾸지 마세요.
 *     (제출된 결과를 이름과 항목 순서로 맞춰서 계산합니다. 발표주제·문구·점수 수정은 언제든 괜찮습니다.)
 * ===================================================================== */
window.EVAL_CONFIG = {
  /* ── 행사 정보 ─────────────────────────────────────────────── */
  eventTitle: "제4회 융합의학과 학술제",

  /* ── 심사위원 첫 화면 문구 ───────────────────────────────────── */
  hero: {
    org: "서울대학교병원 융합의학과",
    orgEn: "Department of Transdisciplinary Medicine",  // 단어 첫 글자(D·T·M)가 강조됩니다
    tagline: "융합, 이제 깊이로",
    display: "DTM",
    displaySub: "ACADEMIC FESTIVAL"
  },

  /* ── 결과 저장 주소 (구글 Apps Script 웹 앱 URL) ───────────────
   *  README의 "구글 시트 연결" 순서대로 배포한 뒤 받은 주소를 붙여 넣으세요.
   *  예) "https://script.google.com/macros/s/AKfycb..../exec"
   *  비워 두면 "테스트 모드"로 동작합니다. (제출 결과가 이 브라우저에만 저장됨)
   */
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwkmmyLE0vKQIMAxIVI-oiedG64UFLiODuWqUBtLLIpvR4kNqCNsuC8-pHVglYXi8BgDg/exec",

  /* ── 등급 ─────────────────────────────────────────────────────
   *  등급별 점수는 아래 평가항목마다 points에 적습니다 (심사 기준과 배점표).
   */
  grades: ["A", "B", "C", "D", "E"],

  /* ── 발표 유형 ────────────────────────────────────────────────
   *  oral   = 구두발표 (부문별로 따로 순위)
   *  poster = 포스터발표
   *
   *  criteria   : 평가항목 { label: 항목명, max: 배점, points: 등급별 점수 }
   *  commentLabel: 발표자별 자유 서술 칸 이름
   *  categories : 부문 목록. 부문마다 발표자 { name: 이름, topic: 발표주제 }
   *               발표자를 추가하려면 { name: "...", topic: "..." }, 한 줄을 더 쓰면 됩니다.
   */
  types: {
    oral: {
      label: "구두발표",
      commentLabel: "심사의견",
      criteria: [
        // 2. 구연 발표 심사 기준과 배점
        { label: "연구내용의 창의성 및 우수성", max: 30, points: { A: 30, B: 27, C: 24, D: 21, E: 18 } },
        { label: "구연능력",                   max: 30, points: { A: 30, B: 27, C: 24, D: 21, E: 18 } },
        { label: "주제 선정의 명확성",          max: 20, points: { A: 20, B: 18, C: 16, D: 14, E: 12 } },
        { label: "발표자료",                   max: 10, points: { A: 10, B: 9,  C: 8,  D: 7,  E: 6 } },
        { label: "질의 응답",                  max: 10, points: { A: 10, B: 9,  C: 8,  D: 7,  E: 6 } }
      ],
      categories: [
        {
          label: "신입 연수생(석사트랙)",
          presenters: [
            { name: "김재영", topic: "하지 근력 평가를 위한 회전축 전환형 로드셀 기반 등척성 휴대용 다이나모미터" }
          ]
        },
        {
          label: "우수연구성과 부문",
          presenters: [
            { name: "정서이", topic: "부비동 CT 스캔을 이용한 딥러닝 기반 폐쇄성 수면무호흡증 예측" },
            { name: "김동영", topic: "Automated AI based Identification of Autism Spectrum Disorder from Home Video" },
            { name: "강동수", topic: "망간-아연-산화철 (Mn0.5Zn0.5Fe2O4) 초자성 나노물질을 이용한 뇌종양 테라노스틱 치료기법" },
            { name: "정수민", topic: "비심장수술 후 급성신장손상 예측을 위한 수술 중 생체신호 기반 딥러닝 알고리즘 연구" }
          ]
        },
        {
          label: "융합의학과 코어랩 협업 부문",
          presenters: [
            { name: "류예나", topic: "무릎 관절염 진단보조 UI 효과의 차이: 일반인의 효율성과 전문가의 적응" },
            { name: "박홍범", topic: "Proteomic Profiling of Extracellular Vesicles: Insights into Disease Pathogenesis" },
            { name: "윤조앤", topic: "자동화된 전립선 초음파 검사를 위한 인공지능 통합형 로봇시스템 개발에 관한 연구" }
          ]
        }
      ]
    },

    poster: {
      label: "포스터발표",
      commentLabel: "비고",
      criteria: [
        // 3. 포스터 심사 기준과 배점
        { label: "구성",         max: 20, points: { A: 20, B: 18,   C: 16, D: 14,   E: 12 } },
        { label: "내용",         max: 45, points: { A: 45, B: 40.5, C: 36, D: 31.5, E: 27 } },
        { label: "포스터 완성도", max: 20, points: { A: 20, B: 18,   C: 16, D: 14,   E: 12 } },
        { label: "질의응답",      max: 15, points: { A: 15, B: 13.5, C: 12, D: 10.5, E: 9 } }
      ],
      categories: [
        {
          label: "포스터 발표",
          presenters: [
            { name: "이창훈", topic: "" },
            { name: "이현지", topic: "" },
            { name: "장보아", topic: "" },
            { name: "정수빈", topic: "" },
            { name: "최승재", topic: "" },
            { name: "최준희", topic: "" },
            { name: "한승희", topic: "" }
          ]
        }
      ]
    }
  }
};
