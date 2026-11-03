// TRIPPASS 4.0 — 조건, 유형, 질문, 추천 계산 (화면과 서버가 같이 써요)

export const COND = {
  days: { t: '여행 기간', o: [['short', '2~3일'], ['mid', '4~6일'], ['long', '1주 이상']] },
  budget: { t: '예산 (1인, 항공·숙박 포함)', o: [['b1', '50만원 이하'], ['b2', '50~100만원'], ['b3', '100~200만원'], ['b4', '200~300만원'], ['b5', '300만원 이상']] },
  season: { t: '출발 시기', o: [['spring', '봄'], ['summer', '여름'], ['fall', '가을'], ['winter', '겨울']] },
  weather: { t: '원하는 날씨', o: [['warm', '따뜻한 곳'], ['cool', '선선한 곳'], ['any', '상관없음']] },
  place: { t: '어떤 곳이 좋아요?', o: [['city', '도시'], ['resort', '휴양지'], ['both', '둘 다']] },
  with: { t: '누구와 가요?', o: [['solo', '혼자'], ['friend', '친구'], ['couple', '연인·배우자'], ['family', '가족']] },
};
export const DEF = { days: 'mid', budget: 'b2', season: 'spring', weather: 'any', place: 'both', with: 'friend' };
export const BUDGET = { b1: [0, 50], b2: [50, 100], b3: [100, 200], b4: [200, 300], b5: [300, 9999] };
export const condLabel = (k, v) => (COND[k].o.find((x) => x[0] === v) || ['', ''])[1];

export const TYPE_KEYS = ['explorer', 'foodie', 'healer', 'urban'];

