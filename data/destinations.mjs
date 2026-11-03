// 여행지 66곳 — 이 파일이 원본이에요. `npm run seed-sql`로 supabase/seed.sql을 다시 만들 수 있어요.
// 태그 점수(0~3): beach 바다·휴양 / city_life 도시·쇼핑 / nature 자연·풍경 / culture 역사·문화
//                food 미식 / activity 액티비티 / romance 낭만·신혼
// crowd 붐비는 정도(1 한적~3 북적), budget 예산(1 저렴~3 비쌈), flight 인천 출발 대략 비행시간
// climate: warm 따뜻 / mild 온화 / cool 선선, family: 가족여행에 좋은지, pair: 함께 가면 좋은 곳
// caution: 결과지에 빨간 '주의 필요' 표시 (경보 2단계 이상이면 자동), newsTitle/newsUrl: 관련 뉴스
// adv: 여행경보 단계(0 없음, 1 여행유의, 2 여행자제, 3 출국권고, 4 여행금지) — 참고용, 외교부에서 꼭 확인

const d = (id, country, city, region, emoji, summary, t, o = {}) => ({
  id, country, city, region, emoji, summary,
  beach: t[0], city_life: t[1], nature: t[2], culture: t[3], food: t[4], activity: t[5], romance: t[6],
  crowd: o.crowd ?? 2, budget: o.budget ?? 2, flight_hours: o.flight ?? 3,
  climate: o.climate ?? 'mild', family_friendly: o.family ?? false,
  pair_id: o.pair ?? null, advisory_level: o.adv ?? 0, advisory_note: o.note ?? null,
  caution: o.caution ?? (o.adv ?? 0) >= 2, news_title: o.newsTitle ?? null, news_url: o.newsUrl ?? null,
});

