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
   *  categories : 부문 목록. 부문마다 발표자
   *               { name: 이름, topic: 발표주제, advisor: 지도교수, time: "13:00 - 13:20" }
   *               포스터처럼 모두 같은 시간대면 부문에 time을 한 번만 적습니다.
   *               발표자를 추가하려면 같은 형식으로 한 줄을 더 쓰면 됩니다. 순서대로 화면에 나옵니다.
   *               제목 안의 \n 은 줄바꿈입니다 (국문·영문 제목을 두 줄로 쓸 때).
   *               첫 화면의 [발표 순서 · 시간 보기]는 이 time 값으로 시간순 목록을 만듭니다.
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
            { name: "연제혁", topic: "Longitudinal Immune Profiling Following Shingrix Vaccination", advisor: "나이랑", time: "13:00 - 13:20" },
            { name: "김예승", topic: "디지털의료기기 인허가 내비게이터: 디지털의료제품법 기반 제조사 중심 의사결정 경로 개발", advisor: "이사람", time: "13:20 - 13:40" },
            { name: "김영민", topic: "X-ray 영상 인코더의 특징 표현 분해를 통한 임상적 소견 식별", advisor: "김영곤", time: "13:40 - 14:00" },
            { name: "최지연", topic: "Development and application of untargeted metabolomics and lipidomics platform based on high-resolution mass spectrometry", advisor: "한도현", time: "14:00 - 14:20" },
            { name: "홍우솔", topic: "Establishment of PARP Inhibitor-Resistant Ovarian Cancer Cell Lines and Development of 3D Spheroid Models for MS-Based Quantitative Proteomic Analysis", advisor: "한도현", time: "14:20 - 14:40" }
          ]
        },
        {
          label: "우수연구성과 부문",
          presenters: [
            { name: "강동균", topic: "Prediction of antibiotic-associated cutaneous adverse drug reactions using electronic health record foundation models", advisor: "김광수", time: "15:00 - 15:20" },
            { name: "이윤흠", topic: "1-D Collocated Dual-Gradient Sensory Fibers for Comprehensive Sensing and Decoding of Complex Human Motion and Physiology", advisor: "박성준", time: "15:20 - 15:40" }
          ]
        },
        {
          label: "융합의학과 코어랩 협업 부문",
          presenters: [
            { name: "최승재", topic: "전주기의료기기연구센터 시제품제작지원 (진료, 연구지원) 소개", advisor: "조민우", time: "15:40 - 16:00" },
            { name: "정서이", topic: "Leveraging augmented reality for dynamic guidance in 3-dimensional laparoscopic and robotic liver surgery: a prospective case series study", advisor: "공현중", time: "16:00 - 16:20" },
            { name: "류예나", topic: "AI 보조 인터페이스와 슬관절 골관절염 판독: 사용자 전문성에 따른 차이", advisor: "이사람", time: "16:20 - 16:40" },
            { name: "안세윤", topic: "Development of a PVA/Alginate Microneedles for Localized Drug Delivery and Hindlimb Ischemia Regeneration", advisor: "정지홍", time: "16:40 - 17:00" }
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
          time: "11:00 - 12:30",
          presenters: [
            { name: "오주민", topic: "Anti-VEGF-Loaded Hydrogel for Suppressing Bone Bridge Formation Following Growth Plate Injury", advisor: "정지홍" },
            { name: "전우진", topic: "fMRI 호환 가능 멀티모달 탄소나노튜브 신경 인터페이스\nAn fMRI-Compatible Implantable Multimodal CNT Neural Interface", advisor: "박성준" },
            { name: "김도현", topic: "An Implantable Neural Stimulator with Adjustable Compliance Supply and Constant-Current Stimulation", advisor: "백창훈" },
            { name: "이지영", topic: "칫솔질 빈도와 우울증 발생의 연관성: 국민건강보험공단 건강검진코호트 연구", advisor: "김성민" },
            { name: "강대홍", topic: "진료 환경에서의 짧은 보행 및 방향 전환 영상을 이용해 보행 및 균형 기능 평가를 위한 AI Agent 시스템 개발", advisor: "공현중" },
            { name: "이채원", topic: "대사기능 장애 관련 지방간 질환(MASLD) 및 제2형 당뇨를 동반한 고령층에서의 부정맥 발생 위험에 대한 당뇨 약제 계열 간 비교", advisor: "김성민" },
            { name: "김인호", topic: "증강현실 Headset 기기를 이용한 '앉았다 일어서기' 검사에서 완전/불완전 기립 동작 감지 모델 개발\nDevelopment of a Model for Detecting Complete and Incomplete Stand-Ups in the Sit-to-Stand Test Using an Augmented Reality Headset", advisor: "공현중" },
            { name: "김재영", topic: "Is the Contralateral Limb Really Unaffected in Unilateral Knee Osteoarthritis? An IMU–OpenSim Musculoskeletal Analysis", advisor: "조민우" },
            { name: "김은서", topic: "Convergent MTBR-centered tau proteolysis across mouse tauopathy models and human Alzheimer’s disease implicates cathepsin B", advisor: "한도현" },
            { name: "박홍범", topic: "레이저 미세절제 기반 공간 단백체 분석을 통한 신장 손상 동물 모델의 공간 특이적 단백질 변화 규명", advisor: "한도현" },
            { name: "김태윤", topic: "공개 심전도 1,122만 건으로 자기지도 사전학습한 파운데이션 모델의 소아 전이 성능", advisor: "김광수" },
            { name: "이태훈", topic: "종단 안저영상을 이용한 향후 당뇨병 발생 예측을 위한 딥러닝 모델 개발", advisor: "김영곤" },
            { name: "김형섭", topic: "GeneRAG: A Retrieval-Augmented Framework for Spatially Resolved Gene Expression Prediction", advisor: "김경수" },
            { name: "서현엽", topic: "Self-packaged stretchable printed circuits with ligand-bound liquid metal particles in elastomer", advisor: "박성준" },
            { name: "강성준", topic: "Towards Seamless Surgical Flow: A Vision-Based Robotic Scrub Nurse for Instrument Handover and Organization", advisor: "백창훈" },
            { name: "신채호", topic: "전역 맥락과 국소 EHR 이벤트에 기반한 근거 인용 임상 추론 언어모델 개발", advisor: "김광수" },
            { name: "박재현", topic: "이상 탐지를 이용한 말단 흑색종의 재발 관련 조직형태학적 분석", advisor: "김영곤" },
            { name: "김나현", topic: "Rac1-enriched extracellular vesicles promote regenerative remodeling during skin wound healing", advisor: "나이랑" },
            { name: "강주혁", topic: "연속·무선 생화학 모니터링을 위한 피부 밀착형 마이크로니들 플랫폼", advisor: "이원령" },
            { name: "이지평", topic: "Comparison of Large Language Models and Medical Experts for Preoperative Anesthetic Assessment Summarization", advisor: "이현훈" },
            { name: "김경연", topic: "A Conformable Multimodal Skin Marker for CT–MRI Fusion and Infrared-Guided Robotic Tumor Localization", advisor: "이원령" },
            { name: "이동환", topic: "OFF-CLIP: Improving Normal Detection Confidence in Radiology CLIP with Simple Off-Diagonal Term Auto-Adjustment", advisor: "김경수" },
            { name: "윤조앤", topic: "저강도 집속초음파 뇌 자극 치료의 자극 위치 유지를 위한 초음파 트랜스듀서의 위치 조정 자동화에 관한 연구", advisor: "방영봉" },
            { name: "김별하나", topic: "HELPER: Painless Fe3+-Specific GelMA Hydrogel Microneedle Patch for Remote Management of Transfusion-induced Iron Overload", advisor: "정지홍" },
            { name: "김형석", topic: "LLM 기반 Observational Medical Outcomes Partnership Common Data Model(OMOP CDM) Text-to-SQL 시스템", advisor: "이현훈" },
            { name: "김예린", topic: "미세수술을 위한 정밀 조작 및 힘 측정이 가능한 소형·경량 그리퍼 모듈 개발", advisor: "방영봉" },
            { name: "이예지", topic: "Reproducibility of Carotenoid-Related Skin Yellowness Measurement across Finger Site, Hand Dominance, and Test Day", advisor: "조민우" },
            { name: "강동수", topic: "Ontogeny-Dependent Myeloid Programs Differentially Shape Lipid Handling in Established Alzheimer’s Disease", advisor: "나이랑" }
          ]
        }
      ]
    }
  }
};