export const TYPES = {
  explorer: {
    n: '모험 개척자', col: '#7bbf6a', emoji: '🧭',
    d: '지도 앱보다 자기 직감을 더 믿는 사람이에요. 동행에게 "여기 길 맞아?"를 하루 열 번 듣지만, 결국 제일 멋진 풍경은 당신이 찾아내요. 여행이 끝나면 신발은 너덜너덜, 사진첩은 레전드예요.',
    school: '선생님이 "여기서 기다려" 하면 이미 없어진 학생. 현장체험학습 미아 방송 단골인데, 돌아올 땐 꼭 남들 모르는 지름길이랑 매점 할인 정보를 들고 왔어요. 생활기록부 한 줄 평은 "호기심이 풍부함". 번역하면 "말을 안 들음".',
    quote: '"저 위에 올라가면 뭐가 보일까?"',
    skill: '길 잃고도 더 좋은 곳 찾아내기', weak: '숙소 체크인 시간 까먹기',
    bag: ['등산화', '보조배터리 2개', '정체불명의 지도 앱 5개'],
    souvenir: '돌멩이, 입장권, 그리고 무릎의 영광의 상처',
    stat: { stamina: 95, appetite: 60, plan: 30, vibe: 70, rest: 25 },
    best: ['urban', '둘 다 체력이 넘쳐서 하루 3만 보도 가능한 조합. 숙소는 잠만 자는 곳이에요.'],
    worst: ['healer', '새벽 5시 일출 트레킹을 제안하는 순간 우정에 금이 가요.'],
  },
  foodie: {
    n: '먹방 순례자', col: '#f5a35c', emoji: '🍜',
    d: '관광지는 맛집과 맛집 사이의 이동 경로일 뿐이에요. 하루 다섯 끼가 기본이고, 배가 불러도 "이건 디저트 배"라는 과학적 근거를 제시해요. 여행 경비의 절반은 위장에 투자하는 진정한 미식 투자자예요.',
    school: '2교시 끝나기도 전에 도시락이 이미 비어 있던 학생. 시간표는 못 외워도 급식 메뉴표는 한 달 치를 외웠어요. 수학여행 기억은 "그 휴게소 호두과자"가 전부. 장래희망 칸엔 늘 "맛있는 거 먹는 사람"이라고 썼죠.',
    quote: '"여기까지 왔는데 이건 먹어 봐야지"',
    skill: '구글 지도 별점 4.5 이상만 골라내기', weak: '배불러도 야시장 지나치지 못하기',
    bag: ['소화제', '물티슈', '맛집 리스트 저장한 메모장'],
    souvenir: '현지 과자 한 박스와 늘어난 위장',
    stat: { stamina: 60, appetite: 100, plan: 70, vibe: 55, rest: 50 },
    best: ['healer', '늘어지게 쉬다가 맛집만 쏙쏙 다녀오는 평화 조합이에요.'],
    worst: ['urban', '카페 인테리어 사진 찍는 동안 음식 식는 걸 못 참아요.'],
  },
  healer: {
    n: '느긋한 힐러', col: '#6cc3d5', emoji: '🌴',
    d: '여행 와서까지 바쁘게 살 이유가 없다는 확고한 철학의 소유자예요. 일정표 대신 수영장 오픈 시간을 체크하고, "오늘 뭐 했어?"라는 질문에 "아무것도"라고 당당하게 답해요. 남들이 투어 버스 탈 때 선베드 각도를 연구하는 프로 휴식러예요.',
    school: '쉬는 시간 종 치기 3초 전에 이미 엎드려 있던 학생. 체육대회 땐 응원석 맨 뒷줄 그늘이 지정석이었어요. 수학여행 자유 시간엔 숙소 침대 사진부터 단톡방에 올렸죠. 그런데 이상하게 성적은 멀쩡해서 반 친구들을 열받게 했어요.',
    quote: '"오늘은 숙소에서 쉬자… 내일도"',
    skill: '선베드 명당 1초 만에 찾기', weak: '조식 시간 놓치기',
    bag: ['수영복 3벌', '편한 잠옷', '읽지 않을 책 한 권'],
    souvenir: '태닝 자국과 깊은 숙면의 기억',
    stat: { stamina: 30, appetite: 65, plan: 20, vibe: 85, rest: 100 },
    best: ['foodie', '같이 늘어지다가 맛있는 것만 먹으러 나가는 완벽한 휴가 조합이에요.'],
    worst: ['explorer', '"내일 새벽 5시 출발!" 한마디에 조용히 방문을 잠가요.'],
  },
  urban: {
    n: '도시 산책가', col: '#a58bd8', emoji: '🏙️',
    d: '도시의 공기를 마시면 체력이 차오르는 사람이에요. 골목 하나, 간판 하나에도 감탄하고, 하루 2만 보를 걸어도 "벌써 끝이야?"라고 말해요. 카메라 롤의 절반은 건물 사진, 나머지 절반은 카페 인테리어예요.',
    school: '필통보다 가방에 달린 키링이 더 많던 학생. 교복을 미세하게 줄여 입고 "원래 이래요"를 시전했어요. 수학여행 가면 관광지보다 그 동네 편집숍 위치부터 찾았고, 졸업앨범엔 혼자 필터 낀 것처럼 나왔죠.',
    quote: '"이 골목 너무 예쁘다, 사진 한 장만!"',
    skill: '처음 간 도시에서 핫플 3초 만에 찾기', weak: '캐리어 무게 초과',
    bag: ['카메라', '제일 예쁜 옷 3벌', '빈 캐리어 공간 (쇼핑용)'],
    souvenir: '편집숍 쇼핑백과 카메라 롤 2천 장',
    stat: { stamina: 80, appetite: 60, plan: 90, vibe: 95, rest: 35 },
    best: ['explorer', '골목 탐험에 지칠 줄 모르는 둘. 동선 짜는 사람과 길 찾는 사람이 딱 나뉘어요.'],
    worst: ['foodie', '맛집 웨이팅 2시간 vs 전시 하나 더 보기. 매번 협상 테이블이 열려요.'],
  },
};

export const STAT_LABELS = { stamina: '체력', appetite: '식욕', plan: '계획력', vibe: '감성', rest: '휴식력' };