//                                                                                       바 도 자 역 미 액 낭
export const destinations = [
  // ── 일본
  d('tokyo', '일본', '도쿄', '동아시아', '🗼', '트렌드와 쇼핑, 끝없는 맛집이 있는 대도시', [0,3,0,2,3,1,1], { crowd: 3, flight: 2.5, family: true }),
  d('osaka', '일본', '오사카', '동아시아', '🐙', '먹다 지칠 때까지! 길거리 음식과 유니버설 스튜디오', [0,2,0,2,3,2,1], { crowd: 3, flight: 1.8, family: true }),
  d('fukuoka', '일본', '후쿠오카', '동아시아', '🍜', '1시간 비행으로 떠나는 라멘·야타이 미식 여행', [1,2,0,1,3,0,1], { budget: 1, flight: 1.3 }),
  d('hokkaido', '일본', '홋카이도', '동아시아', '🦀', '눈과 온천, 바다에서 갓 잡은 해산물·회의 땅', [2,1,2,1,3,1,1], { climate: 'cool', flight: 3, family: true }),
  d('okinawa', '일본', '오키나와', '동아시아', '🐠', '에메랄드빛 바다와 느긋한 섬 드라이브', [3,0,2,1,1,2,2], { climate: 'warm', flight: 2.2, family: true }),
  d('matsuyama', '일본', '마쓰야마', '동아시아', '♨️', '3천 년 역사의 도고 온천이 있는 한적한 소도시', [1,0,2,2,2,0,2], { crowd: 1, budget: 1, flight: 1.7 }),
  d('takamatsu', '일본', '다카마쓰', '동아시아', '🎨', '예술섬 나오시마와 쫄깃한 사누키 우동', [2,0,2,3,2,1,1], { crowd: 1, budget: 1, flight: 1.8 }),
  d('shizuoka', '일본', '시즈오카', '동아시아', '🗻', '후지산 뷰와 녹차밭, 조용한 힐링 여행', [1,0,3,1,2,1,2], { crowd: 1, budget: 1, flight: 2 }),
  // ── 대만
  d('taipei', '대만', '타이베이', '동아시아', '🧋', '야시장 먹방과 지우펀 감성, 가성비 최고', [0,2,1,2,3,1,1], { budget: 1, flight: 2.5, family: true, caution: true, note: '외교부 여행경보는 없지만, 최근 중국 군함 전개 등 대만해협 긴장이 커지고 있어요. 출발 전 최신 정세를 확인하세요.', newsTitle: '서울신문 (2026.10.29) — 대만 코앞에 몰려든 중국 군함 53척', newsUrl: 'https://www.seoul.co.kr/news/international/china/2026/10/29/20261029500205' }),
  d('kaohsiung', '대만', '가오슝', '동아시아', '⛴️', '바다를 낀 항구 도시의 여유로운 산책', [2,1,1,1,2,0,1], { crowd: 1, budget: 1, climate: 'warm', flight: 2.8, caution: true, note: '외교부 여행경보는 없지만, 최근 중국 군함 전개 등 대만해협 긴장이 커지고 있어요. 출발 전 최신 정세를 확인하세요.', newsTitle: '서울신문 (2026.10.29) — 대만 코앞에 몰려든 중국 군함 53척', newsUrl: 'https://www.seoul.co.kr/news/international/china/2026/10/29/20261029500205' }),
  // ── 중국
  d('shanghai', '중국', '상하이', '동아시아', '🌃', '와이탄 야경과 옛 거리가 공존하는 도시', [0,3,0,2,2,0,2], { crowd: 3, flight: 2 }),
  d('zhangjiajie', '중국', '장자제', '동아시아', '⛰️', '영화 속 같은 기암괴석 절경', [0,0,3,1,1,2,0], { crowd: 2, budget: 1, flight: 3, family: true }),
  // ── 홍콩·마카오
  d('hongkong', '홍콩', '홍콩', '동아시아', '🌉', '100만 불짜리 야경과 딤섬, 쇼핑 천국', [0,3,1,1,3,0,1], { crowd: 3, budget: 3, climate: 'warm', flight: 3.5, pair: 'macau' }),
  d('macau', '마카오', '마카오', '동아시아', '🎰', '포르투갈풍 골목과 화려한 리조트', [0,2,0,2,2,1,2], { crowd: 2, budget: 3, climate: 'warm', flight: 3.5, pair: 'hongkong' }),
  // ── 베트남
  d('danang', '베트남', '다낭', '동남아시아', '🏖️', '가족 여행 1순위, 해변과 바나힐', [3,1,1,1,2,1,1], { crowd: 2, budget: 1, climate: 'warm', flight: 4.5, family: true }),
  d('nhatrang', '베트남', '나트랑', '동남아시아', '🏝️', '리조트에서 푹 쉬는 가성비 휴양지', [3,0,1,0,2,2,2], { budget: 1, climate: 'warm', flight: 5 }),
  d('phuquoc', '베트남', '푸꾸옥', '동남아시아', '🌅', '석양이 아름다운 섬, 신혼여행지로 인기', [3,0,2,0,2,1,3], { crowd: 1, budget: 2, climate: 'warm', flight: 5.5 }),
  d('hanoi', '베트남', '하노이', '동남아시아', '🛶', '쌀국수의 본고장과 하롱베이 절경', [1,1,3,3,3,1,0], { budget: 1, flight: 4.5 }),
  // ── 태국
  d('bangkok', '태국', '방콕', '동남아시아', '🛕', '사원·야시장·마사지, 밤이 더 즐거운 도시', [0,3,0,2,3,1,1], { crowd: 3, budget: 1, climate: 'warm', flight: 6, adv: 1, note: '태국 남부 일부·캄보디아 접경 지역은 더 높은 단계' }),
  d('phuket', '태국', '푸껫', '동남아시아', '🚤', '섬 투어와 스노클링, 활기찬 해변', [3,1,1,0,2,3,2], { crowd: 3, climate: 'warm', flight: 6.5, family: true, adv: 1, note: '태국 남부 일부 지역은 더 높은 단계' }),
  d('chiangmai', '태국', '치앙마이', '동남아시아', '🐘', '카페와 사원, 산속 느린 여행', [0,0,2,3,2,1,1], { crowd: 1, budget: 1, flight: 6, adv: 1, note: '참고: 태국 전역 여행경보 확인 필요' }),
  // ── 인도네시아
  d('bali', '인도네시아', '발리', '동남아시아', '🌺', '서핑과 라이스테라스, 감성 리조트', [3,0,2,2,1,3,3], { climate: 'warm', flight: 7, adv: 1, note: '화산 활동 정보 수시 확인' }),
  // ── 필리핀
  d('cebu', '필리핀', '세부', '동남아시아', '🐋', '가깝고 저렴한 바다, 호핑·스노클링', [3,0,1,0,1,3,1], { budget: 1, climate: 'warm', flight: 4.5, family: true, adv: 1, note: '필리핀 일부 지역(민다나오 등)은 여행금지' }),
  d('boracay', '필리핀', '보라카이', '동남아시아', '🐚', '세계적인 화이트비치에서 노을 보기', [3,0,1,0,1,2,3], { climate: 'warm', flight: 4.5, adv: 1, note: '필리핀 일부 지역(민다나오 등)은 여행금지' }),
  // ── 싱가포르·말레이시아
  d('singapore', '싱가포르', '싱가포르', '동남아시아', '🦁', '깨끗하고 안전한 도시, 가족 여행에 딱', [1,3,1,1,3,2,1], { crowd: 3, budget: 3, climate: 'warm', flight: 6.5, family: true }),
  d('kualalumpur', '말레이시아', '쿠알라룸푸르', '동남아시아', '🏙️', '쌍둥이 빌딩과 다문화 음식, 가성비 도시', [0,3,1,2,2,0,0], { budget: 1, climate: 'warm', flight: 6.5 }),
  d('kotakinabalu', '말레이시아', '코타키나발루', '동남아시아', '🌄', '세계 3대 석양과 반딧불 투어', [3,0,3,0,1,2,2], { crowd: 1, budget: 1, climate: 'warm', flight: 5, family: true, adv: 1, note: '사바주 동부 해안은 별도 주의' }),
  // ── 미국·미국령
  d('newyork', '미국', '뉴욕', '아메리카', '🗽', '뮤지컬·미술관·센트럴파크, 모든 게 있는 도시', [0,3,1,3,3,1,2], { crowd: 3, budget: 3, flight: 14, family: true }),
  d('losangeles', '미국', 'LA', '아메리카', '🎬', '할리우드와 테마파크, 캘리포니아 햇살', [2,3,1,1,2,3,1], { crowd: 3, budget: 3, climate: 'warm', flight: 11, family: true }),
  d('lasvegas', '미국', '라스베이거스', '아메리카', '🎲', '화려한 쇼와 그랜드캐니언 투어', [0,3,3,0,2,3,1], { crowd: 3, budget: 3, climate: 'warm', flight: 12 }),
  d('hawaii', '미국', '하와이', '아메리카', '🌺', '와이키키 해변과 화산 섬 드라이브', [3,1,3,1,2,3,3], { budget: 3, climate: 'warm', flight: 8.5, family: true }),
  d('guam', '미국', '괌', '오세아니아', '🐢', '4시간 거리의 맑은 바다, 가족 휴양 1순위', [3,2,1,0,1,2,2], { budget: 2, climate: 'warm', flight: 4, family: true }),
  d('saipan', '미국', '사이판', '오세아니아', '🤿', '조용한 섬에서 즐기는 다이빙과 휴식', [3,0,2,1,1,3,2], { crowd: 1, climate: 'warm', flight: 4.5, family: true }),
  // ── 캐나다·멕시코
  d('banff', '캐나다', '밴프', '아메리카', '🏞️', '로키산맥의 에메랄드빛 호수', [0,0,3,0,1,3,2], { crowd: 1, budget: 3, climate: 'cool', flight: 11, family: true }),
  d('quebec', '캐나다', '퀘벡', '아메리카', '🍁', '북미 속 작은 유럽, 동화 같은 구시가지', [0,1,1,3,2,0,3], { crowd: 1, budget: 3, climate: 'cool', flight: 14 }),
  d('cancun', '멕시코', '칸쿤', '아메리카', '🍹', '카리브해 올인클루시브 리조트', [3,1,1,1,2,2,3], { budget: 3, climate: 'warm', flight: 16, adv: 1, note: '멕시코 일부 주는 더 높은 단계' }),
  // ── 몰디브
  d('maldives', '몰디브', '몰디브', '남아시아', '🐬', '바다 위 수상빌라, 꿈의 신혼여행지', [3,0,2,0,2,1,3], { crowd: 1, budget: 3, climate: 'warm', flight: 10 }),
  // ── 호주
  d('sydney', '호주', '시드니', '오세아니아', '🦘', '오페라하우스와 본다이 비치', [2,3,2,1,2,2,2], { budget: 3, flight: 10.5, family: true }),
  d('melbourne', '호주', '멜버른', '오세아니아', '☕', '골목 카페와 예술, 그레이트오션로드', [1,2,2,2,3,1,2], { budget: 3, climate: 'cool', flight: 11 }),
  d('cairns', '호주', '케언즈', '오세아니아', '🪸', '세계 최대 산호초 그레이트배리어리프', [3,0,3,0,1,3,1], { crowd: 1, budget: 3, climate: 'warm', flight: 10, family: true }),
  // ── 유럽
  d('paris', '프랑스', '파리', '유럽', '🥐', '에펠탑과 루브르, 낭만의 대명사', [0,3,0,3,3,0,3], { crowd: 3, budget: 3, flight: 14, adv: 1, note: '참고: 테러 위협 관련 여행유의' }),
  d('nice', '프랑스', '니스', '유럽', '🌊', '푸른 지중해와 남프랑스 소도시', [3,1,1,1,2,1,3], { budget: 3, climate: 'warm', flight: 15, adv: 1, note: '참고: 테러 위협 관련 여행유의' }),
  d('barcelona', '스페인', '바르셀로나', '유럽', '🏛️', '가우디 건축과 해변, 타파스', [2,2,0,3,3,1,2], { crowd: 3, budget: 2, climate: 'warm', flight: 15 }),
  d('seville', '스페인', '세비야', '유럽', '💃', '플라멩코와 오렌지나무 골목', [0,1,0,3,2,0,3], { crowd: 2, budget: 2, climate: 'warm', flight: 16 }),
  d('rome', '이탈리아', '로마', '유럽', '🏟️', '도시 전체가 박물관인 고대 로마', [0,2,0,3,3,0,2], { crowd: 3, budget: 2, climate: 'warm', flight: 14 }),
  d('florence', '이탈리아', '피렌체', '유럽', '🍷', '르네상스 미술과 토스카나 와인', [0,1,1,3,3,0,3], { crowd: 2, budget: 2, flight: 15 }),
  d('venice', '이탈리아', '베네치아', '유럽', '🛶', '곤돌라 타고 물의 도시 산책', [1,1,0,3,2,0,3], { crowd: 3, budget: 3, flight: 15 }),
  d('london', '영국', '런던', '유럽', '💂', '무료 박물관과 뮤지컬, 클래식한 도시', [0,3,1,3,1,0,1], { crowd: 3, budget: 3, climate: 'cool', flight: 14, family: true, adv: 1, note: '참고: 테러 위협 관련 여행유의' }),
  d('munich', '독일', '뮌헨', '유럽', '🍺', '맥주와 소시지, 동화 속 노이슈반슈타인 성', [0,1,2,2,3,0,1], { budget: 2, climate: 'cool', flight: 13 }),
  d('berlin', '독일', '베를린', '유럽', '🧱', '분단의 역사와 힙한 예술 문화', [0,2,0,3,1,0,0], { crowd: 2, budget: 2, climate: 'cool', flight: 13 }),
  d('santorini', '그리스', '산토리니', '유럽', '🤍', '하얀 집과 파란 지붕, 세계 최고의 석양', [3,0,2,1,2,0,3], { crowd: 1, budget: 3, climate: 'warm', flight: 13 }),
  d('athens', '그리스', '아테네', '유럽', '🏺', '파르테논 신전과 고대 그리스 이야기', [1,1,0,3,2,0,1], { budget: 2, climate: 'warm', flight: 14 }),
  d('vienna', '오스트리아', '빈', '유럽', '🎻', '클래식 음악과 우아한 카페 문화', [0,2,0,3,2,0,3], { crowd: 2, budget: 2, climate: 'cool', flight: 13 }),
  d('hallstatt', '오스트리아', '할슈타트', '유럽', '🏘️', '호수에 비친 동화 같은 마을', [0,0,3,2,1,0,3], { crowd: 1, budget: 2, climate: 'cool', flight: 14 }),
  d('lisbon', '포르투갈', '리스본', '유럽', '🚋', '노란 트램과 에그타르트, 가성비 유럽', [1,2,0,3,3,0,2], { budget: 1, climate: 'warm', flight: 16 }),
  d('porto', '포르투갈', '포르투', '유럽', '🍷', '강변 와인 창고와 아줄레주 타일 골목', [1,1,1,2,3,0,3], { crowd: 1, budget: 1, flight: 16 }),
  d('amsterdam', '네덜란드', '암스테르담', '유럽', '🌷', '운하 자전거 여행과 반 고흐 미술관', [0,2,1,3,1,1,2], { budget: 3, climate: 'cool', flight: 13 }),
  d('interlaken', '스위스', '인터라켄', '유럽', '🏔️', '융프라우와 패러글라이딩, 알프스 그 자체', [0,0,3,0,1,3,2], { crowd: 2, budget: 3, climate: 'cool', flight: 13, family: true }),
  d('istanbul', '튀르키예', '이스탄불', '유럽', '🕌', '동서양이 만나는 도시, 바자르와 케밥', [1,3,0,3,3,0,1], { crowd: 3, budget: 1, flight: 11, adv: 1, note: '시리아 접경 동남부는 더 높은 단계' }),
  d('cappadocia', '튀르키예', '카파도키아', '유럽', '🎈', '새벽 하늘을 수놓는 열기구', [0,0,3,2,1,3,3], { crowd: 1, budget: 2, flight: 12, adv: 1, note: '시리아 접경 동남부는 더 높은 단계' }),
  // ── 중동·아프리카
  d('dubai', '아랍에미리트', '두바이', '중동·아프리카', '🏜️', '초고층 빌딩과 사막 사파리, 럭셔리 여행', [2,3,1,1,2,3,2], { crowd: 3, budget: 3, climate: 'warm', flight: 10, family: true, adv: 2, note: '2026년 3월 중동 정세로 특별여행주의보가 발령됐어요. 지금 단계는 외교부에서 꼭 확인하세요.', newsTitle: 'SAT경제 (2026.3.2) — UAE·사우디 등 중동 7개국 특별여행주의보', newsUrl: 'https://sateconomy.co.kr/news/view/1065605621941478' }),
  d('cairo', '이집트', '카이로', '중동·아프리카', '🐫', '피라미드와 스핑크스, 5천 년 역사', [0,1,1,3,1,1,0], { budget: 1, climate: 'warm', flight: 14, adv: 2, note: '시나이반도 등 일부 지역은 더 높은 단계' }),
];

