import { useState, useEffect, useMemo } from "react";

const FONT = `'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`;

/* ───── palette ───── */
const P = {
  bg: "#f5f5f7",
  card: "rgba(255,255,255,0.78)",
  dark: "#0f0f1a",
  navy: "#1a1a2e",
  accent: "#6366f1",
  accent2: "#8b5cf6",
  glow: "rgba(99,102,241,0.35)",
  text: "#1e1e2e",
  sub: "#6b7280",
  border: "rgba(255,255,255,0.45)",
  glass: "rgba(255,255,255,0.55)",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${FONT};background:#e8e8ec}

/* phone shell */
.shell{width:100%;max-width:393px;height:852px;background:${P.bg};margin:0 auto;position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.22)}
@media(min-width:768px){body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px 0}.shell{border-radius:44px}}

/* screens */
.scr{position:absolute;inset:0;transition:transform .38s cubic-bezier(.32,.72,.24,1),opacity .32s;will-change:transform,opacity}
.scr.off-r{transform:translateX(105%);opacity:0;pointer-events:none}
.scr.off-l{transform:translateX(-28%);opacity:0;pointer-events:none}
.scroll{overflow-y:auto;height:100%;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.scroll::-webkit-scrollbar{display:none}

/* glassmorphism card */
.g-card{background:rgba(255,255,255,.72);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.55);border-radius:22px;overflow:hidden;transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s}
.g-card:active{transform:scale(.97)}
.g-card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.1)}