export const MOD = { explorer: '겁 없는', foodie: '배고픈', healer: '느긋한', urban: '힙한' };
export const NOUN = { explorer: '모험가', foodie: '먹방러', healer: '힐러', urban: '산책가' };
export const COMBO = {
  'explorer-foodie': '산 정상에서도 컵라면 맛집을 찾아내는 사람',
  'explorer-healer': '모험은 좋지만 낮잠 시간은 사수하는 사람',
  'explorer-urban': '뒷골목 탐험 끝에 감성 사진까지 건지는 사람',
  'foodie-explorer': '정체불명 길거리 음식에 제일 먼저 손드는 사람',
  'foodie-healer': '먹고 자고 먹고 자는 게 여행의 완성인 사람',
  'foodie-urban': '웨이팅 맛집도 인스타 감성으로 남기는 사람',
  'healer-explorer': '쉬다가 갑자기 패러글라이딩을 예약하는 사람',
  'healer-foodie': '선베드 위에서 룸서비스 메뉴판을 정독하는 사람',
  'healer-urban': '예쁜 호텔 라운지에서 쉬는 게 최고의 휴식인 사람',
  'urban-explorer': '지도에 없는 골목까지 다 걸어 보는 사람',
  'urban-foodie': '산책 코스가 곧 디저트 투어인 사람',
  'urban-healer': '카페 한 곳에서 세 시간을 버티는 도시 여행자',
};

// 질문 16개 × 선택지 4개 (선택지마다 유형 하나) — 순서는 화면에서 섞어요
export const QS = [
  ['여행 첫날 아침, 눈 뜨자마자 하고 싶은 건?', [['근처 산책로 따라 일단 나가 본다', 'explorer'], ['현지인이 줄 서는 아침 맛집으로 직행', 'foodie'], ['조식 먹고 다시 침대로… 수영장은 오후에', 'healer'], ['커피 들고 동네 골목 구경', 'urban']]],
  ['비행기 좌석을 고른다면?', [['비상구 좌석, 내리자마자 튀어 나가야 해', 'explorer'], ['기내식이 빨리 나오는 앞쪽', 'foodie'], ['창가에서 담요 덮고 숙면', 'healer'], ['창가에서 도시 야경 내려다보기', 'urban']]],
  ['숙소를 고를 때 제일 먼저 보는 건?', [['액티비티 하러 가기 좋은 위치', 'explorer'], ['주변 맛집 거리까지 도보 몇 분인지', 'foodie'], ['수영장, 침구, 바다 뷰', 'healer'], ['디자인이 예쁜 부티크 호텔인지', 'urban']]],
  ['일정표는 어떻게 짜요?', [['큰 틀만, 나머지는 그날 기분대로', 'explorer'], ['맛집 예약 시간 기준으로 동선 짜기', 'foodie'], ['하루에 하나만. 나머지는 휴식', 'healer'], ['시간 단위 엑셀 표, 플랜 B까지', 'urban']]],
  ['여행 사진첩을 열면 가장 많은 사진은?', [['풍경, 그리고 정상에서 찍은 인증샷', 'explorer'], ['음식. 음식. 음식.', 'foodie'], ['수영장에 발 담근 사진', 'healer'], ['건물, 간판, 카페 인테리어', 'urban']]],
  ['갑자기 비가 쏟아진다! 나는?', [['우비 입고 그냥 계획대로 간다', 'explorer'], ['비 오는 날엔 국물. 근처 라멘집 검색', 'foodie'], ['오히려 좋아, 숙소에서 낮잠과 마사지', 'healer'], ['미술관, 서점, 쇼핑몰 코스로 변경', 'urban']]],
  ['동행이 "오늘 뭐 할까?" 물으면', [['근교 가는 아무 버스나 타 보자', 'explorer'], ['어제 찾아둔 맛집 리스트 공개', 'foodie'], ['오늘은 숙소 데이… 아무것도 안 할래', 'healer'], ['새로 생긴 전시랑 편집숍 코스 어때?', 'urban']]],
  ['여행 가방 속 절대 못 빼는 필수템은?', [['등산화와 보조배터리', 'explorer'], ['소화제와 물티슈', 'foodie'], ['편한 잠옷과 수영복', 'healer'], ['카메라와 제일 예쁜 옷', 'urban']]],
  ['돈을 아끼지 않는 항목은?', [['스카이다이빙 같은 체험·투어', 'explorer'], ['코스요리 한 번은 꼭', 'foodie'], ['좋은 숙소, 스파', 'healer'], ['쇼핑과 공연 티켓', 'urban']]],
  ['처음 보는 낯선 음식이 나왔다', [['일단 먹어 본다. 인생은 모험', 'explorer'], ['재료부터 조리법까지 물어보고 감동', 'foodie'], ['아는 맛이 최고… 볶음밥 시킬게', 'healer'], ['플레이팅이 예쁘면 사진부터', 'urban']]],
  ['여행 중 가장 행복한 순간은?', [['정상에 올라 풍경을 내려다볼 때', 'explorer'], ['첫 입 먹고 눈이 커질 때', 'foodie'], ['선베드에서 스르르 잠들 때', 'healer'], ['골목 끝에서 예쁜 카페를 발견할 때', 'urban']]],
  ['예상치 못한 일정 변경! 나의 반응은?', [['오히려 좋아, 새로운 곳 가 보자', 'explorer'], ['그럼 근처 맛집이나 가자', 'foodie'], ['잘됐다, 숙소에서 쉬자', 'healer'], ['대체 코스 검색 들어갑니다', 'urban']]],
  ['저녁 8시, 나는 어디에 있을까?', [['야간 트레킹이나 반딧불 투어', 'explorer'], ['야시장에서 세 번째 꼬치 먹는 중', 'foodie'], ['숙소에서 컵라면과 넷플릭스', 'healer'], ['루프탑 바에서 야경 감상', 'urban']]],
  ['기념품으로 꼭 사 오는 건?', [['현지 등산 배지나 지도', 'explorer'], ['현지 간식과 소스', 'foodie'], ['아로마 오일, 입욕제', 'healer'], ['디자인 소품, 편집숍 굿즈', 'urban']]],
  ['여행 브이로그를 찍는다면 장르는?', [['드론으로 찍은 대자연', 'explorer'], ['ASMR 먹방', 'foodie'], ['파도 소리 3시간 힐링 영상', 'healer'], ['감성 시티 워크 영상', 'urban']]],
  ['여행 다녀와서 가장 자랑하고 싶은 건?', [['남들 안 가본 곳에 다녀온 것', 'explorer'], ['그 나라 대표 음식을 다 먹어 본 것', 'foodie'], ['진짜 제대로 쉬다 온 것', 'healer'], ['그 도시의 핫플을 다 가본 것', 'urban']]],
];