// 홈 화면용 여행금지(4단계) 정보 — 2026-07-09 외교부 여권정책협의 결정, 2027-01-31까지
export const advisories = [
  ...['소말리아','아프가니스탄','이라크','예멘','리비아','우크라이나','수단','아이티','말리','이란']
    .map((country) => ({ country, level: 4, note: '국가 전역 여행금지', base_date: '2026-07-09' })),
  { country: '필리핀', level: 4, note: '잠보앙가 반도, 술루·바실란·타위타위 군도', base_date: '2026-07-09' },
  { country: '러시아', level: 4, note: '쿠르스크주 및 우크라이나 접경 30km', base_date: '2026-07-09' },
  { country: '이스라엘·레바논', level: 4, note: '양국 접경 지역 및 레바논 남부 일부', base_date: '2026-07-09' },
  { country: '팔레스타인', level: 4, note: '가자 지구', base_date: '2026-07-09' },
  { country: '미얀마', level: 4, note: '샨주 북부·동부, 까야주, 라카인주 등', base_date: '2026-07-09' },
  { country: '라오스', level: 4, note: '골든트라이앵글 경제특구', base_date: '2026-07-09' },
  { country: '벨라루스', level: 4, note: '우크라이나 접경 30km', base_date: '2026-07-09' },
  { country: '시리아', level: 4, note: '골란고원 일부 등', base_date: '2026-07-09' },
  { country: '콩고민주공화국', level: 4, note: '북키부·남키부·이투리주', base_date: '2026-07-09' },
  { country: '니제르', level: 4, note: '수도 니아메 제외 지역', base_date: '2026-07-09' },
];