/* badges */
.bdg{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:10.5px;font-weight:700;letter-spacing:.2px}
.bdg-red{background:#fff0f0;color:#dc2626}.bdg-blue{background:#eef2ff;color:#4f46e5}
.bdg-green{background:#ecfdf5;color:#059669}.bdg-orange{background:#fffbeb;color:#d97706}
.bdg-gray{background:#f3f4f6;color:#6b7280}.bdg-dark{background:#1e1b4b;color:#fff}
.bdg-purple{background:#f5f3ff;color:#7c3aed}.bdg-glass{background:rgba(255,255,255,.22);color:#fff;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25)}
.bdg-urgent{background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;animation:urgentPulse 1.5s infinite}

/* nav */
.bnav{position:absolute;bottom:0;left:0;right:0;height:82px;background:rgba(255,255,255,.82);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-top:1px solid rgba(0,0,0,.04);display:flex;align-items:flex-start;padding-top:8px;z-index:90}
.bnav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;cursor:pointer;font-family:${FONT};color:#b0b0b8;font-size:10px;font-weight:600;transition:color .2s;padding-top:4px;position:relative}
.bnav-item.on{color:${P.accent}}
.bnav-item.on::after{content:'';position:absolute;top:-8px;width:20px;height:3px;border-radius:3px;background:${P.accent};animation:dotIn .3s cubic-bezier(.34,1.56,.64,1)}
.bnav-item svg{width:22px;height:22px;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.bnav-item.on svg{transform:scale(1.12)}
.bnav-qr{width:54px;height:54px;border-radius:18px;background:linear-gradient(135deg,${P.accent},${P.accent2});display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px ${P.glow};animation:qrPulse 2.5s infinite;margin-top:-6px}

/* tabs */
.tabs{display:flex;background:rgba(255,255,255,.65);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.04);position:relative}
.tab{flex:1;padding:13px 4px;text-align:center;font-size:12px;font-weight:700;color:#b0b0b8;cursor:pointer;transition:color .25s;border:none;background:none;font-family:${FONT};position:relative;z-index:1}
.tab.on{color:${P.accent}}
.tab-bar-indicator{position:absolute;bottom:0;height:2.5px;background:${P.accent};border-radius:2px;transition:left .32s cubic-bezier(.34,1.56,.64,1),width .32s cubic-bezier(.34,1.56,.64,1)}

/* status tabs */
.stab{display:flex;gap:6px;margin-bottom:14px}
.stab-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:10px 6px;border-radius:16px;font-size:12px;font-weight:800;cursor:pointer;transition:all .25s;border:none;font-family:${FONT}}
.stab-btn.on{color:#fff;box-shadow:0 3px 16px rgba(0,0,0,.12)}

/* buttons */
.btn-p{background:linear-gradient(135deg,${P.accent},${P.accent2});color:#fff;border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:800;width:100%;cursor:pointer;font-family:${FONT};transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px ${P.glow};letter-spacing:.3px}
.btn-p:active{transform:scale(.96);box-shadow:0 2px 10px ${P.glow}}
.btn-s{background:rgba(255,255,255,.75);backdrop-filter:blur(8px);color:${P.navy};border:1.5px solid rgba(0,0,0,.06);border-radius:16px;padding:14px;font-size:14px;font-weight:700;width:100%;cursor:pointer;font-family:${FONT};transition:transform .15s}
.btn-s:active{transform:scale(.97)}
.btn-sm{background:linear-gradient(135deg,${P.accent},${P.accent2});color:#fff;border:none;border-radius:12px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:${FONT};box-shadow:0 2px 12px ${P.glow}}

/* input rows */
.inp-row{background:rgba(243,244,246,.65);border-radius:14px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;border:1px solid rgba(0,0,0,.03)}

/* modal */
.modal-bg{position:absolute;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end}
.modal-sheet{background:#fff;border-radius:28px 28px 0 0;padding:28px 20px 32px;width:100%;max-height:88vh;overflow-y:auto;animation:slideUp .4s cubic-bezier(.32,.72,.24,1)}
.modal-handle{width:40px;height:4px;background:#e0e0e0;border-radius:2px;margin:0 auto 20px}

/* status chips */
.st-pending{background:#fffbeb;color:#d97706;border:1.5px solid #fde68a;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:800}
.st-approved{background:#ecfdf5;color:#059669;border:1.5px solid #86efac;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:800}

/* search */
.search-wrap{position:relative;transition:all .3s}
.search-input{width:100%;background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.18);border-radius:16px;padding:14px 16px 14px 44px;font-size:14px;font-weight:500;color:#fff;outline:none;font-family:${FONT};transition:all .3s}
.search-input::placeholder{color:rgba(255,255,255,.45)}
.search-input:focus{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.35);box-shadow:0 0 20px rgba(99,102,241,.25)}
.search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:17px;pointer-events:none}

/* animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes dotIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes qrPulse{0%,100%{box-shadow:0 4px 24px ${P.glow}}50%{box-shadow:0 4px 36px rgba(99,102,241,.55)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-60px) rotate(360deg);opacity:0}}
@keyframes heartPop{0%{transform:scale(1)}30%{transform:scale(1.35)}60%{transform:scale(.9)}100%{transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes borderGlow{0%,100%{border-color:rgba(99,102,241,.3)}50%{border-color:rgba(99,102,241,.7)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes urgentPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.85;transform:scale(1.04)}}
.fu{animation:fadeUp .45s ease both}
.fu1{animation:fadeUp .45s .06s ease both}
.fu2{animation:fadeUp .45s .12s ease both}
.fu3{animation:fadeUp .45s .18s ease both}
.fu4{animation:fadeUp .45s .24s ease both}
.skel{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.6s infinite}

/* carousel */
.am-wrap{position:relative;height:330px;overflow:hidden;margin:0 20px}
.am-card{position:absolute;width:calc(100% - 0px);left:0px;top:0;border-radius:20px;overflow:hidden;will-change:transform,opacity,filter;transform-origin:center center}
.section-label{display:flex;align-items:center;gap:8px;padding:0 16px;margin-bottom:10px;margin-top:8px}
.section-label:first-of-type{margin-top:0}
.section-dot{width:8px;height:8px;border-radius:4px}
.section-title{font-size:15px;font-weight:900}
.section-count{font-size:12px;color:${P.sub};font-weight:600;margin-left:auto}


.detail-nav-btn:hover { background:rgba(255,255,255,.35) !important; transform:scale(1.08); }
.detail-nav-btn:active { transform:scale(0.95); }
.car-arrow:hover { background:rgba(255,255,255,1) !important; box-shadow:0 4px 16px rgba(0,0,0,0.15) !important; transform:translateY(-50%) scale(1.08) !important; }
.car-arrow:active { transform:translateY(-50%) scale(0.95) !important; }
`;

/* ─── Google Sheets API 엔드포인트 ─── */
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz4CkYNHCCvBa0saV2XE6mZTZZ2CdMSZ8rXhzN1mvSynEr7KiZtg2e3-eqKvTwjpLJk/exec";

/* ─── 시트 데이터를 앱 형식으로 변환 ─── */
function transformSheetData(rows) {
  return rows.map(r => ({
    id: Number(r.id),
    name: r.name,
    venue: r.venue,
    hall: r.hall,
    location: r.location || "",
    country: "KR",
    flag: "\u{1F1F0}\u{1F1F7}",
    date: r.date,
    dateStart: r.dateStart,
    dateEnd: r.dateEnd,
    category: r.category,
    free: r.free === true || r.free === "TRUE" || r.free === 1,
    price: r.price,
    regDeadline: r.regDeadline,
    image: r.image,
    color: r.color,
    desc: "",
    visitors: r.visitors,
    rating: Number(r.rating) || 4.5,
  }));
}

/* ─── 실제 2026년 전시회 데이터 (오프라인 fallback) ─── */

const EXHIBITIONS_FALLBACK = [
  { id: 1, name: "마이펫페어 2026 일산 Part1", venue: "킨텍스", hall: "전시홀 7", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.01.16 ~ 01.18", dateStart: "2026-01-16", dateEnd: "2026-01-18", category: "반려동물", free: true, price: "무료(사전등록)", regDeadline: "2026-01-11", image: "🐾", color: "#FF6B9D", desc: "반려동물 용품 및 서비스를 한자리에서 만날 수 있는 전문 박람회입니다. 펫의류, 먹이, 장난감 등 다양한 제품이 전시됩니다.", visitors: "3만", rating: 4.5, regUrl: "https://www.mypetfair.co.kr/mypetfairticket" },
  { id: 2, name: "2026 카페디저트페어", venue: "킨텍스", hall: "전시홀 7A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.01.22 ~ 01.25", dateStart: "2026-01-22", dateEnd: "2026-01-25", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-01-17", image: "☕", color: "#8B4513", desc: "카페 운영자와 디저트 제조업체들의 신상품 발표 및 거래 기회의 장입니다. 최신 커피 머신과 베이킹 트렌드를 만날 수 있습니다.", visitors: "4만", rating: 4.6, regUrl: "https://www.cafedessertfair.com/" },
  { id: 3, name: "2026 코리아빌드위크", venue: "킨텍스", hall: "전시홀 1~5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.02.04 ~ 02.07", dateStart: "2026-02-04", dateEnd: "2026-02-07", category: "건축", free: true, price: "무료(사전등록)", regDeadline: "2026-01-30", image: "🏗️", color: "#4A90E2", desc: "건설 및 건축 산업의 최신 기술과 자재를 선보이는 대규모 국제 박람회입니다. 건설사 및 건축가를 위한 필수 행사입니다.", visitors: "6만", rating: 4.7, regUrl: "https://koreabuild.co.kr/kintex/" },
  { id: 4, name: "제52회 맘앤베이비엑스포", venue: "킨텍스", hall: "전시홀 7", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.02.26 ~ 03.01", dateStart: "2026-02-26", dateEnd: "2026-03-01", category: "육아", free: true, price: "무료(사전등록)", regDeadline: "2026-02-21", image: "👶", color: "#FFB6C1", desc: "임산부 및 영아용 필수용품을 소개하는 박람회입니다. 의류, 이유식, 유모차 등 아기 관련 제품의 최신 트렌드를 확인할 수 있습니다.", visitors: "5만", rating: 4.5, regUrl: "https://www.mombaby.co.kr/" },
  { id: 5, name: "2026 서울경기 밀리언쇼 우수중소기업&농특산품박람회", venue: "킨텍스", hall: "전시홀 1A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.05 ~ 03.09", dateStart: "2026-03-05", dateEnd: "2026-03-09", category: "농수산", free: true, price: "무료(사전등록)", regDeadline: "2026-02-28", image: "🌾", color: "#90EE90", desc: "우수 중소기업과 지역 농특산품을 소비자에게 직접 소개하는 행사입니다. 한돈, 한우, 수산물 등 우수 상품의 시식과 구매 기회가 제공됩니다.", visitors: "4만", rating: 4.4, regUrl: "https://www.kintex.com/web/ko/event/view.do?seq=2025044120" },
  { id: 6, name: "2026 캠핑앤피크닉페어", venue: "킨텍스", hall: "전시홀 7,8", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.06 ~ 03.08", dateStart: "2026-03-06", dateEnd: "2026-03-08", category: "캠핑·아웃도어", free: true, price: "무료(사전등록)", regDeadline: "2026-03-01", image: "⛺", color: "#228B22", desc: "캠핑 장비와 야외활동용품의 전문 박람회입니다. 텐트, 침낭, 취사용품 등 최신 캠핑 제품을 한자리에서 만날 수 있습니다.", visitors: "3만", rating: 4.6, regUrl: "https://www.campingfair.co.kr/" },
  { id: 7, name: "2026 한국국제낚시박람회", venue: "킨텍스", hall: "전시홀 2", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.06 ~ 03.08", dateStart: "2026-03-06", dateEnd: "2026-03-08", category: "스포츠·레저", free: true, price: "무료(사전등록)", regDeadline: "2026-03-01", image: "🎣", color: "#4169E1", desc: "낚시용품과 장비의 국제 박람회입니다. 낚시대, 릴, 채비용품 등 다양한 낚시 용품 및 최신 기술 제품이 전시됩니다.", visitors: "2만", rating: 4.5, regUrl: "https://www.kintex.com/web/ko/event/view.do?seq=2025044120" },
  { id: 8, name: "2026 고양 가구엑스포 & 홈앤리빙 더쇼", venue: "킨텍스", hall: "전시홀 10", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.12 ~ 03.15", dateStart: "2026-03-12", dateEnd: "2026-03-15", category: "가구·인테리어", free: true, price: "무료(사전등록)", regDeadline: "2026-03-07", image: "🛋️", color: "#D2691E", desc: "가구 및 홈인테리어 제품의 대규모 전시회입니다. 소파, 침대, 조명, 베드 용품 등 생활공간을 아름답게 꾸미는 제품들이 전시됩니다.", visitors: "5만", rating: 4.7, regUrl: "https://koreaxpo.com/" },
  { id: 9, name: "2026 펫쇼코리아(상)", venue: "킨텍스", hall: "전시홀 7", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.13 ~ 03.15", dateStart: "2026-03-13", dateEnd: "2026-03-15", category: "반려동물", free: true, price: "무료(사전등록)", regDeadline: "2026-03-08", image: "🐶", color: "#FF8C00", desc: "반려동물 품종 전시 및 애완동물 용품 박람회입니다. 펫 관련 서비스, 훈련소, 미용용품 등 반려동물 문화를 한눈에 볼 수 있습니다.", visitors: "3만", rating: 4.6, regUrl: "https://www.pet-show.co.kr/page/page113" },
  { id: 10, name: "오토모티브 테스팅 엑스포 2026", venue: "킨텍스", hall: "전시홀 10B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.18 ~ 03.20", dateStart: "2026-03-18", dateEnd: "2026-03-20", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-13", image: "🚗", color: "#1C1C1C", desc: "자동차 산업의 테스팅 장비 및 기술 박람회입니다. 차량 안전 검사 장비, 배출가스 측정 기술 등 자동차 제조 관련 산업용 제품이 전시됩니다.", visitors: "3만", rating: 4.4, regUrl: "https://www.kintex.com/web/ko/event/list.do" },
  { id: 11, name: "제25회 세계 보안 엑스포", venue: "킨텍스", hall: "전시홀 3,4,5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.18 ~ 03.20", dateStart: "2026-03-18", dateEnd: "2026-03-20", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-13", image: "🔐", color: "#2F4F4F", desc: "보안 장비 및 기술의 국제 박람회입니다. CCTV, 접근제어, 화재감지기 등 통합보안 솔루션이 전시됩니다.", visitors: "4만", rating: 4.5, regUrl: "https://www.seconexpo.com/" },
  { id: 12, name: "코리아 나라장터 엑스포 2026", venue: "킨텍스", hall: "전시홀 2B,3,4,5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.25 ~ 03.27", dateStart: "2026-03-25", dateEnd: "2026-03-27", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-20", image: "📋", color: "#696969", desc: "정부 구매 및 나라장터 입찰 관련 기업의 수의계약 기회 박람회입니다. 중소기업의 정부 사업 참여를 지원합니다.", visitors: "4만", rating: 4.3, regUrl: "https://www.koppex.com/2026/v2.php?s=22" },
  { id: 13, name: "국제콜드체인산업전", venue: "킨텍스", hall: "전시홀 10A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "물류", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "❄️", color: "#4169E1", desc: "저온 물류 및 냉동식품 산업 전문 박람회입니다. 냉동 수송용 장비, 저온 창고 솔루션, 콜드체인 기술이 전시됩니다.", visitors: "3만", rating: 4.5, regUrl: "https://www.koreacoldchain.com/" },
  { id: 14, name: "국제다크팩토리산업전", venue: "킨텍스", hall: "전시홀 10B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "🏭", color: "#36454F", desc: "스마트팩토리 및 자동화 생산 기술 박람회입니다. IoT 기반 생산 관리 시스템, 로봇 자동화 솔루션 등이 전시됩니다.", visitors: "3만", rating: 4.4, regUrl: "https://www.kintex.com/web/ko/event/list.do" },
  { id: 15, name: "국제연구·실험 및 첨단분석장비전", venue: "킨텍스", hall: "전시홀 7A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "과학", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "🔬", color: "#800080", desc: "연구기관 및 대학을 위한 첨단 실험장비 박람회입니다. 분석기기, 측정 장비, 연구 소프트웨어 등 과학 연구용 제품이 전시됩니다.", visitors: "3만", rating: 4.5, regUrl: "https://www.kintex.com/web/ko/event/list.do" },
  { id: 16, name: "제25회 국제포장기자재전", venue: "킨텍스", hall: "전시홀 1B,2,3", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "📦", color: "#8B4513", desc: "포장재료 및 포장기계 전문 박람회입니다. 종이박스, 필름, 포장기계, 라벨링 솔루션 등이 전시됩니다.", visitors: "5만", rating: 4.6, regUrl: "https://www.koreapack.org/" },
  { id: 17, name: "국제물류산업대전", venue: "킨텍스", hall: "전시홀 9B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "물류", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "🚚", color: "#1E90FF", desc: "물류 산업의 종합 박람회입니다. 운송, 창고, 배송 관리 시스템, 지게차, 로봇 핸들링 솔루션 등이 전시됩니다.", visitors: "6만", rating: 4.7, regUrl: "https://www.koreamat.org/" },
  { id: 18, name: "제2회 ESG 지속가능패키징페어", venue: "킨텍스", hall: "전시홀 1A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "환경·에너지", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "♻️", color: "#228B22", desc: "친환경 포장재 및 지속가능 포장기술 박람회입니다. 생분해 포장재, 재활용 소재, 친환경 포장 솔루션이 전시됩니다.", visitors: "3만", rating: 4.6, regUrl: "https://www.koreapack.org/" },
  { id: 19, name: "국제제약·바이오·화장품기술전", venue: "킨텍스", hall: "전시홀 4B,5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "의료·바이오", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "💊", color: "#DC143C", desc: "제약, 바이오, 화장품 산업의 기술 및 원료 박람회입니다. 신약 개발 기술, 바이오소재, 화장품 원료가 전시됩니다.", visitors: "5만", rating: 4.7, regUrl: "https://www.koreapack.org/" },
  { id: 20, name: "국제화학장치·공정기술전", venue: "킨텍스", hall: "전시홀 4A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "⚗️", color: "#FFD700", desc: "화학 산업의 장치 및 공정 기술 박람회입니다. 반응기, 증류장치, 액체 분리 기술, 공정 자동화 솔루션이 전시됩니다.", visitors: "3만", rating: 4.4, regUrl: "https://www.koreapack.org/" },
  { id: 21, name: "코스메틱 인사이드 코리아", venue: "킨텍스", hall: "전시홀 7A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "뷰티·화장품", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "💄", color: "#FF1493", desc: "화장품 제조 및 원료 전문 박람회입니다. 기초 원료, 패키징 소재, 제조 장비, 용용 기술이 전시됩니다.", visitors: "3만", rating: 4.5, regUrl: "https://www.koreapack.org/" },
  { id: 22, name: "국제의약품·바이오산업전", venue: "킨텍스", hall: "전시홀 7A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.03.31 ~ 04.03", dateStart: "2026-03-31", dateEnd: "2026-04-03", category: "의료·바이오", free: true, price: "무료(사전등록)", regDeadline: "2026-03-26", image: "🧬", color: "#00CED1", desc: "의약품 및 바이오 산업의 종합 박람회입니다. 신약 개발 플랫폼, 임상 시험 기술, 바이오 마커 진단 기술이 전시됩니다.", visitors: "4만", rating: 4.6, regUrl: "https://www.koreapack.org/" },
  { id: 23, name: "2026 냥냥펀치 캣쇼 일산", venue: "킨텍스", hall: "전시홀 7B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.04.24 ~ 04.26", dateStart: "2026-04-24", dateEnd: "2026-04-26", category: "반려동물", free: true, price: "무료(사전등록)", regDeadline: "2026-04-19", image: "🐱", color: "#FF69B4", desc: "고양이 애호가들을 위한 전문 박람회입니다. 고양이 품종 전시, 건강용품, 장난감, 사료 등 고양이 관련 제품이 전시됩니다.", visitors: "2만", rating: 4.5, regUrl: "https://cat-show.co.kr/" },
  { id: 24, name: "제70회 MBC건축박람회", venue: "킨텍스", hall: "전시홀 3A,4,5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.05.07 ~ 05.10", dateStart: "2026-05-07", dateEnd: "2026-05-10", category: "건축", free: true, price: "무료(사전등록)", regDeadline: "2026-05-02", image: "🏢", color: "#696969", desc: "건축 자재 및 인테리어 소재 박람회입니다. 문짝, 타일, 욕실용품, 건축 자재, 건설 기계 등 건축 전반의 제품이 전시됩니다.", visitors: "6만", rating: 4.7, regUrl: "https://koreabuild.co.kr/kintex/" },
  { id: 25, name: "메가쇼 & 트래블쇼 2026 시즌 1", venue: "킨텍스", hall: "전시홀 4,5", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.05.14 ~ 05.17", dateStart: "2026-05-14", dateEnd: "2026-05-17", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-09", image: "✈️", color: "#1E90FF", desc: "국내외 여행 정보 및 패키지 여행 상품을 소개하는 박람회입니다. 항공사, 호텔, 여행사의 특가 상품과 여행 팁을 얻을 수 있습니다.", visitors: "5만", rating: 4.6, regUrl: "https://www.megashow.co.kr/" },
  { id: 26, name: "2026 코베 베이비페어&유아교육전", venue: "킨텍스", hall: "전시홀 10", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.05.14 ~ 05.17", dateStart: "2026-05-14", dateEnd: "2026-05-17", category: "육아", free: true, price: "무료(사전등록)", regDeadline: "2026-05-09", image: "👪", color: "#FFB6C1", desc: "영아용품 및 유아교육 프로그램 박람회입니다. 교구, 학습용품, 문화센터, 유아복 등 0~7세 아동 관련 제품이 전시됩니다.", visitors: "4만", rating: 4.5 },
  { id: 27, name: "2026 국제아웃도어캠핑&레포츠페스티벌(5월)", venue: "킨텍스", hall: "전시홀 7,8", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.05.23 ~ 05.25", dateStart: "2026-05-23", dateEnd: "2026-05-25", category: "캠핑·아웃도어", free: true, price: "무료(사전등록)", regDeadline: "2026-05-18", image: "🏕️", color: "#228B22", desc: "야외활동 전문 박람회입니다. 캠핑용품, 등산장비, 낚시 용품, 스포츠 용품 등 다양한 아웃도어 제품이 전시됩니다.", visitors: "4만", rating: 4.6 },
  { id: 28, name: "2026 메가주 시즌1", venue: "킨텍스", hall: "전시홀 7,8", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.05.29 ~ 05.31", dateStart: "2026-05-29", dateEnd: "2026-05-31", category: "식음료", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-24", image: "🍺", color: "#8B4513", desc: "주류 및 음료 박람회입니다. 와인, 맥주, 소주, 칵테일 등 다양한 주류 상품과 주류 문화를 소개합니다.", visitors: "3만", rating: 4.4 },
  { id: 29, name: "2026 마이프차 프랜차이즈 창업박람회 시즌 1", venue: "킨텍스", hall: "전시홀 10B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.06.04 ~ 06.07", dateStart: "2026-06-04", dateEnd: "2026-06-07", category: "창업", free: true, price: "무료(사전등록)", regDeadline: "2026-05-30", image: "🍽️", color: "#FF6347", desc: "외식 프랜차이즈 창업 박람회입니다. 한식, 중식, 일식, 카페 등 다양한 외식 브랜드의 가맹점 모집 정보를 얻을 수 있습니다.", visitors: "4만", rating: 4.5 },
  { id: 30, name: "2026 카페&베이커리페어 시즌1", venue: "킨텍스", hall: "전시홀 10A", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.06.04 ~ 06.07", dateStart: "2026-06-04", dateEnd: "2026-06-07", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-05-30", image: "🥐", color: "#D2B48C", desc: "카페 운영 및 베이킹 전문 박람회입니다. 에스프레소 머신, 원두, 베이킹 재료, 조리 도구 등이 전시됩니다.", visitors: "3만", rating: 4.5 },
  { id: 31, name: "대한민국 국제 관광박람회", venue: "킨텍스", hall: "전시홀 10", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.07.03 ~ 07.05", dateStart: "2026-07-03", dateEnd: "2026-07-05", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-06-28", image: "🗽", color: "#1E90FF", desc: "국내외 관광지 및 관광상품 홍보 박람회입니다. 항공사, 호텔, 랜드마크, 테마파크 등에서 관광상품과 할인정보를 제공합니다.", visitors: "5만", rating: 4.6 },
  { id: 32, name: "2026 생활낚시박람회", venue: "킨텍스", hall: "전시홀 10B", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.08.21 ~ 08.23", dateStart: "2026-08-21", dateEnd: "2026-08-23", category: "스포츠·레저", free: true, price: "무료(사전등록)", regDeadline: "2026-08-16", image: "🎣", color: "#4169E1", desc: "생활 낚시 용품 전문 박람회입니다. 낚시대, 릴, 미끼, 낚시복 등 초보자부터 전문가까지 필요한 모든 낚시용품이 전시됩니다.", visitors: "2만", rating: 4.4, regUrl: "https://www.kintex.com/web/ko/event/view.do?seq=2025044120" },
  { id: 33, name: "한국국제가구 및 인테리어산업대전 (코펀)", venue: "킨텍스", hall: "전시홀 7,8", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.08.27 ~ 08.30", dateStart: "2026-08-27", dateEnd: "2026-08-30", category: "가구·인테리어", free: true, price: "무료(사전등록)", regDeadline: "2026-08-22", image: "🛏️", color: "#8B4513", desc: "가구 및 인테리어 산업의 국제 박람회입니다. 침실용품, 거실 가구, 조명, 데코 소품, 인테리어 트렌드가 전시됩니다.", visitors: "5만", rating: 4.7 },
  { id: 34, name: "2026 TEX+VISION", venue: "킨텍스", hall: "전시홀 10", location: "경기 고양시 일산", country: "KR", flag: "🇰🇷", date: "2026.10.21 ~ 10.23", dateStart: "2026-10-21", dateEnd: "2026-10-23", category: "패션", free: true, price: "무료(사전등록)", regDeadline: "2026-10-16", image: "👕", color: "#FF1493", desc: "섬유 및 패션 산업 박람회입니다. 원단, 패션소재, 의류 제조 기술, 패션트렌드를 선보이는 행사입니다.", visitors: "3만", rating: 4.5 },
  { id: 35, name: "서울국제스포츠레저산업전", venue: "코엑스", hall: "Hall A,B,C", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.03.26 ~ 03.29", dateStart: "2026-03-26", dateEnd: "2026-03-29", category: "스포츠·레저", free: true, price: "무료(사전등록)", regDeadline: "2026-03-21", image: "⚽", color: "#FF6347", desc: "스포츠 용품 및 레저활동 관련 박람회입니다. 운동복, 신발, 스포츠 기구, 피트니스 장비, 야외활동용품이 전시됩니다.", visitors: "5만", rating: 4.6 },
  { id: 36, name: "2026 상반기 해외 유학 이민 박람회", venue: "코엑스", hall: "Hall D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.03.28 ~ 03.29", dateStart: "2026-03-28", dateEnd: "2026-03-29", category: "교육", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-23", image: "🎓", color: "#4169E1", desc: "해외 대학 및 어학원 정보 박람회입니다. 미국, 호주, 캐나다, 영국 등 주요 유학국가의 교육기관 입시정보를 얻을 수 있습니다.", visitors: "2만", rating: 4.3 },
  { id: 37, name: "2026 상반기 IFS 프랜차이즈 창업·산업 박람회", venue: "코엑스", hall: "Hall C,D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.02 ~ 04.04", dateStart: "2026-04-02", dateEnd: "2026-04-04", category: "창업", free: true, price: "무료(사전등록)", regDeadline: "2026-03-28", image: "💼", color: "#FFD700", desc: "프랜차이즈 창업 정보 박람회입니다. 식음료, 편의점, 서비스 프랜차이즈의 가맹점 모집정보와 사업설명회가 개최됩니다.", visitors: "4만", rating: 4.5 },
  { id: 38, name: "2026서울국제불교박람회&제14회 붓다아트페어", venue: "코엑스", hall: "Hall B", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.02 ~ 04.05", dateStart: "2026-04-02", dateEnd: "2026-04-05", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-28", image: "🏯", color: "#DAA520", desc: "불교문화 및 불교미술 박람회입니다. 불상, 탱화, 불교경전, 불교용품, 명상용품 등 불교 관련 문화상품이 전시됩니다.", visitors: "3만", rating: 4.4 },
  { id: 39, name: "제49회 베페 베이비페어", venue: "코엑스", hall: "Hall A", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.02 ~ 04.05", dateStart: "2026-04-02", dateEnd: "2026-04-05", category: "육아", free: true, price: "무료(사전등록)", regDeadline: "2026-03-28", image: "🍼", color: "#FFB6C1", desc: "영아용품 및 임산부용품 박람회입니다. 유모차, 유아복, 이유식, 아기용품 등 0~3세 영아 전용 제품이 전시됩니다.", visitors: "4만", rating: 4.6 },
  { id: 40, name: "한국전자제조산업전 x 오토모티브월드코리아", venue: "코엑스", hall: "Hall A", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.08 ~ 04.10", dateStart: "2026-04-08", dateEnd: "2026-04-10", category: "IT·전자", free: true, price: "무료(사전등록)", regDeadline: "2026-04-03", image: "📱", color: "#1C1C1C", desc: "전자 제조 및 자동차 산업 박람회입니다. 자동차 부품, 전자부품, 반도체, 배터리 등 첨단 제조 제품이 전시됩니다.", visitors: "5만", rating: 4.6, regUrl: "https://www.kintex.com/web/ko/event/list.do" },
  { id: 41, name: "AIR FAIR 2026 국제 기후테크 공기산업 박람회", venue: "코엑스", hall: "Hall B", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.08 ~ 04.10", dateStart: "2026-04-08", dateEnd: "2026-04-10", category: "환경·에너지", free: true, price: "무료(사전등록)", regDeadline: "2026-04-03", image: "💨", color: "#87CEEB", desc: "공기청정 및 기후테크 산업 박람회입니다. 공기청정기, 환기시스템, 미세먼지 제거기, 이산화탄소 감축 기술이 전시됩니다.", visitors: "3만", rating: 4.5 },
  { id: 42, name: "2026 화랑미술제", venue: "코엑스", hall: "Hall C,D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.08 ~ 04.12", dateStart: "2026-04-08", dateEnd: "2026-04-12", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-03", image: "🎨", color: "#FF69B4", desc: "현대미술 화랑 연합전입니다. 유명 화랑의 작품 전시 및 판매, 미술품 감정, 컬렉터 미팅이 개최됩니다.", visitors: "3만", rating: 4.7 },
  { id: 43, name: "2026 서울커피엑스포", venue: "코엑스", hall: "Hall A,B", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.15 ~ 04.18", dateStart: "2026-04-15", dateEnd: "2026-04-18", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-04-10", image: "☕", color: "#8B4513", desc: "커피 산업 전문 박람회입니다. 원두, 에스프레소 머신, 커피용품, 카페 인테리어, 커피 교육 프로그램이 전시됩니다.", visitors: "4만", rating: 4.7 },
  { id: 44, name: "대한민국맥주박람회 & 드링크서울", venue: "코엑스", hall: "Hall C", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.16 ~ 04.18", dateStart: "2026-04-16", dateEnd: "2026-04-18", category: "식음료", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-11", image: "🍺", color: "#FFD700", desc: "맥주 및 음료 박람회입니다. 국내외 맥주, 수입맥주, 칵테일, 음료 브랜드의 시식 및 구매 기회가 제공됩니다.", visitors: "3만", rating: 4.5 },
  { id: 45, name: "2026 한국국제베이커리페어", venue: "코엑스", hall: "Hall D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.16 ~ 04.19", dateStart: "2026-04-16", dateEnd: "2026-04-19", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-04-11", image: "🥖", color: "#D2B48C", desc: "베이킹 산업 박람회입니다. 밀가루, 설탕, 버터, 향신료, 베이킹 도구, 오븐, 데코용품이 전시됩니다.", visitors: "3만", rating: 4.5 },
  { id: 46, name: "2026 우수급식외식산업전", venue: "코엑스", hall: "Hall D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.21 ~ 04.23", dateStart: "2026-04-21", dateEnd: "2026-04-23", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-04-16", image: "🍽️", color: "#FF6347", desc: "단체급식 및 외식산업 박람회입니다. 급식용 식재료, 주방기구, 식재 공급업체, 조리 솔루션이 전시됩니다.", visitors: "2만", rating: 4.3 },
  { id: 47, name: "월드IT쇼", venue: "코엑스", hall: "Hall A,B1,C", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.22 ~ 04.24", dateStart: "2026-04-22", dateEnd: "2026-04-24", category: "IT·전자", free: true, price: "무료(사전등록)", regDeadline: "2026-04-17", image: "💻", color: "#1C1C1C", desc: "정보통신 및 IT 산업 박람회입니다. 서버, 네트워크, 보안솔루션, 클라우드, 빅데이터 기술 등이 전시됩니다.", visitors: "5만", rating: 4.7 },
  { id: 48, name: "2026 서울 일러스트코리아", venue: "코엑스", hall: "Hall B2", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.23 ~ 04.26", dateStart: "2026-04-23", dateEnd: "2026-04-26", category: "디자인", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-18", image: "🎭", color: "#9370DB", desc: "일러스트레이션 및 디자인 박람회입니다. 디지털 일러스트, 캐릭터 디자인, 그래픽 디자인, 디자인 서비스가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 49, name: "K-MEX 2026 한의약 및 통합의약 국제산업박람회", venue: "코엑스", hall: "Hall D", location: "서울 강남구 삼성동", country: "KR", flag: "🇰🇷", date: "2026.04.25 ~ 04.26", dateStart: "2026-04-25", dateEnd: "2026-04-26", category: "의료·바이오", free: true, price: "무료(사전등록)", regDeadline: "2026-04-20", image: "🌿", color: "#228B22", desc: "한의약 및 통합의약 산업 박람회입니다. 한약재, 의료기기, 침구, 뜸, 한의학 솔루션이 전시됩니다.", visitors: "2만", rating: 4.4 },
  { id: 50, name: "제10회 푸드테크 비건페스타&그린페스타", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.03.27 ~ 03.29", dateStart: "2026-03-27", dateEnd: "2026-03-29", category: "식음료", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-22", image: "🥗", color: "#228B22", desc: "비건 식품 및 친환경 식품 박람회입니다. 식물성 식품, 대체육, 비건 간식, 유기농 제품이 전시되고 시식행사가 개최됩니다.", visitors: "2만", rating: 4.6 },
  { id: 51, name: "SMKX 2026 서울 기계식 키보드 박람회", venue: "세텍", hall: "제3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.03.28 ~ 03.29", dateStart: "2026-03-28", dateEnd: "2026-03-29", category: "IT·전자", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-23", image: "⌨️", color: "#696969", desc: "기계식 키보드 전문 박람회입니다. 다양한 스위치, 키보드 커스터마이징, 게이밍 키보드, 입력장치가 전시됩니다.", visitors: "1만", rating: 4.5 },
  { id: 52, name: "ART OnO 2026", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.04.02 ~ 04.05", dateStart: "2026-04-02", dateEnd: "2026-04-05", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-28", image: "🖼️", color: "#FF1493", desc: "온라인 미술 박람회입니다. 신진 미술가의 작품, 아트상품, 미술교육, 미술용품 및 디지털 아트가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 53, name: "2026 보드게임페스타 시즌1", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.04.11 ~ 04.12", dateStart: "2026-04-11", dateEnd: "2026-04-12", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-06", image: "🎲", color: "#FF6347", desc: "보드게임 및 카드게임 박람회입니다. 국내외 보드게임, 카드게임, 게임용품, 게이밍 액세서리, 게임 방송이 전시됩니다.", visitors: "2만", rating: 4.6 },
  { id: 54, name: "웨딩&혼수 박람회", venue: "세텍", hall: "제2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.04.18 ~ 04.19", dateStart: "2026-04-18", dateEnd: "2026-04-19", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-13", image: "💒", color: "#FFB6C1", desc: "웨딩 및 혼수용품 박람회입니다. 웨딩드레스, 예식장, 웨딩홀, 혼수용품, 신혼집 가구, 결혼정보회사가 참여합니다.", visitors: "2만", rating: 4.5 },
  { id: 55, name: "2026 서울건축박람회 춘계", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.04.23 ~ 04.26", dateStart: "2026-04-23", dateEnd: "2026-04-26", category: "건축", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-18", image: "🏗️", color: "#696969", desc: "건축 및 건설 자재 박람회입니다. 건설기계, 건축자재, 인테리어 자재, 신기술, 안전용품이 전시됩니다.", visitors: "3만", rating: 4.6 },
  { id: 56, name: "제17회 뱅크아트페어", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.04.30 ~ 05.03", dateStart: "2026-04-30", dateEnd: "2026-05-03", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-25", image: "🎪", color: "#DAA520", desc: "미술품 판매 및 아트 수집 박람회입니다. 회화, 조각, 도예, 사진, 판화 등 다양한 미술작품과 미술품 감정이 제공됩니다.", visitors: "2만", rating: 4.6 },
  { id: 57, name: "제3회 2026 관상어 파충류 박람회", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.09 ~ 05.10", dateStart: "2026-05-09", dateEnd: "2026-05-10", category: "반려동물", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-04", image: "🐠", color: "#20B2AA", desc: "관상어 및 파충류 전문 박람회입니다. 열대어, 금붕어, 뱀, 도마뱀, 거북이 등 특수 반려동물 및 사육용품이 전시됩니다.", visitors: "1만", rating: 4.4 },
  { id: 58, name: "서울아트페어", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.14 ~ 05.17", dateStart: "2026-05-14", dateEnd: "2026-05-17", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-09", image: "🖌️", color: "#9370DB", desc: "서울 주요 화랑 및 미술관의 작품 판매 박람회입니다. 현대미술, 한국미술, 전통미술 등 다양한 장르의 미술작품이 전시됩니다.", visitors: "3만", rating: 4.7 },
  { id: 59, name: "2026 서울베이비&키즈페어 Spring", venue: "세텍", hall: "제1전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.21 ~ 05.24", dateStart: "2026-05-21", dateEnd: "2026-05-24", category: "육아", free: true, price: "무료(사전등록)", regDeadline: "2026-05-16", image: "👶", color: "#FFB6C1", desc: "아기 및 키즈용품 박람회입니다. 유아복, 신발, 장난감, 교구, 유아식품, 유아용 생활용품이 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 60, name: "2026 서울사케페스티벌", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.23 ~ 05.24", dateStart: "2026-05-23", dateEnd: "2026-05-24", category: "식음료", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-18", image: "🍶", color: "#DAA520", desc: "일본 사케 및 한국 전통주 페스티벌입니다. 다양한 품종의 사케, 와인, 맥주의 시식 및 구매, 주류 교육이 제공됩니다.", visitors: "2만", rating: 4.6 },
  { id: 61, name: "2026 더골프쇼&더캠핑쇼 in서울", venue: "세텍", hall: "제3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.29 ~ 05.31", dateStart: "2026-05-29", dateEnd: "2026-05-31", category: "스포츠·레저", free: true, price: "무료(사전등록)", regDeadline: "2026-05-24", image: "⛳", color: "#228B22", desc: "골프 및 캠핑 용품 박람회입니다. 골프클럽, 골프백, 골프화, 캠핑용품, 스포츠 의류, 야외활동 장비가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 62, name: "라스트 페어 2026", venue: "세텍", hall: "제2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.05.30 ~ 05.31", dateStart: "2026-05-30", dateEnd: "2026-05-31", category: "디자인", free: false, price: "10,000원~15,000원", regDeadline: "2026-05-25", image: "👞", color: "#8B4513", desc: "신발 및 핸드백 박람회입니다. 운동화, 구두, 부츠, 운동복, 핸드백, 액세서리 등 패션 용품이 전시됩니다.", visitors: "1만", rating: 4.4 },
  { id: 63, name: "하비페어 2026", venue: "세텍", hall: "제1전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.06.06 ~ 06.07", dateStart: "2026-06-06", dateEnd: "2026-06-07", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-06-01", image: "🎮", color: "#FF69B4", desc: "취미용품 및 피규어 박람회입니다. 게임 관련 굿즈, 피규어, 모형, 수집품, 게임 콘솔, 게이밍 액세서리가 전시됩니다.", visitors: "1만", rating: 4.5 },
  { id: 64, name: "제8회 대한민국민화아트페어", venue: "세텍", hall: "제1전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.06.11 ~ 06.14", dateStart: "2026-06-11", dateEnd: "2026-06-14", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-06-06", image: "🎨", color: "#FF4500", desc: "한국 전통 민화 및 현대 민화 박람회입니다. 작가 작품 전시, 민화 워크숍, 전통공예 체험이 제공됩니다.", visitors: "1만", rating: 4.5 },
  { id: 65, name: "제27회 제일창업박람회 in서울", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.06.17 ~ 06.20", dateStart: "2026-06-17", dateEnd: "2026-06-20", category: "창업", free: true, price: "무료(사전등록)", regDeadline: "2026-06-12", image: "🚀", color: "#FFD700", desc: "창업 정보 및 가맹점 모집 박람회입니다. 다양한 업종의 가맹점 모집정보, 창업 자금 지원, 사업 컨설팅이 제공됩니다.", visitors: "3만", rating: 4.6 },
  { id: 66, name: "2026 미트엑스포", venue: "세텍", hall: "제3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.06.18 ~ 06.20", dateStart: "2026-06-18", dateEnd: "2026-06-20", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-06-13", image: "🥩", color: "#8B0000", desc: "육류 및 육가공 산업 박람회입니다. 한우, 돈육, 닭고기, 육가공품, 소시지, 베이컨 등 축산물이 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 67, name: "2026 중앙 재테크 박람회", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.06.26 ~ 06.27", dateStart: "2026-06-26", dateEnd: "2026-06-27", category: "재테크·금융", free: true, price: "무료(사전등록)", regDeadline: "2026-06-21", image: "💰", color: "#FFD700", desc: "재테크 및 금융상품 정보 박람회입니다. 주식, 펀드, 부동산, 보험, 암호화폐 등 다양한 재테크 상품 정보를 얻을 수 있습니다.", visitors: "2만", rating: 4.4 },
  { id: 68, name: "2026 국제아웃도어캠핑&레포츠페스티벌 서울", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.07.10 ~ 07.12", dateStart: "2026-07-10", dateEnd: "2026-07-12", category: "캠핑·아웃도어", free: true, price: "무료(사전등록)", regDeadline: "2026-07-05", image: "🏕️", color: "#228B22", desc: "아웃도어 및 캠핑 전문 박람회입니다. 텐트, 캐빈, 카라반, 캠핑용품, 낚시장비, 등산용품이 전시됩니다.", visitors: "3만", rating: 4.6 },
  { id: 69, name: "제5회 DV World Seoul 2026", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.07.18 ~ 07.19", dateStart: "2026-07-18", dateEnd: "2026-07-19", category: "IT·전자", free: false, price: "10,000원~15,000원", regDeadline: "2026-07-13", image: "🎥", color: "#1C1C1C", desc: "영상 및 드론 기술 박람회입니다. DSLR, 미러리스, 드론, 짐벌, 렌즈, 영상제작 소프트웨어가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 70, name: "2026 코리아렙타일쇼", venue: "세텍", hall: "제3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.07.18 ~ 07.19", dateStart: "2026-07-18", dateEnd: "2026-07-19", category: "반려동물", free: false, price: "10,000원~15,000원", regDeadline: "2026-07-13", image: "🦎", color: "#8FBC8F", desc: "파충류 전문 박람회입니다. 뱀, 도마뱀, 거북이, 이구아나 등 파충류 종과 사육용품, 먹이, 케이지가 전시됩니다.", visitors: "1만", rating: 4.4 },
  { id: 71, name: "제2회 대한민국 대표 중소기업 박람회", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.07.22 ~ 07.24", dateStart: "2026-07-22", dateEnd: "2026-07-24", category: "산업·제조", free: true, price: "무료(사전등록)", regDeadline: "2026-07-17", image: "🏢", color: "#696969", desc: "우수 중소기업 홍보 박람회입니다. 제조업, 서비스업, IT기업 등 다양한 중소기업의 제품과 기술이 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 72, name: "2026 가낳지모 캣페어 SUMMER", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.07.31 ~ 08.02", dateStart: "2026-07-31", dateEnd: "2026-08-02", category: "반려동물", free: false, price: "10,000원~15,000원", regDeadline: "2026-07-26", image: "🐱", color: "#FF69B4", desc: "고양이 애호가 페스티벌입니다. 고양이 품종 전시, 고양이 용품, 사료, 의류, 액세서리, 고양이 관련 굿즈가 전시됩니다.", visitors: "2만", rating: 4.6 },
  { id: 73, name: "2026 서울 카페&베이커리페어 시즌2", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.08.27 ~ 08.30", dateStart: "2026-08-27", dateEnd: "2026-08-30", category: "식음료", free: true, price: "무료(사전등록)", regDeadline: "2026-08-22", image: "☕", color: "#D2B48C", desc: "카페 운영 및 베이킹 전문 박람회입니다. 커피머신, 원두, 베이킹 재료, 카페 시스템, 디저트 용품이 전시됩니다.", visitors: "3만", rating: 4.6 },
  { id: 74, name: "코사운드 스테이지테크 2026", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.09.02 ~ 09.04", dateStart: "2026-09-02", dateEnd: "2026-09-04", category: "IT·전자", free: true, price: "무료(사전등록)", regDeadline: "2026-08-28", image: "🎵", color: "#FFD700", desc: "음향 및 무대 기술 박람회입니다. 스피커, 마이크, 조명, 무대음향, 라이브 스트리밍 기술이 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 75, name: "2026 코리아 이커머스 페어", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.09.17 ~ 09.19", dateStart: "2026-09-17", dateEnd: "2026-09-19", category: "IT·전자", free: true, price: "무료(사전등록)", regDeadline: "2026-09-12", image: "🛒", color: "#1E90FF", desc: "전자상거래 솔루션 박람회입니다. 쇼핑몰 시스템, 결제솔루션, 배송관리, 고객관리 소프트웨어가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 76, name: "2026 코리아 러닝 엑스포", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.10.29 ~ 10.31", dateStart: "2026-10-29", dateEnd: "2026-10-31", category: "스포츠·레저", free: true, price: "무료(사전등록)", regDeadline: "2026-10-24", image: "🏃", color: "#FF6347", desc: "마라톤 및 러닝 전문 박람회입니다. 러닝화, 스포츠 의류, GPS워치, 보조용품, 러닝 이벤트 정보가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 77, name: "2026 서울건축박람회 추계", venue: "세텍", hall: "제1·2·3전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.11.05 ~ 11.08", dateStart: "2026-11-05", dateEnd: "2026-11-08", category: "건축", free: false, price: "10,000원~15,000원", regDeadline: "2026-10-31", image: "🏗️", color: "#696969", desc: "건축 산업의 가을 박람회입니다. 건설기계, 건축자재, 인테리어, 신기술, 안전용품 등이 전시됩니다.", visitors: "3만", rating: 4.6 },
  { id: 78, name: "2027 대한민국 재테크박람회", venue: "세텍", hall: "제1·2전시실", location: "서울 강남구 대치동", country: "KR", flag: "🇰🇷", date: "2026.11.27 ~ 11.28", dateStart: "2026-11-27", dateEnd: "2026-11-28", category: "재테크·금융", free: true, price: "무료(사전등록)", regDeadline: "2026-11-22", image: "📈", color: "#FFD700", desc: "개인재무 및 투자 정보 박람회입니다. 펀드, 주식, 적금, 보험, 부동산 투자, 재테크 강좌가 제공됩니다.", visitors: "2만", rating: 4.5 },
  { id: 79, name: "2026 소상공인 힘보탬 박람회", venue: "DDP", hall: "알림1·2관", location: "서울 중구 을지로", country: "KR", flag: "🇰🇷", date: "2026.03.26 ~ 03.27", dateStart: "2026-03-26", dateEnd: "2026-03-27", category: "창업", free: true, price: "무료(사전등록)", regDeadline: "2026-03-21", image: "🤝", color: "#FFD700", desc: "소상공인 지원 및 가맹점 정보 박람회입니다. 창업 정보, 금융 지원, 사업 컨설팅, 마케팅 전략이 제공됩니다.", visitors: "1만", rating: 4.3 },
  { id: 80, name: "PSID 2026 국제섬유패션 전시회", venue: "DDP", hall: "알림1·2관", location: "서울 중구 을지로", country: "KR", flag: "🇰🇷", date: "2026.04.01 ~ 04.03", dateStart: "2026-04-01", dateEnd: "2026-04-03", category: "패션", free: true, price: "무료(사전등록)", regDeadline: "2026-03-27", image: "👗", color: "#FF1493", desc: "섬유 및 패션 산업 박람회입니다. 원단, 패션소재, 의류 기계, 패턴 기술, 옷감 트렌드가 전시됩니다.", visitors: "2만", rating: 4.5 },
  { id: 81, name: "OFF COURSE CLUB", venue: "DDP", hall: "알림1관", location: "서울 중구 을지로", country: "KR", flag: "🇰🇷", date: "2026.04.03 ~ 04.26", dateStart: "2026-04-03", dateEnd: "2026-04-26", category: "문화·엔터", free: false, price: "10,000원~15,000원", regDeadline: "2026-03-29", image: "🎪", color: "#FF69B4", desc: "팝업 전시 및 문화이벤트 공간입니다. 예술작품, 공예품, 라이브 공연, 팝업숍이 정기적으로 운영됩니다.", visitors: "2만", rating: 4.5 },
  { id: 82, name: "키크니 특별전 : 그렸고 그런 사이", venue: "DDP", hall: "뮤지엄", location: "서울 중구 을지로", country: "KR", flag: "🇰🇷", date: "2026.04.25 ~ 09.06", dateStart: "2026-04-25", dateEnd: "2026-09-06", category: "아트", free: false, price: "10,000원~15,000원", regDeadline: "2026-04-20", image: "🖼️", color: "#9370DB", desc: "현대미술 특별전시입니다. 한국 현대미술 작가의 작품 전시, 설치미술, 미디어아트, 아트워크숍이 제공됩니다.", visitors: "2만", rating: 4.7 }
];

/* ─── Google Sheets에서 데이터 로드하는 커스텀 Hook ─── */
function useExhibitionData() {
  const [exhibitions, setExhibitions] = useState(EXHIBITIONS_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState("local");

  useEffect(() => {
    let cancelled = false;
    fetch(SHEET_API_URL)
      .then(res => res.json())
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const transformed = transformSheetData(data);
          setExhibitions(transformed);
          setDataSource("sheets");
        }
      })
      .catch(() => { /* fallback 데이터 유지 */ })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { exhibitions, isLoading, dataSource };
}

/* ─── localStorage 유틸리티 ─── */
const LS = {
  get: (k, d = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

/* ─── 서버 API 호출 유틸리티 ─── */
async function apiPost(action, body) {
  try {
    const res = await fetch(SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action, ...body }),
    });
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return { ok: false, msg: "서버 연결에 실패했습니다." };
  }
}

/* ─── 인증 & 사용자 데이터 관리 Hook (Google Sheets 서버 동기화) ─── */
function useAuth() {
  const [user, setUser] = useState(() => LS.get("expokr_user"));
  const [liked, setLikedState] = useState(() => LS.get("expokr_liked", {}));
  const [regs, setRegsState] = useState(() => LS.get("expokr_regs", []));
  const [visited, setVisitedState] = useState(() => LS.get("expokr_visited", []));
  const [syncing, setSyncing] = useState(false);

  const setLiked = (v) => { setLikedState(v); LS.set("expokr_liked", v); };
  const setRegs = (v) => { setRegsState(v); LS.set("expokr_regs", v); };
  const setVisited = (fn) => { setVisitedState(p => { const n = typeof fn === "function" ? fn(p) : fn; LS.set("expokr_visited", n); return n; }); };

  /* ── 서버 liked 맵 정규화 (숫자+문자열 키 모두 매칭되도록) ── */
  const normalizeLikes = (likeMap) => {
    const out = {};
    Object.keys(likeMap || {}).forEach(k => { out[k] = true; out[Number(k)] = true; });
    return out;
  };

  /* ── 서버에서 데이터 동기화 ── */
  const syncFromServer = async (userId) => {
    try {
      const res = await apiPost("syncData", { userId });
      if (res.ok) {
        if (res.likes) { const nl = normalizeLikes(res.likes); setLiked(nl); LS.set(`expokr_liked_${userId}`, nl); }
        if (res.tickets) { setRegs(res.tickets); LS.set(`expokr_regs_${userId}`, res.tickets); }
      }
    } catch (e) { console.error("Sync error:", e); }
  };

  /* ── 앱 로드 시 자동 동기화 ── */
  useEffect(() => {
    if (user && user.id) { syncFromServer(user.id); }
  }, []);

  /* ── 회원가입 (서버 → localStorage 캐시) ── */
  const signup = async (info) => {
    setSyncing(true);
    const res = await apiPost("signup", {
      email: info.email, password: info.password, name: info.name,
      company: info.company || "", jobTitle: info.jobTitle || "", phone: info.phone || "",
    });
    setSyncing(false);
    if (!res.ok) return res;
    const newUser = res.user;
    LS.set("expokr_user", newUser);
    setUser(newUser);
    setLiked({});
    setRegs([]);
    return { ok: true };
  };

  /* ── 로그인 (서버 → localStorage 캐시) ── */
  const login = async (email, pw) => {
    setSyncing(true);
    const res = await apiPost("login", { email, password: pw });
    setSyncing(false);
    if (!res.ok) return res;
    const loggedUser = res.user;
    LS.set("expokr_user", loggedUser);
    setUser(loggedUser);
    if (res.likes) { const nl = normalizeLikes(res.likes); setLiked(nl); LS.set(`expokr_liked_${loggedUser.id}`, nl); }
    if (res.tickets) { setRegs(res.tickets); LS.set(`expokr_regs_${loggedUser.id}`, res.tickets); }
    return { ok: true };
  };

  const logout = () => { LS.del("expokr_user"); setUser(null); setLiked({}); setRegs([]); };

  /* ── 프로필 수정 (서버 + localStorage) ── */
  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    LS.set("expokr_user", updated);
    setUser(updated);
    await apiPost("updateProfile", { userId: user.id, ...updates });
  };

  /* ── 즐겨찾기 토글 (즉시 UI 반영 + 서버 비동기) ── */
  const toggleLike = async (expoId) => {
    if (!user) return;
    const newLiked = { ...liked };
    if (newLiked[expoId]) { delete newLiked[expoId]; } else { newLiked[expoId] = true; }
    setLiked(newLiked);
    LS.set(`expokr_liked_${user.id}`, newLiked);
    apiPost("toggleLike", { userId: user.id, expoId: String(expoId) });
  };

  /* ── 사전등록 신청 (서버 → QR코드 발급) ── */
  const addReg = async (expoId, visitDate, persons = 1) => {
    if (!user) return;
    const tempReg = { expoId: String(expoId), visitDate, status: "pending", appliedAt: new Date().toISOString(), persons };
    const prevRegs = [...regs];
    setRegs([...regs.filter(r => String(r.expoId) !== String(expoId)), tempReg]);
    const res = await apiPost("addReg", { userId: user.id, expoId: String(expoId), visitDate, persons });
    if (res.ok && res.ticket) {
      const newRegs = [...prevRegs.filter(r => String(r.expoId) !== String(expoId)), res.ticket];
      setRegs(newRegs);
      LS.set(`expokr_regs_${user.id}`, newRegs);
    }
  };

  /* ── 사전등록 취소 (서버 + localStorage) ── */
  const cancelReg = async (expoId) => {
    if (!user) return;
    setRegs(regs.filter(r => String(r.expoId) !== String(expoId)));
    apiPost("cancelReg", { userId: user.id, expoId: String(expoId) });
  };

  const markVisited = (expoId) => { setVisited(p => [...new Set([...p, expoId])]); };

  return { user, liked, regs, visited, syncing, signup, login, logout, updateProfile, addReg, cancelReg, toggleLike, markVisited };
}

/* ─── 전시장별 실제 주차장 데이터 ─── */
const PARKING_DATA = {
  "코엑스": {
    name: "코엑스 주차장", floors: "지하 B1~B3", total: 2800,
    rates: [
      { label:"기본 (15분)", price:"1,500원", icon:"🕐" },
      { label:"1시간", price:"6,000원", icon:"⏱️" },
      { label:"1일 최대", price:"60,000원", icon:"📅" },
      { label:"무료출차", price:"20분 이내", icon:"🆓" },
    ],
    hours: "06:00 ~ 24:00", nightNote: "야간(24:00~06:00) 출차 불가",
    gates: [
      { name:"정문 입구 (A게이트)", dir:"강남대로 방면", type:"in" },
      { name:"후문 입구 (B게이트)", dir:"영동대로 방면", type:"in" },
      { name:"정문 출구 (A게이트)", dir:"강남대로 방면", type:"out" },
      { name:"후문 출구 (B게이트)", dir:"영동대로 방면", type:"out" },
    ],
    discounts: [
      { tip:"코엑스몰 5만원 이상 구매", discount:"1시간 무료", icon:"🛍️" },
      { tip:"코엑스몰 10만원 이상 구매", discount:"2시간 무료", icon:"💰" },
      { tip:"현대백화점 앱 설치", discount:"2시간 무료", icon:"📱" },
      { tip:"카카오T 주차 이용", discount:"20% 할인", icon:"🚗" },
    ],
    ev: [
      { loc:"지하 B2 A구역", type:"급속 (100kW)", count:4, avail:2, brand:"한국전력" },
      { loc:"지하 B2 C구역", type:"급속 (50kW)", count:6, avail:4, brand:"환경부" },
      { loc:"지하 B3 입구측", type:"완속 (7kW)", count:10, avail:7, brand:"차지비" },
    ],
  },
  "킨텍스": {
    name: "킨텍스 주차장", floors: "옥외 + 지하 주차장", total: 4200,
    rates: [
      { label:"기본 (30분)", price:"1,500원", icon:"🕐" },
      { label:"1시간", price:"3,000원", icon:"⏱️" },
      { label:"1일 최대", price:"15,000원", icon:"📅" },
      { label:"사전정산", price:"1시간 무료", icon:"🆓" },
    ],
    hours: "07:00 ~ 22:00", nightNote: "야간 주차 별도 요금",
    gates: [
      { name:"제1전시장 입구 (서문)", dir:"킨텍스로 방면", type:"in" },
      { name:"제2전시장 입구 (동문)", dir:"호수로 방면", type:"in" },
      { name:"제1전시장 출구 (서문)", dir:"킨텍스로 방면", type:"out" },
      { name:"제2전시장 출구 (동문)", dir:"호수로 방면", type:"out" },
    ],
    discounts: [
      { tip:"전시회 사전등록", discount:"최대 3시간 무료", icon:"🎫" },
      { tip:"고양시민 (차량등록)", discount:"30% 할인", icon:"🏠" },
      { tip:"경차·저공해 차량", discount:"50% 할인", icon:"🌿" },
      { tip:"임시주차장(T2~T4)", discount:"1일 상한 6,500원", icon:"🅿️" },
    ],
    ev: [
      { loc:"제1전시장 P2 구역", type:"급속 (100kW)", count:6, avail:3, brand:"한국전력" },
      { loc:"제2전시장 P4 구역", type:"급속 (50kW)", count:8, avail:5, brand:"환경부" },
      { loc:"옥외 임시주차장", type:"완속 (7kW)", count:12, avail:9, brand:"차지비" },
    ],
  },
  "세텍": {
    name: "세텍(SETEC) 주차장", floors: "옥외 주차장", total: 480,
    rates: [
      { label:"기본 (30분)", price:"1,800원", icon:"🕐" },
      { label:"추가 5분당", price:"300원", icon:"⏱️" },
      { label:"1시간", price:"4,800원", icon:"📅" },
      { label:"무료출차", price:"20분 이내", icon:"🆓" },
    ],
    hours: "08:00 ~ 22:00", nightNote: "야간 주차 불가",
    gates: [
      { name:"정문 입구", dir:"남부순환로 방면", type:"in" },
      { name:"후문 입구", dir:"대치역 방면", type:"in" },
      { name:"정문 출구", dir:"남부순환로 방면", type:"out" },
    ],
    discounts: [
      { tip:"전시회 입장권 제시", discount:"2시간 무료", icon:"🎫" },
      { tip:"국가유공자·장애인", discount:"80% 할인", icon:"♿" },
      { tip:"경차·다둥이카드", discount:"50% 할인", icon:"🚗" },
    ],
    ev: [
      { loc:"주차장 입구측", type:"급속 (50kW)", count:2, avail:1, brand:"환경부" },
      { loc:"후문 주차구역", type:"완속 (7kW)", count:4, avail:3, brand:"차지비" },
    ],
  },
  "DDP": {
    name: "DDP 공영주차장", floors: "지하 B1~B4", total: 680,
    rates: [
      { label:"기본 (5분)", price:"400원", icon:"🕐" },
      { label:"1시간", price:"4,800원", icon:"⏱️" },
      { label:"1일 최대", price:"30,000원", icon:"📅" },
      { label:"운영시간", price:"24시간", icon:"🔄" },
    ],
    hours: "24시간 운영", nightNote: "",
    gates: [
      { name:"주출입구", dir:"을지로 방면", type:"in" },
      { name:"부출입구", dir:"장충단로 방면", type:"in" },
      { name:"주출구", dir:"을지로 방면", type:"out" },
    ],
    discounts: [
      { tip:"DDP 전시 관람 영수증", discount:"1시간 무료", icon:"🎫" },
      { tip:"동대문 상가 영수증", discount:"최대 2시간 무료", icon:"🛍️" },
      { tip:"경차·저공해 차량", discount:"50% 할인", icon:"🌿" },
    ],
    ev: [
      { loc:"지하 B2 중앙구역", type:"급속 (50kW)", count:4, avail:2, brand:"환경부" },
      { loc:"지하 B3 입구측", type:"완속 (7kW)", count:6, avail:4, brand:"차지비" },
    ],
  },
};

const CATEGORIES = ["전체","디자인","패션","건축","과학","육아","IT·전자","산업·제조","물류","반려동물","창업","뷰티·화장품","식음료","아트","스포츠·레저","의료·바이오","환경·에너지","캠핑·아웃도어","가구·인테리어","교육","문화·엔터","재테크·금융","농수산"];
const VENUES = ["전체","코엑스","킨텍스","세텍","DDP"];

/* ─── 동적 D-day 계산 (실시간) ─── */
function getDday(dateEnd) {
  const now = new Date();
  now.setHours(0,0,0,0);
  const end = new Date(dateEnd);
  end.setHours(0,0,0,0);
  const diff = Math.ceil((end - now) / (1000*60*60*24));
  if (diff < 0) return { label:`종료`, days:diff, type:"past" };
  if (diff === 0) return { label:"D-DAY", days:0, type:"today" };
  return { label:`D-${diff}`, days:diff, type:"upcoming" };
}

/* ─── 전시 상태 분류 (진행중/예정/종료) ─── */
function classifyStatus(dateStart, dateEnd) {
  const now = new Date();
  now.setHours(0,0,0,0);
  const start = new Date(dateStart);
  start.setHours(0,0,0,0);
  const end = new Date(dateEnd);
  end.setHours(0,0,0,0);
  if (now > end) return "past";
  if (now >= start && now <= end) return "ongoing";
  return "upcoming";
}

/* ─── 사전등록 마감 긴급도 계산 ─── */
function getRegUrgency(regDeadline) {
  if (!regDeadline) return null;
  const now = new Date();
  now.setHours(0,0,0,0);
  const deadline = new Date(regDeadline);
  deadline.setHours(0,0,0,0);
  const diff = Math.ceil((deadline - now) / (1000*60*60*24));
  if (diff < 0) return { label:"마감완료", urgent:false, color:"#9ca3af" };
  if (diff === 0) return { label:"오늘 마감!", urgent:true, color:"#dc2626" };
  if (diff <= 3) return { label:`마감 ${diff}일전`, urgent:true, color:"#dc2626" };
  if (diff <= 7) return { label:`마감 ${diff}일전`, urgent:false, color:"#d97706" };
  return { label:`마감 D-${diff}`, urgent:false, color:"#6b7280" };
}

/* ─── 사전등록 신청 가능 여부 판별 ─── */
function getRegAvailability(ex) {
  const now = new Date(); now.setHours(0,0,0,0);
  const start = new Date(ex.dateStart); start.setHours(0,0,0,0);
  const end = new Date(ex.dateEnd); end.setHours(0,0,0,0);
  // 종료된 전시
  if (now > end) return { status:"종료", label:"종료", color:"#9ca3af", bg:"rgba(156,163,175,.12)", icon:"⚫", available:false };
  // 마감일 정보가 있는 경우
  if (ex.regDeadline) {
    const deadline = new Date(ex.regDeadline); deadline.setHours(0,0,0,0);
    const daysLeft = Math.ceil((deadline - now) / (1000*60*60*24));
    if (daysLeft < 0) return { status:"마감", label:"신청마감", color:"#ef4444", bg:"rgba(239,68,68,.1)", icon:"🔴", available:false };
    if (daysLeft === 0) return { status:"오늘마감", label:"오늘 마감!", color:"#ef4444", bg:"rgba(239,68,68,.15)", icon:"🔥", available:true, urgent:true, daysLeft:0 };
    if (daysLeft <= 3) return { status:"신청가능", label:`신청가능 D-${daysLeft}`, color:"#f59e0b", bg:"rgba(245,158,11,.12)", icon:"⚠️", available:true, urgent:true, daysLeft };
    if (daysLeft <= 7) return { status:"신청가능", label:`신청가능 D-${daysLeft}`, color:"#22c55e", bg:"rgba(34,197,94,.1)", icon:"🟢", available:true, urgent:false, daysLeft };
    return { status:"신청가능", label:`신청가능 D-${daysLeft}`, color:"#22c55e", bg:"rgba(34,197,94,.08)", icon:"🟢", available:true, urgent:false, daysLeft };
  }
  // 마감일 없지만 regUrl이 있으면 → 개막 전날까지 추정
  if (ex.regUrl) {
    const estDeadline = new Date(start.getTime() - 86400000);
    const daysLeft = Math.ceil((estDeadline - now) / (1000*60*60*24));
    if (daysLeft < 0) return { status:"마감추정", label:"마감추정", color:"#f59e0b", bg:"rgba(245,158,11,.1)", icon:"🟡", available:false };
    return { status:"신청가능", label:`신청가능(추정) D-${daysLeft}`, color:"#22c55e", bg:"rgba(34,197,94,.08)", icon:"🟢", available:true, urgent:daysLeft<=3, daysLeft };
  }
  // 정보 없음
  return { status:"확인중", label:"확인중", color:"#f59e0b", bg:"rgba(245,158,11,.08)", icon:"🟡", available:false };
}

function QRCode({ size = 200 }) {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,1,0,1,1,0,1,0,1,1,0,1,0],
    [0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0,1,0],
  ];
  const cell = size / 19;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {pattern.map((row, r) => row.map((v, c) => v ? (
        <rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell-.8} height={cell-.8} rx={2} fill={P.accent}/>
      ) : null))}
    </svg>
  );
}

/* ─── 전시회 소개 URL 생성 ─── */
function getExpoUrl(ex) {
  if (ex.regUrl) return ex.regUrl;
  const q = encodeURIComponent(`${ex.name} ${ex.venue} 사전등록`);
  return `https://www.google.com/search?q=${q}`;
}

/* ─── Stars ─── */
function Stars({ rating, size = 12, onCard = false }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const filledColor = onCard ? "#fff" : "#f59e0b";
  const emptyColor = onCard ? "rgba(255,255,255,.3)" : "#d1d5db";
  return (
    <span style={{ display:"inline-flex", gap:1, alignItems:"center" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < full ? filledColor : i === full && half ? filledColor : emptyColor, fontSize: size, textShadow: onCard ? "0 1px 3px rgba(0,0,0,.3)" : "none" }}>★</span>
      ))}
      <span style={{ fontSize: size - 1, color: onCard ? "rgba(255,255,255,.8)" : P.sub, fontWeight: 700, marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

/* ─── Carousel (3D 회전 캐러셀) ─── */
/* Apple Music 스타일 캐러셀 — 디졸브 효과: 현재>우2>우3 흐려짐, 좌측=마지막카드 */
function Carousel({ children, groupKey }) {
  const items = Array.isArray(children) ? children : [children];
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState({ active:false, x0:0, dx:0 });

  useEffect(() => { setIdx(0); }, [groupKey]);

  const go = (dir) => setIdx(p => {
    const n = p + dir;
    return n < 0 ? total - 1 : n >= total ? 0 : n;  // 무한루프
  });
  const onStart = (cx) => setDrag({ active:true, x0:cx, dx:0 });
  const onMove = (cx) => { if (drag.active) setDrag(d => ({ ...d, dx: cx - d.x0 })); };
  const onEnd = () => {
    if (Math.abs(drag.dx) > 40) go(drag.dx < 0 ? 1 : -1);
    setDrag({ active:false, x0:0, dx:0 });
  };

  // 카드 순서: [왼쪽(마지막)] [현재] [우2] [우3] ...
  const getOrder = (i) => {
    let diff = i - idx;
    if (diff < -1) diff += total;           // 왼쪽은 마지막 카드 1장만
    if (diff > total - 1) diff -= total;
    return diff;
  };

  const arrowBtn = (dir) => ({
    position:"absolute", top:"50%", transform:"translateY(-50%)",
    [dir === -1 ? "left" : "right"]: -2,
    width:36, height:36, borderRadius:18,
    background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
    border:"1px solid rgba(0,0,0,0.06)",
    boxShadow:"0 2px 12px rgba(0,0,0,0.10)",
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", zIndex:20, fontSize:15, color:"#374151",
    transition:"all .2s",
  });

  return (
    <div style={{ position:"relative" }}>
      {total > 1 && (
        <button onClick={() => go(-1)} style={arrowBtn(-1)} className="car-arrow">‹</button>
      )}
      {total > 1 && (
        <button onClick={() => go(1)} style={arrowBtn(1)} className="car-arrow">›</button>
      )}
      <div className="am-wrap"
        onTouchStart={e => onStart(e.touches[0].clientX)}
        onTouchMove={e => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={e => { e.preventDefault(); onStart(e.clientX); }}
        onMouseMove={e => { if (drag.active) onMove(e.clientX); }}
        onMouseUp={onEnd} onMouseLeave={() => { if (drag.active) onEnd(); }}
      >
        {items.map((child, i) => {
          const order = getOrder(i);
          // 위치: 현재=0, 우측=1,2,3..., 좌측=-1(마지막)
          const CARD_W = 300;
          const GAP = 16;
          const dragPx = drag.active ? drag.dx * 0.4 : 0;
          let tx, scale, opacity, blur, z;
          if (order === 0) {         // 현재 카드
            tx = 0 + dragPx; scale = 1; opacity = 1; blur = 0; z = 10;
          } else if (order === -1) { // 왼쪽 (마지막 카드) — 겹치지 않고 왼쪽 바깥
            tx = -(CARD_W + GAP) + dragPx; scale = 0.92; opacity = 0.35; blur = 4; z = 1;
          } else if (order === 1) {  // 우측 2번째 — 겹치지 않고 오른쪽 바깥
            tx = (CARD_W + GAP) + dragPx; scale = 0.92; opacity = 0.35; blur = 3; z = 5;
          } else if (order === 2) {  // 우측 3번째
            tx = (CARD_W + GAP) * 2 + dragPx; scale = 0.88; opacity = 0.15; blur = 6; z = 2;
          } else {                   // 나머지 숨김
            tx = (CARD_W + GAP) * 3; scale = 0.85; opacity = 0; blur = 0; z = 0;
          }
          return (
            <div key={i} className="am-card" style={{
              transform: `translateX(${tx}px) scale(${scale})`,
              opacity, filter: blur > 0 ? `blur(${blur}px)` : "none",
              zIndex: z, pointerEvents: order === 0 ? "auto" : "none",
              transition: drag.active ? "none" : "all .45s cubic-bezier(.32,.72,.24,1)",
            }}>{child}</div>
          );
        })}
      </div>
      {total > 1 && (
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:5, marginTop:6, marginBottom:18 }}>
          {total <= 7 ? items.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 18 : 6, height:6, borderRadius:3,
              background: i === idx ? P.accent : "rgba(0,0,0,.12)",
              transition:"all .3s", cursor:"pointer"
            }} onClick={() => setIdx(i)} />
          )) : (() => {
            const base = Math.max(0, Math.min(total - 5, idx - 2));
            return <>
              {Array.from({length:5}, (_, j) => {
                const pos = base + j;
                const dist = Math.abs(pos - idx);
                return <div key={pos} style={{
                  width: dist === 0 ? 18 : dist === 1 ? 6 : 4,
                  height: dist === 0 ? 6 : dist === 1 ? 6 : 4,
                  borderRadius: 3,
                  background: pos === idx ? P.accent : "rgba(0,0,0,.12)",
                  opacity: dist === 0 ? 1 : dist === 1 ? 0.5 : 0.25,
                  transition:"all .3s", cursor:"pointer"
                }} onClick={() => setIdx(pos)} />;
              })}
              <span style={{ fontSize:10, color:"#9ca3af", fontWeight:600, marginLeft:2 }}>{idx+1}/{total}</span>
            </>;
          })()}
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const { exhibitions: EXHIBITIONS, isLoading: sheetLoading, dataSource } = useExhibitionData();
  const auth = useAuth();
  const { user, liked, regs, visited, syncing, toggleLike, addReg, cancelReg, markVisited } = auth;
  const [screen, setScreen] = useState("home");
  const [prev, setPrev] = useState(null);
  const [expo, setExpo] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailTab, setDetailTab] = useState("info");
  const [country, setCountry] = useState("ALL");
  const [cat, setCat] = useState("전체");
  const [venueFilter, setVenueFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [selDate, setSelDate] = useState("04.05");
  const [qrFull, setQrFull] = useState(false);
  const [persons, setPersons] = useState(1);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authForm, setAuthForm] = useState({ name:"", email:"", password:"", company:"", jobTitle:"", phone:"" });
  const [authError, setAuthError] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [myTab, setMyTab] = useState("regs"); // regs | liked | visited | settings

  const go = (s, e = null, list = null, listIdx = -1) => { setPrev(screen); if (e) setExpo(e); if (list) { setDetailList(list); setDetailIndex(listIdx >= 0 ? listIdx : 0); } setScreen(s); setDetailTab("info"); setStep(1); setDone(false); };
  const goDetailNav = (dir) => {
    if (!detailList.length) return;
    const newIdx = dir === -1
      ? (detailIndex <= 0 ? detailList.length - 1 : detailIndex - 1)
      : (detailIndex >= detailList.length - 1 ? 0 : detailIndex + 1);
    setDetailIndex(newIdx);
    setExpo(detailList[newIdx]);
    setDetailTab("info");
  };
  const back = () => { setScreen(prev || "home"); setModal(false); };

  const handleAuth = async () => {
    setAuthError("");
    if (authMode === "login") {
      const r = await auth.login(authForm.email, authForm.password);
      if (!r.ok) { setAuthError(r.msg); return; }
      setAuthForm({ name:"", email:"", password:"", company:"", jobTitle:"", phone:"" });
      go("my");
    } else {
      if (!authForm.name || !authForm.email || !authForm.password) { setAuthError("이름, 이메일, 비밀번호는 필수입니다."); return; }
      if (authForm.password.length < 4) { setAuthError("비밀번호는 4자 이상이어야 합니다."); return; }
      const r = await auth.signup(authForm);
      if (!r.ok) { setAuthError(r.msg); return; }
      setAuthForm({ name:"", email:"", password:"", company:"", jobTitle:"", phone:"" });
      go("my");
    }
  };

  /* ── 전시회별 등록 상태 확인 ── */
  const getRegStatus = (expoId) => {
    const reg = regs.find(r => String(r.expoId) === String(expoId));
    return reg ? reg.status : null;
  };

  /* ── 전시 분류 및 필터링 (오늘 기준 2개월 이내만) ── */
  const classified = useMemo(() => {
    const maxDate = new Date(); maxDate.setMonth(maxDate.getMonth() + 2); maxDate.setHours(23,59,59,999);
    return EXHIBITIONS.filter(e => new Date(e.dateStart) <= maxDate).map(e => ({
      ...e,
      expoStatus: classifyStatus(e.dateStart, e.dateEnd),
    }));
  }, [EXHIBITIONS]);

  const statusCounts = useMemo(() => {
    const c = { all:0, ongoing:0, upcoming:0, past:0 };
    classified.forEach(e => { c.all++; c[e.expoStatus]++; });
    return c;
  }, [classified]);

  const STATUS_ORDER = { ongoing: 0, upcoming: 1, past: 2 };
  const filtered = classified.filter(e => {
    const matchCountry = country === "ALL" || (country === "KR" ? e.country === "KR" : e.country !== "KR");
    const matchCat = cat === "전체" || e.category === cat;
    const matchVenue = venueFilter === "전체" || e.venue === venueFilter;
    const matchStatus = statusFilter === "all" || e.expoStatus === statusFilter;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase()) || e.category.includes(search);
    return matchCountry && matchCat && matchVenue && matchStatus && matchSearch;
  }).sort((a, b) => (STATUS_ORDER[a.expoStatus] ?? 9) - (STATUS_ORDER[b.expoStatus] ?? 9));

  const todayExpo = classified.find(e => e.expoStatus === "ongoing" && (getRegStatus(e.id) === "approved" || e.hasQR));
  const tabIdx = ["info","park","stay","move","eat","fun"].indexOf(detailTab);

  /* ── 전시장별 주차 데이터 가져오기 ── */
  const getParkingData = (venue) => PARKING_DATA[venue] || PARKING_DATA["코엑스"];

  return (
    <>
      <style>{css}</style>
      <div className="shell">

        {/* ══════ AUTH (로그인/회원가입) ══════ */}
        {!user && screen !== "home" && screen !== "detail" && screen !== "search" ? null : null}
        {!user && (screen === "my" || screen === "auth") && (
          <div className="scr" style={{ background: P.bg, zIndex:100 }}>
            <div className="scroll">
              <div style={{ background:"linear-gradient(165deg,#0f0f1a 0%,#1a1040 40%,#2d1b69 100%)", padding:"60px 20px 44px", textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-40, right:-30, width:160, height:160, borderRadius:80, background:"radial-gradient(circle,rgba(99,102,241,.25),transparent 70%)" }} />
                <div style={{ fontSize:40, marginBottom:12 }}>{authMode === "login" ? "👋" : "🎉"}</div>
                <div style={{ color:"#fff", fontSize:24, fontWeight:900, background:"linear-gradient(135deg,#fff,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  {authMode === "login" ? "로그인" : "회원가입"}
                </div>
                <div style={{ color:"rgba(255,255,255,.55)", fontSize:13, marginTop:8 }}>
                  {authMode === "login" ? "ExpoBIZ에 오신 것을 환영합니다" : "새 계정을 만들어 시작하세요"}
                </div>
              </div>
              <div style={{ padding:"24px 20px" }}>
                {authError && (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:14, padding:"12px 16px", marginBottom:16, color:"#dc2626", fontSize:13, fontWeight:600 }}>
                    {authError}
                  </div>
                )}
                {authMode === "signup" && (
                  <>
                    <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>이름 *</label>
                    <input value={authForm.name} onChange={e => setAuthForm(p=>({...p, name:e.target.value}))} placeholder="홍길동"
                      style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:14, background:"rgba(255,255,255,.7)", outline:"none" }} />
                  </>
                )}
                <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>이메일 *</label>
                <input value={authForm.email} onChange={e => setAuthForm(p=>({...p, email:e.target.value}))} placeholder="email@company.com" type="email"
                  style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:14, background:"rgba(255,255,255,.7)", outline:"none" }} />
                <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>비밀번호 *</label>
                <input value={authForm.password} onChange={e => setAuthForm(p=>({...p, password:e.target.value}))} placeholder="4자 이상" type="password"
                  style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:14, background:"rgba(255,255,255,.7)", outline:"none" }} />
                {authMode === "signup" && (
                  <>
                    <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>회사/소속</label>
                    <input value={authForm.company} onChange={e => setAuthForm(p=>({...p, company:e.target.value}))} placeholder="주식회사 OO"
                      style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:14, background:"rgba(255,255,255,.7)", outline:"none" }} />
                    <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>직책</label>
                    <input value={authForm.jobTitle} onChange={e => setAuthForm(p=>({...p, jobTitle:e.target.value}))} placeholder="선임 연구원"
                      style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:14, background:"rgba(255,255,255,.7)", outline:"none" }} />
                    <label style={{ fontSize:12, fontWeight:700, color:P.sub, marginBottom:4, display:"block" }}>연락처</label>
                    <input value={authForm.phone} onChange={e => setAuthForm(p=>({...p, phone:e.target.value}))} placeholder="010-0000-0000"
                      style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"1.5px solid rgba(0,0,0,.08)", fontSize:14, fontFamily:FONT, marginBottom:20, background:"rgba(255,255,255,.7)", outline:"none" }} />
                  </>
                )}
                <button className="btn-p" onClick={handleAuth} disabled={syncing} style={{ marginBottom:16, opacity: syncing ? 0.7 : 1 }}>
                  {syncing ? "처리중..." : (authMode === "login" ? "로그인" : "가입하기")}
                </button>
                <div style={{ textAlign:"center", fontSize:13, color:P.sub }}>
                  {authMode === "login" ? "아직 계정이 없으신가요? " : "이미 계정이 있으신가요? "}
                  <span onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}
                    style={{ color:P.accent, fontWeight:800, cursor:"pointer" }}>
                    {authMode === "login" ? "회원가입" : "로그인"}
                  </span>
                </div>
                {screen === "auth" && (
                  <div style={{ textAlign:"center", marginTop:16 }}>
                    <span onClick={() => go("home")} style={{ color:P.sub, fontSize:12, cursor:"pointer" }}>비회원으로 둘러보기 →</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ HOME ══════ */}
        <div className={`scr ${screen !== "home" ? "off-l" : ""}`}>
          <div className="scroll" style={{ background: P.bg, paddingBottom: 90 }}>

            {/* ── header gradient ── */}
            <div style={{ background:"linear-gradient(165deg,#0f0f1a 0%,#1a1040 40%,#2d1b69 100%)", padding:"48px 20px 36px", position:"relative", overflow:"hidden" }}>
              {/* decorative circles */}
              <div style={{ position:"absolute", top:-40, right:-30, width:160, height:160, borderRadius:80, background:"radial-gradient(circle,rgba(99,102,241,.25),transparent 70%)" }} />
              <div style={{ position:"absolute", bottom:-20, left:-20, width:120, height:120, borderRadius:60, background:"radial-gradient(circle,rgba(139,92,246,.2),transparent 70%)" }} />

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, position:"relative" }}>
                <div>
                  <div style={{ color:"rgba(255,255,255,.5)", fontSize:11, fontWeight:600, letterSpacing:1 }}>EXPO PLATFORM</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:4 }}>
                    <div style={{ color:"#fff", fontSize:24, fontWeight:900, background:"linear-gradient(135deg,#fff,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ExpoBIZ</div>
                    <span style={{ color:"rgba(255,255,255,.35)", fontSize:10, fontWeight:600 }}>v1.5.4</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {/* 알림 아이콘 */}
                  <button style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span style={{ position:"absolute", top:7, right:8, width:6, height:6, borderRadius:3, background:"#ef4444" }} />
                  </button>
                  {/* 프로필 아이콘 */}
                  <button onClick={() => go("my")} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </button>
                </div>
              </div>

            </div>

            <div style={{ padding:"0 16px" }}>
              {/* ── today ticket banner ── */}
              {todayExpo && (
                <div className="fu1" onClick={() => go("qr")} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)", borderRadius:22, padding:"20px 20px", marginTop:-18, marginBottom:18, cursor:"pointer", boxShadow:"0 8px 32px rgba(99,102,241,.35)", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, right:0, width:100, height:100, background:"radial-gradient(circle,rgba(255,255,255,.12),transparent 70%)" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <span className="bdg-glass bdg" style={{ fontSize:10 }}>🎫 오늘 입장권</span>
                      </div>
                      <div style={{ color:"#fff", fontSize:17, fontWeight:900, lineHeight:1.3 }}>{todayExpo.name}</div>
                      <div style={{ color:"rgba(255,255,255,.65)", fontSize:12, marginTop:4, fontWeight:500 }}>{todayExpo.venue} {todayExpo.hall} · 10:00 ~ 18:00</div>
                    </div>
                    <div style={{ background:"rgba(255,255,255,.92)", borderRadius:14, padding:"10px 16px", color:P.accent, fontSize:13, fontWeight:800, boxShadow:"0 2px 12px rgba(0,0,0,.08)" }}>QR →</div>
                  </div>
                </div>
              )}

              {/* ── 상태 탭 + 필터 토글 (1줄) ── */}
              {(() => {
                const activeFilterCount = (venueFilter !== "전체" ? 1 : 0) + (country !== "ALL" ? 1 : 0) + (cat !== "전체" ? 1 : 0);
                return (
                  <>
                  <div className="fu2" style={{ display:"flex", alignItems:"center", gap:6, marginBottom: showFilter ? 0 : 14 }}>
                    {[
                      { key:"all", label:"ALL", icon:"", count:statusCounts.all, bg:"linear-gradient(135deg,#6366f1,#8b5cf6)", bgOff:"rgba(255,255,255,.7)" },
                      { key:"ongoing", label:"LIVE", icon:"🔴", count:statusCounts.ongoing, bg:"linear-gradient(135deg,#dc2626,#ef4444)", bgOff:"rgba(255,240,240,.85)" },
                      { key:"upcoming", label:"NEXT", icon:"🔵", count:statusCounts.upcoming, bg:"linear-gradient(135deg,#3b82f6,#6366f1)", bgOff:"rgba(238,242,255,.85)" },
                      { key:"past", label:"OFF", icon:"⚫", count:statusCounts.past, bg:"linear-gradient(135deg,#4b5563,#6b7280)", bgOff:"rgba(243,244,246,.85)" },
                    ].map(s => (
                      <button key={s.key} onClick={() => setStatusFilter(s.key)}
                        style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"9px 0", borderRadius:14, fontSize:11.5, fontWeight:800, cursor:"pointer", transition:"all .25s", border:"none", fontFamily:FONT,
                          background: statusFilter===s.key ? s.bg : s.bgOff,
                          color: statusFilter===s.key ? "#fff" : "#888",
                          boxShadow: statusFilter===s.key ? "0 2px 12px rgba(0,0,0,.12)" : "none",
                        }}>
                        {s.icon && <span style={{ fontSize:10 }}>{s.icon}</span>}
                        <span>{s.label}</span>
                        <span style={{ fontSize:9.5, opacity:.75 }}>{s.count}</span>
                      </button>
                    ))}
                    {/* 필터 토글 버튼 */}
                    <button onClick={() => setShowFilter(!showFilter)}
                      style={{ display:"flex", alignItems:"center", gap:3, padding:"9px 12px", borderRadius:14, fontSize:11.5, fontWeight:800, cursor:"pointer", transition:"all .25s", border: showFilter || activeFilterCount > 0 ? "none" : "1px solid rgba(0,0,0,.06)", fontFamily:FONT,
                        background: showFilter ? `linear-gradient(135deg,${P.accent},${P.accent2})` : activeFilterCount > 0 ? "rgba(99,102,241,.12)" : "rgba(255,255,255,.7)",
                        color: showFilter ? "#fff" : activeFilterCount > 0 ? P.accent : "#888",
                      }}>
                      <span>🎛️</span>
                      {activeFilterCount > 0 && <span style={{ background: showFilter ? "rgba(255,255,255,.3)" : P.accent, color: showFilter ? "#fff" : "#fff", borderRadius:8, padding:"1px 5px", fontSize:9, fontWeight:900, minWidth:14, textAlign:"center" }}>{activeFilterCount}</span>}
                      <span style={{ fontSize:10, transition:"transform .25s", transform: showFilter ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </button>
                  </div>

                  {/* ── 접힘 필터 영역 ── */}
                  <div style={{ overflow:"hidden", maxHeight: showFilter ? 200 : 0, opacity: showFilter ? 1 : 0, transition:"max-height .35s cubic-bezier(.32,.72,.24,1), opacity .25s, margin .25s", marginBottom: showFilter ? 14 : 0 }}>
                    <div style={{ padding:"12px 0 4px", display:"flex", flexDirection:"column", gap:10 }}>
                      {/* 전시장 */}
                      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
                        <span style={{ fontSize:10, color:P.sub, fontWeight:700, whiteSpace:"nowrap", padding:"6px 0", minWidth:32 }}>장소</span>
                        {VENUES.map(v => (
                          <div key={v} onClick={() => setVenueFilter(v)} style={{ background:venueFilter===v ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "rgba(255,255,255,.65)", color:venueFilter===v ? "#fff" : "#555", borderRadius:18, padding:"6px 12px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", cursor:"pointer", transition:"all .25s", border:venueFilter===v ? "none" : "1px solid rgba(0,0,0,.05)" }}>
                            {v === "전체" ? "전체" : v}
                          </div>
                        ))}
                      </div>
                      {/* 국내/해외 */}
                      <div style={{ display:"flex", gap:6 }}>
                        <span style={{ fontSize:10, color:P.sub, fontWeight:700, whiteSpace:"nowrap", padding:"6px 0", minWidth:32 }}>지역</span>
                        {[["ALL","전체"],["KR","🇰🇷 국내"],["GLOBAL","🌍 해외"]].map(([v,l]) => (
                          <div key={v} onClick={() => setCountry(v)} style={{ background:country===v ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "rgba(255,255,255,.65)", color:country===v ? "#fff" : "#555", borderRadius:18, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all .25s", border:country===v ? "none" : "1px solid rgba(0,0,0,.05)" }}>
                            {l}
                          </div>
                        ))}
                      </div>
                      {/* 카테고리 */}
                      <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
                        <span style={{ fontSize:10, color:P.sub, fontWeight:700, whiteSpace:"nowrap", padding:"6px 0", minWidth:32 }}>분류</span>
                        {CATEGORIES.map(c => (
                          <div key={c} onClick={() => setCat(c)} style={{ background:cat===c ? P.dark : "rgba(255,255,255,.6)", color:cat===c ? "#fff" : "#555", borderRadius:18, padding:"6px 12px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", cursor:"pointer", transition:"all .2s", border: cat===c ? "none" : "1px solid rgba(0,0,0,.04)" }}>
                            {c === "전체" ? "전체" : c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                );
              })()}

              {/* ── list header (큰 타이틀) ── */}
              <div className="fu3" style={{ marginBottom:4, padding:"0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:12 }}>
                  <div style={{ fontSize:26, fontWeight:900, color:P.text, letterSpacing:"-0.5px" }}>전시회 목록</div>
                  <div style={{ fontSize:13, color:P.sub, fontWeight:600 }}>{filtered.length}개</div>
                </div>
                {/* search (타이틀 아래 배치) */}
                <div style={{ position:"relative", marginBottom:6 }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>🔍</span>
                  <input style={{ width:"100%", background:"rgba(0,0,0,.04)", border:"1.5px solid rgba(0,0,0,.06)", borderRadius:12, padding:"10px 14px 10px 36px", fontSize:13, fontWeight:500, color:P.text, outline:"none", fontFamily:FONT, transition:"all .3s" }}
                    placeholder="전시회, 장소, 카테고리 검색..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={e => { e.target.style.background="rgba(0,0,0,.06)"; e.target.style.borderColor="rgba(0,0,0,.12)"; }}
                    onBlur={e => { e.target.style.background="rgba(0,0,0,.04)"; e.target.style.borderColor="rgba(0,0,0,.06)"; }}
                  />
                </div>
              </div>
            </div>

              {/* ── exhibition cards: 상태별 3D 회전 캐러셀 ── */}
              {(() => {
                const updatePlaceholder = { id:99999, name:"UPDATE 예정", venue:"", hall:"", date:"새로운 전시회가 곧 업데이트됩니다", dateStart:"2099-12-31", dateEnd:"2099-12-31", category:"", free:false, price:"", image:"🔄", color:"#9CA3AF", rating:0, isPlaceholder:true, expoStatus:"upcoming" };
                const upcomingItems = filtered.filter(e => e.expoStatus === "upcoming");
                const groups = [
                  { key:"ongoing", label:"LIVE", icon:"🔴", dot:"#dc2626", items: filtered.filter(e => e.expoStatus === "ongoing") },
                  { key:"upcoming", label:"NEXT", icon:"🔵", dot:"#3b82f6", items: [...upcomingItems, updatePlaceholder] },
                  { key:"past", label:"OFF", icon:"⚫", dot:"#6b7280", items: filtered.filter(e => e.expoStatus === "past") },
                ];
                const visibleGroups = groups.filter(g => g.items.length > 0);

                if (filtered.length === 0) return (
                  <div style={{ textAlign:"center", padding:"40px 16px", color:P.sub }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>검색 결과가 없습니다</div>
                  </div>
                );

                return visibleGroups.map(group => (
                  <div key={group.key} style={{ marginBottom:4 }}>
                    {/* section label */}
                    <div className="section-label">
                      <div className="section-title" style={{ color:P.text }}>{group.icon} {group.label}</div>
                      <div className="section-count">{group.items.length}개</div>
                    </div>

                    {/* 3D carousel */}
                    <Carousel groupKey={group.key + statusFilter + venueFilter + country + cat + search}>
                      {group.items.map((ex, exIdx) => {
                        const dday = getDday(ex.dateEnd);
                        const regUrg = getRegUrgency(ex.regDeadline);
                        const regAvail = getRegAvailability(ex);
                        /* 전시회 주제 톤 배경색 (그라데이션 없이) */
                        const THEME_COLORS = {
                          "반려동물": "#E8A87C", "식음료": "#A0522D", "건축": "#5B7DB1",
                          "육아": "#D4A0A0", "농수산": "#7CB342", "캠핑·아웃도어": "#4E7C46",
                          "스포츠·레저": "#3A6EA5", "가구·인테리어": "#A67C52", "산업·제조": "#607D8B",
                          "물류": "#4A7FB5", "과학": "#7E57C2", "환경·에너지": "#43A047",
                          "의료·바이오": "#C62828", "IT·전자": "#1565C0", "뷰티": "#E91E63",
                          "교육": "#FF8F00", "금융": "#37474F", "문화·예술": "#8E24AA",
                          "자동차": "#424242", "패션": "#AD1457",
                        };
                        const themeColor = THEME_COLORS[ex.category] || ex.color;
                        const grad = themeColor;
                        if (ex.isPlaceholder) return (
                          <div key={ex.id} style={{ borderRadius:20, overflow:"hidden" }}>
                            <div style={{ background:"linear-gradient(135deg,#e5e7eb,#d1d5db)", padding:"22px 20px 18px", position:"relative", minHeight:320, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
                              <div style={{ fontSize:60, marginBottom:16, opacity:.5 }}>🔄</div>
                              <div style={{ fontSize:20, fontWeight:900, color:"#6b7280", lineHeight:1.3 }}>UPDATE 예정</div>
                              <div style={{ fontSize:13, color:"#9ca3af", fontWeight:500, marginTop:8 }}>새로운 전시회가<br/>곧 업데이트됩니다</div>
                            </div>
                          </div>
                        );
                        return (
                          <div key={ex.id} style={{ cursor:"pointer", opacity: ex.expoStatus === "past" ? 0.7 : 1, borderRadius:20, overflow:"hidden" }} onClick={() => go("detail", ex, group.items, exIdx)}>
                            {/* Apple Music 스타일 큰 카드 */}
                            <div style={{ background: grad, padding:"22px 20px 18px", position:"relative", minHeight:320, boxShadow:"inset 0 0 80px rgba(0,0,0,.15)" }}>
                              {/* 장식 원 */}
                              <div style={{ position:"absolute", top:-30, right:-20, width:140, height:140, borderRadius:70, background:"radial-gradient(circle,rgba(255,255,255,.1),transparent 70%)" }} />
                              {/* 우측 상단: 좋아요 + 별점 (세로 배치) */}
                              <div style={{ position:"absolute", top:14, right:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                                <button onClick={e => { e.stopPropagation(); toggleLike(ex.id); }} style={{ background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:12, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 }}>
                                  {liked[ex.id] ? "❤️" : "🤍"}
                                </button>
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
                                  <Stars rating={ex.rating} size={8} onCard />
                                </div>
                              </div>
                              {/* D-day 뱃지 */}
                              <span className="bdg" style={{ background: dday.type === "today" ? "#ef4444" : dday.type === "upcoming" ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.12)", color:"#fff", fontSize:10, fontWeight:800, backdropFilter:"blur(4px)" }}>{dday.label}</span>
                              {/* 이모지 아이콘 */}
                              <div style={{ margin:"14px 0 10px" }}>
                                <div style={{ fontSize:52, filter:"drop-shadow(0 4px 12px rgba(0,0,0,.3))" }}>{ex.image}</div>
                              </div>
                              {/* 전시회 이름 (큰 글씨) */}
                              <div style={{ fontSize:20, fontWeight:900, color:"#fff", lineHeight:1.25, marginBottom:8, textShadow:"0 2px 8px rgba(0,0,0,.3)" }}>{ex.name}</div>
                              {/* 하단 정보 */}
                              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                                <span className="bdg" style={{ background:"rgba(255,255,255,.15)", color:"#fff", backdropFilter:"blur(4px)", fontSize:10 }}>{ex.free ? "무료" : ex.price}</span>
                                <span className="bdg" style={{ background:"rgba(255,255,255,.15)", color:"#fff", backdropFilter:"blur(4px)", fontSize:10 }}>📍 {ex.venue}</span>
                                {getRegStatus(ex.id) === "approved" && <span className="bdg" style={{ background:"rgba(255,255,255,.2)", color:"#fff", fontSize:10 }}>🎫 입장권</span>}
                                {getRegStatus(ex.id) === "pending" && <span className="bdg" style={{ background:"rgba(255,255,255,.15)", color:"#fff", fontSize:10 }}>⏳ 승인대기</span>}
                              </div>
                              <div style={{ color:"rgba(255,255,255,.7)", fontSize:12, fontWeight:500 }}>
                                {ex.venue} {ex.hall} · {ex.date}
                              </div>
                              {/* 신청 가능 여부 배지 */}
                              <div style={{ marginTop:8 }}>
                                <span className="bdg" style={{
                                  background: regAvail.available
                                    ? (regAvail.urgent ? "rgba(239,68,68,.35)" : "rgba(34,197,94,.3)")
                                    : (regAvail.status === "마감" || regAvail.status === "마감추정" ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.12)"),
                                  color:"#fff", fontSize:10, fontWeight:800,
                                  border: regAvail.urgent ? "1px solid rgba(239,68,68,.5)" : regAvail.available ? "1px solid rgba(34,197,94,.4)" : "none",
                                  animation: regAvail.urgent ? "urgentPulse 1.5s infinite" : "none"
                                }}>
                                  {regAvail.icon} {regAvail.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Carousel>
                  </div>
                ));
              })()}
              <div style={{ height:10 }} />
          </div>
          <BNav active="home" onNav={t => { if(t==="qr") go("qr"); else if(t==="my") go("my"); else if(t==="plan") go("plan"); }} />
        </div>

        {/* ══════ DETAIL ══════ */}
        <div className={`scr ${screen !== "detail" ? "off-r" : ""}`}>
          {expo && (
            <>
              <div className="scroll" style={{ background:P.bg, paddingBottom:100 }}>
                {/* hero */}
                <div style={{ background:`linear-gradient(165deg, ${expo.color}dd, ${expo.color}88, ${expo.color}44)`, padding:"52px 20px 28px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:70, background:`radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)` }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                    <button onClick={back} style={{ background:"rgba(255,255,255,.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:14, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONT }}>← 뒤로</button>
                    {detailList.length > 1 && (
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <button onClick={() => goDetailNav(-1)} className="detail-nav-btn" style={{ background:"rgba(255,255,255,.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:12, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>‹</button>
                        <span style={{ color:"rgba(255,255,255,.7)", fontSize:12, fontWeight:600, minWidth:40, textAlign:"center" }}>{detailIndex + 1} / {detailList.length}</span>
                        <button onClick={() => goDetailNav(1)} className="detail-nav-btn" style={{ background:"rgba(255,255,255,.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)", borderRadius:12, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>›</button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:56, marginBottom:14 }}>{expo.image}</div>
                  <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                    <span className="bdg bdg-glass">{expo.free ? "✓ 무료" : expo.price}</span>
                    <span className="bdg bdg-glass">{expo.flag} {expo.category}</span>
                    <span className="bdg bdg-glass">👥 {expo.visitors}</span>
                    <span className="bdg bdg-glass">📍 {expo.venue}</span>
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:"#fff", lineHeight:1.3, marginBottom:8 }}>{expo.name}</div>
                  <div style={{ color:"rgba(255,255,255,.75)", fontSize:13, fontWeight:500 }}>📍 {expo.venue} {expo.hall}</div>
                  <div style={{ color:"rgba(255,255,255,.75)", fontSize:13, fontWeight:500, marginTop:3 }}>📅 {expo.date}</div>
                  <div style={{ marginTop:10 }}><Stars rating={expo.rating} size={14} /></div>
                </div>

                {/* CTA */}
                <div style={{ padding:"16px 16px 0", display:"flex", gap:10 }}>
                  {getRegStatus(expo.id) === "approved" ? (
                    <button className="btn-p" onClick={() => go("qr")} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3z"/></svg>
                      입장권 QR 보기
                    </button>
                  ) : getRegStatus(expo.id) === "pending" ? (
                    <button className="btn-s" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      승인 대기중
                    </button>
                  ) : (
                    <>
                      <button className="btn-p" style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }} onClick={() => { window.open(getExpoUrl(expo), "_blank"); }}>
                        {expo.free ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 무료 참가 신청</> : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> 참관 신청</>}
                      </button>
                      <button className="btn-s" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }} onClick={() => toggleLike(expo.id)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={liked[expo.id]?"#ef4444":"none"} stroke={liked[expo.id]?"#ef4444":"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        {liked[expo.id] ? "저장됨" : "저장"}
                      </button>
                    </>
                  )}
                </div>

                {/* share row */}
                <div style={{ padding:"12px 16px 0", display:"flex", gap:8 }}>
                  {[
                    {label:"공유", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>},
                    {label:"링크복사", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>},
                    {label:"카카오톡", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
                  ].map(s => (
                    <div key={s.label} style={{ flex:1, background:"rgba(255,255,255,.6)", backdropFilter:"blur(8px)", borderRadius:12, padding:"10px", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:11, fontWeight:700, color:P.sub, cursor:"pointer", border:"1px solid rgba(0,0,0,.03)" }}>{s.icon} {s.label}</div>
                  ))}
                </div>

                {/* tabs */}
                <div className="tabs" style={{ marginTop:16, position:"relative" }}>
                  {[["info","정보"],["park","🅿️ 주차"],["stay","🏨 숙박"],["move","🚇 교통"],["eat","🍽 식사"],["fun","🎯 즐길거리"]].map(([v,l], idx) => (
                    <button key={v} className={`tab ${detailTab===v?"on":""}`} onClick={() => setDetailTab(v)}>{l}</button>
                  ))}
                  <div className="tab-bar-indicator" style={{ left:`${tabIdx*(100/6)}%`, width:`${100/6}%` }} />
                </div>

                {/* tab content */}
                <div style={{ padding:16 }}>
                  {detailTab === "info" && (
                    <div className="fu">
                      {/* 사전등록 신청 가능 여부 카드 */}
                      {(() => {
                        const ra = getRegAvailability(expo);
                        return (
                          <div className="g-card" style={{ padding:16, marginBottom:12, background: ra.bg, border:`1.5px solid ${ra.color}33` }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:40, height:40, borderRadius:12, background:`${ra.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{ra.icon}</div>
                                <div>
                                  <div style={{ fontSize:13, fontWeight:900, color:ra.color }}>{ra.label}</div>
                                  <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>
                                    {expo.regDeadline ? `마감일: ${expo.regDeadline.replace(/-/g,".")}` : ra.status === "확인중" ? "마감일 정보 없음" : "마감일 추정"}
                                  </div>
                                </div>
                              </div>
                              {ra.available && (
                                <button style={{ background:ra.color, color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:11, fontWeight:800, cursor:"pointer", fontFamily:FONT }} onClick={() => { window.open(getExpoUrl(expo), "_blank"); }}>
                                  바로 신청
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      <div className="g-card" style={{ padding:20, marginBottom:12 }}>
                        <div style={{ fontSize:14, fontWeight:800, color:P.text, marginBottom:10 }}>전시 소개</div>
                        <div style={{ fontSize:14, color:"#555", lineHeight:1.8 }}>{expo.desc}</div>
                      </div>
                      <div className="g-card" style={{ padding:20, marginBottom:12 }}>
                        <div style={{ fontSize:14, fontWeight:800, color:P.text, marginBottom:10 }}>상세 정보</div>
                        {[["📍 장소",`${expo.venue} ${expo.hall}`],["📅 기간",expo.date],["💰 입장료",expo.price],["🕐 운영","10:00 ~ 18:00 (입장마감 17:30)"],["👥 누적방문",expo.visitors+"명"]].map(([k,v]) => (
                          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid rgba(0,0,0,.04)", fontSize:13 }}>
                            <span style={{ color:P.sub, fontWeight:500 }}>{k}</span>
                            <span style={{ color:P.text, fontWeight:700, textAlign:"right", maxWidth:"58%" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {/* 사전등록 마감 안내 */}
                      {expo.regDeadline && (() => {
                        const ru = getRegUrgency(expo.regDeadline);
                        return ru && (
                          <div className="g-card" style={{ padding:20, marginBottom:12, background: ru.urgent ? "rgba(254,226,226,.6)" : "rgba(254,243,199,.5)", border: ru.urgent ? "1.5px solid #fca5a5" : "1.5px solid #fde68a" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                              <span style={{ fontSize:18 }}>{ru.urgent ? "🔥" : "📝"}</span>
                              <div style={{ fontSize:14, fontWeight:900, color: ru.urgent ? "#dc2626" : "#92400e" }}>사전등록 마감 안내</div>
                            </div>
                            <div style={{ fontSize:13, color:"#555", lineHeight:1.7 }}>
                              마감일: <strong>{expo.regDeadline.replace(/-/g,".")}</strong><br/>
                              상태: <strong style={{ color:ru.color }}>{ru.label}</strong>
                            </div>
                            {ru.urgent && <button className="btn-p" style={{ marginTop:14, background:"linear-gradient(135deg,#dc2626,#ef4444)", fontSize:14 }} onClick={() => { if (!user) { setAuthMode("login"); go("auth"); return; } setModal(true); }}>⚡ 지금 바로 사전등록</button>}
                          </div>
                        );
                      })()}
                      {expo.country !== "KR" && (
                        <div className="g-card" style={{ padding:20, background:"rgba(255,251,235,.75)" }}>
                          <div style={{ fontSize:14, fontWeight:800, color:"#92400e", marginBottom:10 }}>✈️ 해외 전시 정보</div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            {["무비자 입국 가능","환율 계산기 →","항공편 검색 →"].map(t => <span key={t} className="bdg bdg-orange">{t}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── 주차장 안내 탭 (전시장별 실제 데이터) ── */}
                  {detailTab === "park" && (() => {
                    const pk = getParkingData(expo.venue);
                    return (
                    <div className="fu">
                      {/* 주차장 위치 안내 미니맵 */}
                      <div className="g-card" style={{ padding:0, marginBottom:12, overflow:"hidden" }}>
                        <div style={{ background:`linear-gradient(135deg, ${expo.color}15, ${expo.color}30)`, padding:20, position:"relative" }}>
                          <div style={{ fontSize:14, fontWeight:900, color:P.text, marginBottom:4 }}>🅿️ {pk.name}</div>
                          <div style={{ fontSize:11, color:P.sub, marginBottom:14 }}>{pk.floors} · 총 {pk.total.toLocaleString()}면</div>
                          {/* 시각적 지도 */}
                          <div style={{ background:"#f0f1f6", borderRadius:16, padding:16, position:"relative", minHeight:180, border:"1px solid rgba(0,0,0,.04)" }}>
                            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:100, height:60, background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:P.accent, border:"2px solid #a5b4fc", boxShadow:"0 2px 8px rgba(99,102,241,.15)", zIndex:2 }}>
                              {expo.venue}
                            </div>
                            <div style={{ position:"absolute", bottom:12, left:12, background:"#3b82f6", color:"#fff", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:800, boxShadow:"0 2px 8px rgba(59,130,246,.3)" }}>🅿️ {pk.floors}</div>
                            <div style={{ position:"absolute", top:12, left:12, display:"flex", flexDirection:"column", gap:4 }}>
                              {pk.gates.filter(g=>g.type==="in").map((g,i) => (
                                <span key={i} style={{ background:"#059669", color:"#fff", borderRadius:6, padding:"3px 8px", fontSize:9, fontWeight:800 }}>▶ {g.name.split("(")[0].trim()}</span>
                              ))}
                            </div>
                            <div style={{ position:"absolute", top:12, right:12, display:"flex", flexDirection:"column", gap:4 }}>
                              {pk.gates.filter(g=>g.type==="out").slice(0,1).map((g,i) => (
                                <span key={i} style={{ background:"#dc2626", color:"#fff", borderRadius:6, padding:"3px 8px", fontSize:9, fontWeight:800 }}>{g.name.split("(")[0].trim()} ◀</span>
                              ))}
                            </div>
                            <div style={{ position:"absolute", bottom:12, right:12, background:"#10b981", color:"#fff", borderRadius:8, padding:"6px 10px", fontSize:10, fontWeight:800, boxShadow:"0 2px 8px rgba(16,185,129,.3)" }}>⚡ EV 충전</div>
                            <div style={{ position:"absolute", top:42, left:0, right:0, height:2, background:"#d1d5db" }} />
                            <div style={{ position:"absolute", bottom:42, left:0, right:0, height:2, background:"#d1d5db" }} />
                          </div>
                          <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
                            {[["#059669","입구"],["#dc2626","출구"],["#3b82f6","주차장"],["#10b981","EV 충전"]].map(([c,l]) => (
                              <span key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:P.sub, fontWeight:600 }}><span style={{ width:8, height:8, borderRadius:4, background:c }} /> {l}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 주차 요금 */}
                      <div className="g-card" style={{ padding:20, marginBottom:12 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:P.text, marginBottom:14 }}>💰 주차 요금</div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                          {pk.rates.map(f => (
                            <div key={f.label} style={{ background:"#f9fafb", borderRadius:14, padding:"14px 12px", border:"1px solid rgba(0,0,0,.03)" }}>
                              <div style={{ fontSize:18, marginBottom:6 }}>{f.icon}</div>
                              <div style={{ fontSize:10, color:P.sub, fontWeight:600, marginBottom:3 }}>{f.label}</div>
                              <div style={{ fontSize:15, fontWeight:900, color:P.text }}>{f.price}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ background:`${P.accent}0a`, border:`1px solid ${P.accent}18`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:8 }}>
                          <span style={{ fontSize:14 }}>ℹ️</span>
                          <div style={{ fontSize:12, color:P.sub, lineHeight:1.6 }}>
                            영업시간: <strong style={{ color:P.text }}>{pk.hours}</strong>
                            {pk.nightNote && <><br/>{pk.nightNote}</>}
                          </div>
                        </div>
                      </div>

                      {/* 할인 팁 */}
                      <div className="g-card" style={{ padding:20, marginBottom:12 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:P.text, marginBottom:14 }}>🏷️ 주차 할인 TIP</div>
                        {pk.discounts.map(t => (
                          <div key={t.tip} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(0,0,0,.04)" }}>
                            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg, rgba(99,102,241,.08), rgba(139,92,246,.08))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{t.icon}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{t.tip}</div>
                              <span className="bdg bdg-green" style={{ marginTop:4 }}>{t.discount}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 전기차 충전 */}
                      <div className="g-card" style={{ padding:20, marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                          <div style={{ fontSize:14, fontWeight:900, color:P.text }}>⚡ 전기차 충전소</div>
                          <span className="bdg bdg-green">운영중</span>
                        </div>
                        {pk.ev.map(ev => (
                          <div key={ev.loc} style={{ background:"#f9fafb", borderRadius:14, padding:14, marginBottom:8, border:"1px solid rgba(0,0,0,.03)" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                              <div>
                                <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{ev.loc}</div>
                                <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>{ev.brand} · {ev.type}</div>
                              </div>
                              <div style={{ textAlign:"right" }}>
                                <div style={{ fontSize:13, fontWeight:900, color: ev.avail > 0 ? "#059669" : "#dc2626" }}>{ev.avail}/{ev.count}기</div>
                                <div style={{ fontSize:10, color: ev.avail > 0 ? "#059669" : "#dc2626", fontWeight:600 }}>{ev.avail > 0 ? "이용가능" : "만석"}</div>
                              </div>
                            </div>
                            <div style={{ display:"flex", gap:4 }}>
                              {Array.from({ length: ev.count }, (_, i) => (
                                <div key={i} style={{ flex:1, height:6, borderRadius:3, background: i < ev.avail ? "#10b981" : "#e5e7eb", transition:"background .3s" }} />
                              ))}
                            </div>
                          </div>
                        ))}
                        <div style={{ background:"#fffbeb", borderRadius:12, padding:"12px 14px", marginTop:8, display:"flex", alignItems:"flex-start", gap:8, border:"1px solid #fde68a" }}>
                          <span style={{ fontSize:14 }}>💡</span>
                          <div style={{ fontSize:11, color:"#92400e", lineHeight:1.6, fontWeight:500 }}>
                            <strong>충전 요금:</strong> 급속 350원/kWh · 완속 250원/kWh<br/>
                            <strong>충전 중 주차:</strong> 충전 완료 후 30분까지 무료
                          </div>
                        </div>
                      </div>

                      {/* 입출입구 안내 */}
                      <div className="g-card" style={{ padding:20 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:P.text, marginBottom:14 }}>🚗 입출입구 안내</div>
                        {pk.gates.map(gate => (
                          <div key={gate.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(0,0,0,.04)" }}>
                            <div style={{ width:40, height:40, borderRadius:12, background: gate.type === "in" ? "rgba(5,150,105,.08)" : "rgba(220,38,38,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color: gate.type === "in" ? "#059669" : "#dc2626" }}>
                              {gate.type === "in" ? "▶" : "◀"}
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{gate.name}</div>
                              <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>{gate.dir}</div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                              <div style={{ width:8, height:8, borderRadius:4, background:"#059669" }} />
                              <span style={{ fontSize:12, fontWeight:800, color:"#059669" }}>원활</span>
                            </div>
                          </div>
                        ))}
                        <button className="btn-p" style={{ marginTop:16, fontSize:14 }}>🗺️ 네비게이션 안내 시작</button>
                      </div>
                    </div>
                    );
                  })()}

                  {detailTab === "stay" && (
                    <div className="fu">
                      <div style={{ fontSize:12, color:P.sub, marginBottom:12, fontWeight:600 }}>전시장 반경 2km 내 숙박</div>
                      {(expo.venue === "코엑스" ? [{n:"그랜드 인터컨티넨탈",r:4.8,d:3,p:"180,000원~/박"},{n:"코엑스 인터시티호텔",r:4.6,d:5,p:"150,000원~/박"},{n:"RYSE Autograph",r:4.5,d:8,p:"120,000원~/박"}]
                       : expo.venue === "킨텍스" ? [{n:"킨텍스 캐슬호텔",r:4.5,d:5,p:"110,000원~/박"},{n:"MVL 호텔 킨텍스",r:4.7,d:3,p:"140,000원~/박"},{n:"라마다 킨텍스",r:4.4,d:7,p:"95,000원~/박"}]
                       : expo.venue === "DDP" ? [{n:"JW 메리어트 동대문",r:4.7,d:5,p:"200,000원~/박"},{n:"호텔 PJ 명동",r:4.4,d:8,p:"90,000원~/박"},{n:"이비스 앰배서더",r:4.3,d:10,p:"80,000원~/박"}]
                       : [{n:"노보텔 앰배서더",r:4.6,d:5,p:"160,000원~/박"},{n:"포레스트 호텔",r:4.3,d:8,p:"85,000원~/박"},{n:"강남 에어비앤비",r:4.2,d:10,p:"65,000원~/박"}]
                      ).map((h,i) => (
                        <div key={h.n} className="g-card g-card-hover" style={{ padding:16, marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
                          <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg, ${["#818cf8","#34d399","#fb923c"][i]}44, ${["#818cf8","#34d399","#fb923c"][i]}22)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏨</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:800, fontSize:14, color:P.text }}>{h.n}</div>
                            <div style={{ fontSize:11, color:P.sub, marginTop:3, display:"flex", alignItems:"center", gap:6 }}>
                              <Stars rating={h.r} size={9} />
                              <span>· 도보 {h.d}분</span>
                            </div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{h.p}</div>
                            <div style={{ fontSize:11, color:P.accent, fontWeight:700, marginTop:3 }}>예약 →</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === "move" && (
                    <div className="fu">
                      <div style={{ fontSize:12, color:P.sub, marginBottom:12, fontWeight:600 }}>전시장까지 가는 방법</div>
                      {(expo.venue === "코엑스" ? [{i:"🚇",t:"지하철",r:"삼성역 5·6번 출구 도보 1분",d:"2호선 삼성역"},{i:"🚌",t:"버스",r:"코엑스 정류장 하차",d:"강남대로 경유"},{i:"🚗",t:"자가용",r:"코엑스 지하 주차장",d:"15분 1,500원"}]
                       : expo.venue === "킨텍스" ? [{i:"🚇",t:"지하철",r:"대화역 2번 출구 셔틀버스",d:"3호선 대화역"},{i:"🚌",t:"버스",r:"킨텍스 정류장 하차",d:"9710, 9714번"},{i:"🚗",t:"자가용",r:"킨텍스 주차장",d:"30분 1,500원"}]
                       : expo.venue === "DDP" ? [{i:"🚇",t:"지하철",r:"동대문역사문화공원역 1번 출구",d:"2·4·5호선"},{i:"🚌",t:"버스",r:"DDP 정류장 하차",d:"을지로 경유"},{i:"🚗",t:"자가용",r:"DDP 공영주차장",d:"5분 400원"}]
                       : [{i:"🚇",t:"지하철",r:"대치역 5번 출구 도보 5분",d:"3호선 대치역"},{i:"🚌",t:"버스",r:"SETEC 정류장 하차",d:"남부순환로 경유"},{i:"🚗",t:"자가용",r:"세텍 주차장",d:"30분 1,800원"}]
                      ).map(m => (
                        <div key={m.t} className="g-card" style={{ padding:16, marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                            <div style={{ fontSize:30 }}>{m.i}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:800, fontSize:14, color:P.text }}>{m.r}</div>
                              <div style={{ fontSize:12, color:P.sub, marginTop:2 }}>{m.d}</div>
                            </div>
                            <div style={{ fontSize:12, color:P.accent, fontWeight:700 }}>길찾기 →</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === "eat" && (
                    <div className="fu">
                      <div style={{ fontSize:12, color:P.sub, marginBottom:12, fontWeight:600 }}>근처 추천 맛집</div>
                      {(expo.venue === "코엑스" ? [{n:"강남 참치",t:"한식",r:4.6},{n:"코엑스몰 푸드코트",t:"푸드코트",r:4.7},{n:"아웃백 삼성점",t:"양식",r:4.8}]
                       : expo.venue === "킨텍스" ? [{n:"명인만두 일산점",t:"한식",r:4.5},{n:"고봉민김밥인 킨텍스",t:"분식",r:4.3},{n:"애슐리 일산점",t:"뷔페",r:4.4}]
                       : expo.venue === "DDP" ? [{n:"을지면옥",t:"한식",r:4.8},{n:"동대문 엽기떡볶이",t:"분식",r:4.5},{n:"평양냉면집",t:"한식",r:4.7}]
                       : [{n:"대치동 곱창",t:"한식",r:4.6},{n:"역삼동 이자카야",t:"일식",r:4.4},{n:"선릉역 파스타",t:"양식",r:4.5}]
                      ).map((r,i) => (
                        <div key={r.n} className="g-card g-card-hover" style={{ padding:16, marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
                          <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg, ${["#fb7185","#fbbf24","#a78bfa"][i]}44, ${["#fb7185","#fbbf24","#a78bfa"][i]}22)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🍽️</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:800, fontSize:14, color:P.text }}>{r.n}</div>
                            <div style={{ fontSize:11, color:P.sub, marginTop:3, display:"flex", alignItems:"center", gap:6 }}>
                              <Stars rating={r.r} size={9} />
                              <span>· {r.t}</span>
                            </div>
                          </div>
                          <div style={{ fontSize:12, color:P.accent, fontWeight:700 }}>예약 →</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === "fun" && (
                    <div className="fu">
                      <div style={{ fontSize:12, color:P.sub, marginBottom:12, fontWeight:600 }}>주변 즐길거리</div>
                      {(expo.venue === "코엑스" ? [{n:"코엑스 아쿠아리움 🐠",d:4},{n:"별마당 도서관 📚",d:2},{n:"봉은사 🏛️",d:10},{n:"강남 압구정 로데오 🛍️",d:15}]
                       : expo.venue === "킨텍스" ? [{n:"일산 호수공원 🌳",d:8},{n:"원마운트 🎢",d:5},{n:"라페스타 거리 🛍️",d:10},{n:"아쿠아플라넷 일산 🐳",d:12}]
                       : expo.venue === "DDP" ? [{n:"동대문 패션타운 🛍️",d:3},{n:"광장시장 🍢",d:8},{n:"청계천 산책로 🏞️",d:5},{n:"흥인지문 🏛️",d:10}]
                       : [{n:"양재 시민의 숲 🌲",d:10},{n:"코엑스몰 🛍️",d:12},{n:"선릉공원 🏛️",d:15},{n:"강남역 거리 🏙️",d:20}]
                      ).map(p => (
                        <div key={p.n} className="g-card" style={{ padding:16, marginBottom:10, cursor:"pointer" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div>
                              <div style={{ fontWeight:800, fontSize:14, color:P.text }}>{p.n}</div>
                              <div style={{ fontSize:12, color:P.sub, marginTop:3 }}>🚶 도보 {p.d}분</div>
                            </div>
                            <div style={{ fontSize:12, color:P.accent, fontWeight:700 }}>상세 →</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Modal */}
              {modal && (
                <div className="modal-bg" onClick={() => setModal(false)}>
                  <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                    <div className="modal-handle" />
                    {!done ? (
                      <>
                        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                          {[1,2].map(s => (
                            <div key={s} style={{ flex:1, height:4, borderRadius:2, background: s <= step ? P.accent : "#e5e7eb", transition:"background .3s" }} />
                          ))}
                        </div>
                        <div style={{ fontSize:19, fontWeight:900, color:P.text, marginBottom:4 }}>
                          {step === 1 ? "신청 정보 확인" : "관람 날짜 선택"}
                        </div>
                        <div style={{ fontSize:13, color:P.sub, marginBottom:20 }}>
                          {step === 1 ? "저장된 회원 정보로 자동 입력됩니다" : "관람하실 날짜를 선택해 주세요"}
                        </div>
                        {step === 1 ? (
                          <>
                            {[["이름", user?.name || "—"],["연락처", user?.phone || "미등록"],["이메일", user?.email || "—"],["소속", user?.company || "미등록"],["직책", user?.jobTitle || "미등록"]].map(([l,v]) => (
                              <div key={l} className="inp-row">
                                <div><div style={{ fontSize:11, color:"#999", fontWeight:600, marginBottom:2 }}>{l}</div><div style={{ fontSize:14, color:P.text, fontWeight:700 }}>{v}</div></div>
                                <button style={{ fontSize:16, color:"#ccc", background:"none", border:"none", cursor:"pointer" }}>✏️</button>
                              </div>
                            ))}
                            <div style={{ marginTop:10 }}>
                              <div style={{ fontSize:11, color:P.sub, marginBottom:8, fontWeight:600 }}>프로필 선택</div>
                              <div style={{ display:"flex", gap:8 }}>
                                {["기본 (직장)","개인"].map((p,i) => (
                                  <div key={p} style={{ flex:1, background:i===0 ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "#f3f4f6", color:i===0 ? "#fff" : "#666", borderRadius:14, padding:11, textAlign:"center", fontSize:13, fontWeight:800, cursor:"pointer" }}>{p}</div>
                                ))}
                              </div>
                            </div>
                            <button className="btn-p" style={{ marginTop:20 }} onClick={() => setStep(2)}>다음 →</button>
                          </>
                        ) : (
                          <>
                            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                              {["04.05","04.06","04.07","04.08","04.09"].map((d,idx) => (
                                <div key={d} onClick={() => setSelDate(d)} style={{ flex:1, minWidth:58, background:selDate===d ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "#f3f4f6", color:selDate===d ? "#fff" : "#666", borderRadius:14, padding:"14px 6px", textAlign:"center", fontWeight:800, cursor:"pointer", transition:"all .25s", boxShadow: selDate===d ? `0 4px 16px ${P.glow}` : "none" }}>
                                  <div style={{ fontSize:14 }}>{d}</div>
                                  <div style={{ fontSize:10, marginTop:3, opacity:.7 }}>{["토","일","월","화","수"][idx]}</div>
                                </div>
                              ))}
                            </div>
                            <div className="inp-row">
                              <div><div style={{ fontSize:11, color:"#999", fontWeight:600, marginBottom:2 }}>인원</div><div style={{ fontSize:14, color:P.text, fontWeight:700 }}>{persons}명</div></div>
                              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                <button onClick={() => setPersons(Math.max(1, persons-1))} style={{ width:34, height:34, borderRadius:10, background:"#f3f4f6", border:"none", fontSize:18, cursor:"pointer", fontWeight:700 }}>−</button>
                                <span style={{ fontWeight:900, fontSize:16, minWidth:20, textAlign:"center" }}>{persons}</span>
                                <button onClick={() => setPersons(Math.min(10, persons+1))} style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${P.accent},${P.accent2})`, border:"none", fontSize:18, color:"#fff", cursor:"pointer", fontWeight:700 }}>+</button>
                              </div>
                            </div>
                            <button className="btn-p" style={{ marginTop:20 }} onClick={() => { addReg(expo.id, `2026-${selDate.replace(".","-")}`, persons); setDone(true); }}>✅ 신청 완료</button>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={{ textAlign:"center", padding:"16px 0" }}>
                        <div style={{ position:"relative", height:60, marginBottom:8 }}>
                          {["🎉","✨","🎊","⭐","💜"].map((c,i) => (
                            <span key={i} style={{ position:"absolute", left:`${15+i*16}%`, bottom:0, fontSize:22, animation:`confetti 1s ${i*.12}s ease both` }}>{c}</span>
                          ))}
                        </div>
                        <div style={{ fontSize:22, fontWeight:900, color:P.text, marginBottom:8 }}>신청 완료!</div>
                        <div style={{ fontSize:14, color:P.sub, marginBottom:4 }}>{expo.name}</div>
                        <div style={{ fontSize:13, color:P.sub, marginBottom:24 }}>관람일 {selDate} · {persons}명</div>
                        <div style={{ background:"rgba(236,253,245,.75)", borderRadius:18, padding:18, marginBottom:24, textAlign:"left", border:"1px solid rgba(5,150,105,.12)" }}>
                          <div style={{ fontSize:13, fontWeight:800, color:"#059669", marginBottom:6 }}>📱 다음 단계</div>
                          <div style={{ fontSize:12, color:"#555", lineHeight:1.7 }}>주최사 승인 후 QR 입장권이 자동으로 저장됩니다.<br/>푸시 알림으로 알려드려요!</div>
                        </div>
                        <button className="btn-p" onClick={() => { setModal(false); setMyTab("regs"); go("my"); }}>내 신청 현황 보기</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ══════ QR ══════ */}
        <div className={`scr ${screen !== "qr" ? "off-r" : ""}`} style={{ background:"linear-gradient(180deg,#f5f5f7,#ede9fe)" }}>
          {(() => {
            /* QR 화면: expo가 선택되면 해당 전시회 입장권, 없으면 전체 입장권 목록 */
            const activeTicket = expo ? regs.find(r => String(r.expoId) === String(expo.id)) : (regs.length > 0 ? regs[0] : null);
            const ticketExpo = activeTicket ? (expo || EXHIBITIONS.find(e => String(e.id) === String(activeTicket.expoId))) : todayExpo;
            const qrCodeStr = activeTicket?.qrCode || activeTicket?.ticketId || "EXPO-TICKET";
            const ticketStatus = activeTicket?.status || "pending";
            const otherTickets = regs.filter(r => activeTicket ? String(r.expoId) !== String(activeTicket.expoId) : true);
            return (
              <>
              <div className="scroll" style={{ paddingBottom:90 }}>
                <div style={{ background:"linear-gradient(165deg,#0f0f1a,#1e1b4b)", padding:"52px 20px 28px" }}>
                  <button onClick={back} style={{ background:"rgba(255,255,255,.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.12)", borderRadius:14, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:16, fontFamily:FONT }}>← 뒤로</button>
                  <div style={{ color:"rgba(255,255,255,.6)", fontSize:12, fontWeight:700 }}>🎫 입장권</div>
                  <div style={{ color:"#fff", fontSize:19, fontWeight:900, marginTop:4 }}>{ticketExpo?.name || "입장권 없음"}</div>
                </div>

                <div style={{ padding:16 }}>
                  {activeTicket ? (
                    <div style={{ background:"#fff", borderRadius:24, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,.1)", border:"1px solid rgba(0,0,0,.04)" }}>
                      <div style={{ padding:"24px 24px 20px", textAlign:"center" }}>
                        <div style={{ display:"inline-flex", padding:"6px 14px", background: ticketStatus==="approved" ? "#05966914" : "#d9770614", borderRadius:20, marginBottom:16 }}>
                          <span style={{ fontSize:11, fontWeight:800, color: ticketStatus==="approved" ? "#059669" : "#d97706" }}>
                            {ticketStatus==="approved" ? "✅ 승인완료" : "⏳ 승인대기"}
                          </span>
                        </div>
                        <div style={{ background:"#f8f7ff", borderRadius:18, padding:24, marginBottom:16, border:`2px solid ${P.accent}18` }}>
                          <QRCode size={200} />
                        </div>
                        <div style={{ fontSize:11, color:P.sub, marginBottom:4 }}>입장권 번호</div>
                        <div style={{ fontSize:16, fontWeight:900, color:P.text, letterSpacing:2, wordBreak:"break-all" }}>{qrCodeStr}</div>
                      </div>

                      <div style={{ position:"relative", height:24 }}>
                        <div style={{ position:"absolute", left:-14, top:0, width:28, height:28, borderRadius:14, background:"linear-gradient(180deg,#f5f5f7,#ede9fe)" }} />
                        <div style={{ position:"absolute", right:-14, top:0, width:28, height:28, borderRadius:14, background:"linear-gradient(180deg,#f5f5f7,#ede9fe)" }} />
                        <div style={{ borderTop:"2px dashed #e5e7eb", position:"absolute", top:12, left:24, right:24 }} />
                      </div>

                      <div style={{ padding:"12px 24px 24px" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                          {[
                            ["관람일", activeTicket.visitDate || "미정"],
                            ["인원", `${activeTicket.persons || 1}명`],
                            ["장소", ticketExpo ? `${ticketExpo.venue} ${ticketExpo.hall || ""}` : ""],
                            ["신청일", activeTicket.appliedAt ? new Date(activeTicket.appliedAt).toLocaleDateString("ko") : ""],
                          ].map(([k,v]) => (
                            <div key={k} style={{ background:"#f9fafb", borderRadius:14, padding:12 }}>
                              <div style={{ fontSize:10, color:P.sub, marginBottom:3, fontWeight:600 }}>{k}</div>
                              <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="g-card" style={{ padding:32, textAlign:"center" }}>
                      <div style={{ fontSize:48, marginBottom:12 }}>🎫</div>
                      <div style={{ fontSize:16, fontWeight:800, color:P.text, marginBottom:8 }}>입장권이 없습니다</div>
                      <div style={{ fontSize:13, color:P.sub, marginBottom:16 }}>전시회에 사전등록하면 입장권이 발급됩니다</div>
                      <button className="btn-p" onClick={() => go("home")}>전시회 둘러보기</button>
                    </div>
                  )}

                  {activeTicket && <button className="btn-p" style={{ marginTop:16 }} onClick={() => setQrFull(true)}>🔍 전체화면으로 보기</button>}

                  {otherTickets.length > 0 && (
                    <>
                      <div style={{ fontSize:14, fontWeight:800, color:P.text, marginTop:24, marginBottom:10 }}>다른 입장권 ({otherTickets.length})</div>
                      {otherTickets.map(t => {
                        const tEx = EXHIBITIONS.find(e => String(e.id) === String(t.expoId));
                        if (!tEx) return null;
                        return (
                          <div key={t.expoId} className="g-card" style={{ padding:14, marginBottom:8, cursor:"pointer" }} onClick={() => { setExpo(tEx); }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <div>
                                <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{tEx.image} {tEx.name}</div>
                                <div style={{ fontSize:11, color:P.sub }}>{t.visitDate} · {t.qrCode || t.ticketId || ""}</div>
                              </div>
                              <span className={t.status==="approved" ? "st-approved" : "st-pending"} style={{ fontSize:10 }}>
                                {t.status==="approved" ? "✅" : "⏳"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {qrFull && activeTicket && (
                <div style={{ position:"absolute", inset:0, background:"#fff", zIndex:300, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, cursor:"pointer" }} onClick={() => setQrFull(false)}>
                  <div style={{ fontSize:13, color:P.sub, marginBottom:28, fontWeight:600 }}>탭하면 닫힙니다</div>
                  <div style={{ padding:20, borderRadius:24, border:`3px solid ${P.accent}30` }}>
                    <QRCode size={260} />
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:P.text, marginTop:24, letterSpacing:2, wordBreak:"break-all", textAlign:"center", padding:"0 20px" }}>{qrCodeStr}</div>
                  <div style={{ fontSize:14, color:P.sub, marginTop:8 }}>{ticketExpo?.name}</div>
                </div>
              )}
              </>
            );
          })()}

          <BNav active="qr" onNav={t => { if(t==="home") go("home"); else if(t==="my") go("my"); else if(t==="plan") go("plan"); }} />
        </div>

        {/* ══════ MY ══════ */}
        <div className={`scr ${screen !== "my" ? "off-r" : ""}`} style={{ background:P.bg }}>
          {user ? (
          <div className="scroll" style={{ paddingBottom:90 }}>
            {/* 프로필 헤더 */}
            <div style={{ background:"linear-gradient(165deg,#0f0f1a,#1e1b4b,#312e81)", padding:"52px 20px 32px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-20, width:150, height:150, borderRadius:75, background:"radial-gradient(circle,rgba(139,92,246,.2),transparent 70%)" }} />
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:60, height:60, borderRadius:30, background:"linear-gradient(135deg,#6366f1,#a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid rgba(255,255,255,.2)" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"rgba(255,255,255,.6)", fontSize:12, fontWeight:500 }}>안녕하세요</div>
                  <div style={{ color:"#fff", fontSize:20, fontWeight:900 }}>{user.name} 님</div>
                  <div style={{ color:"rgba(255,255,255,.5)", fontSize:12, marginTop:2 }}>{user.company ? `${user.company}` : ""}{user.jobTitle ? ` · ${user.jobTitle}` : ""}{!user.company && !user.jobTitle ? user.email : ""}</div>
                </div>
                <button onClick={auth.logout} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:12, padding:"8px 12px", color:"rgba(255,255,255,.7)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:FONT }}>로그아웃</button>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:22 }}>
                {[["신청",`${regs.length}건`,"📋"],["찜",`${Object.values(liked).filter(Boolean).length}건`,"❤️"],["관람완료",`${visited.length}건`,"🏆"]].map(([l,v,ic]) => (
                  <div key={l} style={{ flex:1, background:"rgba(255,255,255,.08)", backdropFilter:"blur(8px)", borderRadius:16, padding:"14px 10px", textAlign:"center", border:"1px solid rgba(255,255,255,.08)" }}>
                    <div style={{ fontSize:11, marginBottom:4 }}>{ic}</div>
                    <div style={{ color:"#fff", fontSize:20, fontWeight:900 }}>{v}</div>
                    <div style={{ color:"rgba(255,255,255,.5)", fontSize:10, marginTop:2, fontWeight:600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:16 }}>
              {/* 마이데이터 탭 */}
              <div style={{ display:"flex", gap:6, marginBottom:18 }}>
                {[["regs","신청 현황","📋"],["liked","찜 목록","❤️"],["visited","관람 완료","🏆"],["settings","프로필","⚙️"]].map(([k,l,ic]) => (
                  <button key={k} onClick={() => setMyTab(k)} style={{ flex:1, background:myTab===k ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "rgba(255,255,255,.65)", color:myTab===k ? "#fff" : "#666", border:myTab===k ? "none" : "1px solid rgba(0,0,0,.05)", borderRadius:14, padding:"10px 4px", fontSize:10.5, fontWeight:800, cursor:"pointer", fontFamily:FONT, textAlign:"center" }}>
                    <div>{ic}</div><div style={{ marginTop:2 }}>{l}</div>
                  </button>
                ))}
              </div>

              {/* 신청 현황 */}
              {myTab === "regs" && (
                <>
                  {regs.length === 0 ? (
                    <div className="g-card" style={{ padding:32, textAlign:"center" }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
                      <div style={{ fontSize:15, fontWeight:800, color:P.text, marginBottom:6 }}>신청 내역이 없습니다</div>
                      <div style={{ fontSize:12, color:P.sub }}>전시회를 둘러보고 사전등록을 해보세요!</div>
                      <button className="btn-sm" onClick={() => go("home")} style={{ marginTop:16 }}>전시회 둘러보기</button>
                    </div>
                  ) : regs.map((reg, idx) => {
                    const ex = EXHIBITIONS.find(e => String(e.id) === String(reg.expoId));
                    if (!ex) return null;
                    return (
                      <div key={reg.expoId || idx} style={{ display:"flex", gap:14, marginBottom:16 }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:20 }}>
                          <div style={{ width:12, height:12, borderRadius:6, background: reg.status==="approved" ? "#059669" : "#d97706", border:"2px solid #fff", boxShadow:`0 0 0 2px ${reg.status==="approved" ? "#05966922" : "#d9770622"}` }} />
                          {idx < regs.length-1 && <div style={{ flex:1, width:2, background:"#e5e7eb", marginTop:4 }} />}
                        </div>
                        <div className="g-card" style={{ flex:1, padding:16 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:14, fontWeight:900, color:P.text, marginBottom:3 }}>{ex.image} {ex.name}</div>
                              <div style={{ fontSize:12, color:P.sub }}>📅 관람일 {reg.visitDate} · {reg.appliedAt ? new Date(reg.appliedAt).toLocaleDateString("ko") : ""} 신청</div>
                              {reg.qrCode && <div style={{ fontSize:11, color:P.accent, fontWeight:700, marginTop:2 }}>🎫 {reg.qrCode}</div>}
                            </div>
                            <span className={reg.status==="approved" ? "st-approved" : "st-pending"}>
                              {reg.status==="approved" ? "✅ 승인" : "⏳ 대기"}
                            </span>
                          </div>
                          <div style={{ display:"flex", gap:8 }}>
                            {reg.qrCode && <button className="btn-sm" onClick={() => { setExpo(ex); go("qr"); }}>🎫 QR</button>}
                            <button className="btn-s" style={{ flex:1, padding:10, fontSize:12, fontWeight:700 }} onClick={() => go("detail", ex)}>상세보기</button>
                            <button onClick={() => cancelReg(reg.expoId)} className="btn-s" style={{ padding:"10px 14px", fontSize:12, color:"#dc2626", borderColor:"#fecaca" }}>취소</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* 찜 목록 */}
              {myTab === "liked" && (
                <>
                  {Object.entries(liked).filter(([,v]) => v).length === 0 ? (
                    <div className="g-card" style={{ padding:32, textAlign:"center" }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>❤️</div>
                      <div style={{ fontSize:15, fontWeight:800, color:P.text, marginBottom:6 }}>찜한 전시회가 없습니다</div>
                      <div style={{ fontSize:12, color:P.sub }}>관심있는 전시회에 하트를 눌러보세요!</div>
                    </div>
                  ) : EXHIBITIONS.filter(e => liked[e.id]).map(ex => (
                    <div key={ex.id} className="g-card" style={{ padding:14, marginBottom:10, cursor:"pointer" }} onClick={() => go("detail", ex, filtered, filtered.indexOf(ex))}>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${ex.color}22,${ex.color}44)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{ex.image}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:P.text }}>{ex.name}</div>
                          <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>{ex.venue} · {ex.date}</div>
                        </div>
                        <span onClick={ev => { ev.stopPropagation(); toggleLike(ex.id); }} style={{ fontSize:20, cursor:"pointer" }}>❤️</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* 관람 완료 */}
              {myTab === "visited" && (
                <>
                  {visited.length === 0 ? (
                    <div className="g-card" style={{ padding:32, textAlign:"center" }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>🏆</div>
                      <div style={{ fontSize:15, fontWeight:800, color:P.text, marginBottom:6 }}>관람 완료 내역이 없습니다</div>
                      <div style={{ fontSize:12, color:P.sub }}>전시회 방문 후 관람완료를 기록해보세요!</div>
                    </div>
                  ) : EXHIBITIONS.filter(e => visited.includes(e.id)).map(ex => (
                    <div key={ex.id} className="g-card" style={{ padding:14, marginBottom:10 }}>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${ex.color}22,${ex.color}44)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{ex.image}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:800, color:P.text }}>{ex.name}</div>
                          <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>{ex.venue} · {ex.date}</div>
                        </div>
                        <span className="bdg bdg-green">관람완료</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* 프로필 설정 */}
              {myTab === "settings" && (
                <>
                  <div className="g-card" style={{ padding:18, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontSize:15, fontWeight:900, color:P.text }}>내 프로필</div>
                      <button onClick={() => setEditProfile(!editProfile)} style={{ background:editProfile ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "rgba(0,0,0,.04)", color:editProfile ? "#fff" : P.accent, border:"none", borderRadius:10, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT }}>
                        {editProfile ? "저장" : "수정"}
                      </button>
                    </div>
                    {[["이름","name"],["이메일","email"],["회사","company"],["직책","jobTitle"],["연락처","phone"]].map(([label, key]) => (
                      <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,.04)", fontSize:13 }}>
                        <span style={{ color:P.sub, minWidth:60 }}>{label}</span>
                        {editProfile && key !== "email" ? (
                          <input value={user[key] || ""} onChange={e => auth.updateProfile({ [key]: e.target.value })}
                            style={{ textAlign:"right", border:"none", background:"rgba(99,102,241,.06)", borderRadius:8, padding:"6px 10px", fontSize:13, fontWeight:700, color:P.text, outline:"none", fontFamily:FONT, flex:1, marginLeft:10 }} />
                        ) : (
                          <span style={{ color:P.text, fontWeight:700 }}>{user[key] || "-"}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="g-card" style={{ padding:18, marginBottom:12 }}>
                    <div style={{ fontSize:15, fontWeight:900, color:P.text, marginBottom:14 }}>마이데이터 요약</div>
                    {[["가입일", new Date(user.createdAt).toLocaleDateString("ko")],["찜한 전시회", `${Object.values(liked).filter(Boolean).length}건`],["사전등록 신청", `${regs.length}건`],["관람 완료", `${visited.length}건`],["데이터 저장소", "로컬 (이 기기)"]].map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(0,0,0,.04)", fontSize:13 }}>
                        <span style={{ color:P.sub }}>{k}</span>
                        <span style={{ color:P.text, fontWeight:700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={auth.logout} className="btn-s" style={{ fontSize:13, fontWeight:700, color:"#dc2626", borderColor:"#fecaca" }}>로그아웃</button>
                </>
              )}
            </div>
          </div>
          ) : (
          /* 비로그인 상태 - 로그인 유도 */
          <div className="scroll" style={{ paddingBottom:90 }}>
            <div style={{ background:"linear-gradient(165deg,#0f0f1a,#1e1b4b,#312e81)", padding:"80px 20px 44px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-20, width:150, height:150, borderRadius:75, background:"radial-gradient(circle,rgba(139,92,246,.2),transparent 70%)" }} />
              <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
              <div style={{ color:"#fff", fontSize:22, fontWeight:900, marginBottom:8 }}>로그인이 필요합니다</div>
              <div style={{ color:"rgba(255,255,255,.55)", fontSize:13, lineHeight:1.6 }}>회원가입 후 전시회 사전등록,<br/>찜 목록, 관람 기록을 관리해보세요!</div>
            </div>
            <div style={{ padding:"24px 20px" }}>
              <button className="btn-p" onClick={() => { setAuthMode("login"); go("auth"); }} style={{ marginBottom:12 }}>로그인</button>
              <button className="btn-s" onClick={() => { setAuthMode("signup"); go("auth"); }}>새 계정 만들기</button>
            </div>
          </div>
          )}
          <BNav active="my" onNav={t => { if(t==="home") go("home"); else if(t==="qr") go("qr"); else if(t==="plan") go("plan"); }} />
        </div>

        {/* ══════ PLAN ══════ */}
        <div className={`scr ${screen !== "plan" ? "off-r" : ""}`} style={{ background:P.bg }}>
          <div className="scroll" style={{ paddingBottom:90 }}>
            <div style={{ background:"linear-gradient(165deg,#ec4899,#8b5cf6,#6366f1)", backgroundSize:"200% 200%", animation:"gradientShift 6s ease infinite", padding:"52px 20px 36px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:60, background:"radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)" }} />
              <div style={{ color:"rgba(255,255,255,.7)", fontSize:12, fontWeight:700, marginBottom:8 }}>✨ AI 여행 플래너</div>
              <div style={{ color:"#fff", fontSize:22, fontWeight:900, lineHeight:1.4 }}>전시 + 여행 일정을<br/>자동으로 짜드려요</div>
            </div>

            <div style={{ padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, padding:"0 8px" }}>
                {["전시 선택","날짜 설정","AI 생성"].map((s,i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:8, flex: i < 2 ? 1 : "none" }}>
                    <div style={{ width:28, height:28, borderRadius:14, background: i === 0 ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "#e5e7eb", color: i === 0 ? "#fff" : "#999", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900 }}>{i+1}</div>
                    <span style={{ fontSize:11, fontWeight:700, color: i === 0 ? P.text : P.sub }}>{s}</span>
                    {i < 2 && <div style={{ flex:1, height:2, background:"#e5e7eb", borderRadius:1 }} />}
                  </div>
                ))}
              </div>

              <div className="g-card" style={{ padding:20, marginBottom:14 }}>
                <div style={{ fontSize:15, fontWeight:900, color:P.text, marginBottom:16 }}>🎯 전시 선택</div>
                {classified.filter(e => e.expoStatus !== "past").slice(0,3).map((e,i) => (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom: i < 2 ? "1px solid rgba(0,0,0,.04)" : "none" }}>
                    <div style={{ fontSize:28 }}>{e.image}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:P.text }}>{e.name}</div>
                      <div style={{ fontSize:11, color:P.sub, marginTop:2 }}>{e.date}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:12, border: i===0 ? "none" : `2px solid #d1d5db`, background: i===0 ? `linear-gradient(135deg,${P.accent},${P.accent2})` : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {i===0 && <span style={{ color:"#fff", fontSize:14, fontWeight:900 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="g-card" style={{ padding:20, marginBottom:14 }}>
                <div style={{ fontSize:15, fontWeight:900, color:P.text, marginBottom:16 }}>📅 날짜 설정</div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1, background:"#f9fafb", borderRadius:14, padding:14, textAlign:"center", border:"1px solid rgba(0,0,0,.04)" }}>
                    <div style={{ fontSize:10, color:P.sub, fontWeight:600 }}>출발일</div>
                    <div style={{ fontSize:16, fontWeight:900, color:P.text, marginTop:3 }}>03.28</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", color:P.sub, fontSize:20 }}>→</div>
                  <div style={{ flex:1, background:"#f9fafb", borderRadius:14, padding:14, textAlign:"center", border:"1px solid rgba(0,0,0,.04)" }}>
                    <div style={{ fontSize:10, color:P.sub, fontWeight:600 }}>귀가일</div>
                    <div style={{ fontSize:16, fontWeight:900, color:P.text, marginTop:3 }}>03.30</div>
                  </div>
                </div>
              </div>

              <button className="btn-p" style={{ background:"linear-gradient(135deg,#ec4899,#8b5cf6)" }}>✨ AI 일정 자동 생성</button>
            </div>
          </div>
          <BNav active="plan" onNav={t => { if(t==="home") go("home"); else if(t==="qr") go("qr"); else if(t==="my") go("my"); }} />
        </div>

      </div>
    </>
  );
}

/* ─── Bottom Nav ─── */
function BNav({ active, onNav }) {
  const items = [
    { key:"home", label:"홈", icon:(on) => <svg viewBox="0 0 24 24" fill={on?P.accent:"none"} stroke={on?P.accent:"#c0c0c8"} strokeWidth="1.8"><path d="M3 9.5l9-7 9 7V20a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>{!on && <polyline points="9 22 9 12 15 12 15 22" fill="none"/>}</svg> },
    { key:"search", label:"탐색", icon:(on) => <svg viewBox="0 0 24 24" fill="none" stroke={on?P.accent:"#c0c0c8"} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg> },
    { key:"qr", label:"QR" },
    { key:"plan", label:"플래너", icon:(on) => <svg viewBox="0 0 24 24" fill="none" stroke={on?P.accent:"#c0c0c8"} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { key:"my", label:"MY", icon:(on) => <svg viewBox="0 0 24 24" fill="none" stroke={on?P.accent:"#c0c0c8"} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <div className="bnav">
      {items.map(it => (
        <button key={it.key} className={`bnav-item ${active===it.key?"on":""}`} onClick={() => onNav(it.key)}>
          {it.key === "qr" ? (
            <div className="bnav-qr">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>
            </div>
          ) : it.icon(active===it.key)}
          {it.key !== "qr" && <span>{it.label}</span>}
        </button>
      ))}
    </div>
  );
}