// 여행지 태그 점수 → 유형 궁합 (0~3)
export function typeFit(d) {
  return {
    explorer: Math.max(d.nature, d.activity),
    foodie: d.food,
    healer: Math.round((d.beach * 2 + d.romance) / 3),
    urban: Math.max(d.city_life, d.culture),
  };
}
const placeOf = (d) => (d.beach >= 3 && d.city_life <= 1 ? 'resort' : d.city_life >= 2 && d.beach <= 1 ? 'city' : 'both');
// 대략적인 1인 경비 (만원): 비행시간과 물가 수준으로 계산
export function costOf(d) {
  const f = Number(d.flight_hours);
  const air = f <= 3 ? 30 : f <= 7 ? 50 : f <= 11 ? 110 : 150;
  const perDay = [0, 10, 18, 28][d.budget];
  const days = f <= 3 ? 3 : f <= 7 ? 4 : 7;
  const min = Math.round((air + perDay * days * 0.8) / 10) * 10;
  return [min, Math.round((air * 1.4 + perDay * days * 1.4) / 10) * 10];
}
export const daysOf = (d) => { const f = Number(d.flight_hours); return f <= 3.5 ? ['short', 'mid'] : f <= 8 ? ['mid', 'long'] : ['long']; };
export const stayOf = (d) => { const f = Number(d.flight_hours); return f <= 3.5 ? '2박 3일~3박 4일' : f <= 8 ? '3박 5일~4박 6일' : '6박 8일 이상'; };

export function compute(answers, cond, dests) {
  const sc = { explorer: 0, foodie: 0, healer: 0, urban: 0 };
  const picked = { explorer: [], foodie: [], healer: [], urban: [] };
  answers.forEach((a, i) => {
    const o = QS[i] && QS[i][1][a];
    if (!o) throw new Error(`${i + 1}번 질문의 답이 올바르지 않아요.`);
    sc[o[1]]++; picked[o[1]].push(o[0]);
  });
  const order = TYPE_KEYS.slice().sort((x, y) => sc[y] - sc[x]);
  const type = order[0];
  const [bmin, bmax] = BUDGET[cond.budget] || BUDGET.b2;

  const ranked = dests.filter((d) => d.advisory_level < 4).map((d) => {
    const t = typeFit(d); const det = d.details || {};
    const cost = costOf(d); const days = daysOf(d); const p = placeOf(d);
    let s = 0; const why = [];
    TYPE_KEYS.forEach((k) => (s += t[k] * sc[k]));
    s += t[type] * 4 + t[order[1]] * 1.5;
    why.push(t[type] >= 2 ? `${TYPES[type].n} 유형과 찰떡: ${det.fit || d.summary}` : det.fit || d.summary);
    if (cond.place !== 'both' && p !== cond.place && p !== 'both') s -= 12;
    else if (cond.place !== 'both') why.push(`원하는 ${condLabel('place', cond.place)} 여행에 맞아요`);
    if (cond.weather !== 'any') {
      if (d.climate === cond.weather) { s += 6; why.push(`원하는 날씨(${condLabel('weather', cond.weather)})예요`); }
      else if (d.climate !== 'mild') s -= 8;
    }
    if (cost[0] > bmax) s -= 14;
    else if (cost[1] < bmin) s -= 2;
    else { s += 6; why.push(`예산 ${condLabel('budget', cond.budget)} 안에서 다녀올 수 있어요`); }
    if (days.includes(cond.days)) { s += 6; why.push(`${condLabel('days', cond.days)} 일정에 알맞아요`); } else s -= 10;
    if ((det.bad || []).includes(cond.season)) s -= 6;
    if ((det.good || []).includes(cond.season)) { s += 4; why.push(`${condLabel('season', cond.season)}이 딱 좋은 시기예요`); }
    if (cond.with === 'family' && d.family_friendly) { s += 5; why.push('가족 여행에 좋아요'); }
    if (cond.with === 'couple') { s += d.romance * 2; if (d.romance >= 3) why.push('연인과 가기 좋은 낭만 여행지예요'); }
    if (cond.with === 'solo' && d.crowd >= 2 && d.culture >= 2) { s += 2; why.push('혼자 다니기 편한 곳이에요'); }
    if (cond.with === 'friend' && d.activity >= 2) s += 2;
    if (d.advisory_level === 3) s -= 12;
    if (d.advisory_level === 2) s -= 3;
    return { id: d.id, s, why };
  }).sort((a, b) => b.s - a.s);

  // 상위 3곳 (되도록 서로 다른 나라)
  const byId = Object.fromEntries(dests.map((d) => [d.id, d]));
  const top = [];
  for (const r of ranked) {
    if (top.length >= 3) break;
    if (top.some((x) => byId[x.id].country === byId[r.id].country)) continue;
    top.push(r);
  }
  const max = ranked[0]?.s || 1;
  top.forEach((r) => (r.match = Math.max(62, Math.min(99, Math.round(70 + (r.s / max) * 29)))));
  return { sc, picked, order, type, top };
}

export function comboName(order) { return `${MOD[order[1]]} ${NOUN[order[0]]}`; }

export function statsOf(sc) {
  const total = Object.values(sc).reduce((a, b) => a + b, 0) || 1;
  const out = {};
  Object.keys(STAT_LABELS).forEach((k) => {
    out[k] = Math.round(TYPE_KEYS.reduce((sum, t) => sum + TYPES[t].stat[k] * (sc[t] / total), 0));
  });
  return out;
}
