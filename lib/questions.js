// 테스트 질문 8개. 각 선택지가 어떤 값에 영향을 주는지 적어 둬요.
export const questions = [
  {
    id: 'scene', q: '여행지에서 눈 뜨자마자 보고 싶은 풍경은?',
    options: [
      { label: '🏖️ 끝없이 펼쳐진 바다', w: { beach: 3 } },
      { label: '🏔️ 산과 호수, 초록 숲', w: { nature: 3 } },
      { label: '🌃 반짝이는 도시 스카이라인', w: { city_life: 3 } },
      { label: '🏛️ 오래된 골목과 성당', w: { culture: 3 } },
    ],
  },
  {
    id: 'mustdo', q: '이번 여행에서 꼭 하고 싶은 건?',
    options: [
      { label: '🍽️ 현지 맛집 도장 깨기', w: { food: 3 } },
      { label: '🛍️ 쇼핑하고 핫플 구경', w: { city_life: 2 } },
      { label: '🤿 스노클링·하이킹 같은 액티비티', w: { activity: 3 } },
      { label: '🖼️ 박물관·유적에서 이야기 듣기', w: { culture: 2 } },
    ],
  },
  {
    id: 'climate', q: '어떤 날씨가 좋아요?',
    options: [
      { label: '☀️ 반팔 입는 따뜻한 날씨', climate: 'warm' },
      { label: '🍂 산책하기 좋은 선선한 날씨', climate: 'cool' },
      { label: '🙆 날씨는 상관없어요', climate: 'any' },
    ],
  },
  {
    id: 'food', q: '여행 가서 제일 먹고 싶은 건?',
    options: [
      { label: '🦐 싱싱한 해산물·회', w: { food: 1, beach: 1 } },
      { label: '🍢 시끌벅적 길거리 음식', w: { food: 2, city_life: 1 } },
      { label: '🍷 분위기 좋은 레스토랑과 와인', w: { food: 1, romance: 1 } },
      { label: '🥐 카페와 디저트', w: { food: 1, culture: 1 } },
    ],
  },
  {
    id: 'with', q: '누구와 함께 가나요?',
    options: [
      { label: '🎒 혼자', w: { culture: 1 } },
      { label: '👯 친구', w: { activity: 1, city_life: 1 } },
      { label: '💑 연인·배우자', w: { romance: 3 } },
      { label: '👨‍👩‍👧 가족', family: true },
    ],
  },
  {
    id: 'days', q: '여행 기간은 얼마나 돼요?',
    options: [
      { label: '⚡ 2~3일 짧게', maxFlight: 4 },
      { label: '🗓️ 4~6일 적당히', maxFlight: 8 },
      { label: '✈️ 일주일 이상 길게', maxFlight: 99, longHaul: true },
    ],
  },
  {
    id: 'budget', q: '예산은 어느 정도예요?',
    options: [
      { label: '💸 가볍게, 가성비 최고로', budget: 1 },
      { label: '💳 적당히 쓸 땐 써요', budget: 2 },
      { label: '💎 이번엔 넉넉하게!', budget: 3 },
    ],
  },
  {
    id: 'crowd', q: '어떤 분위기가 더 끌려요?',
    options: [
      { label: '🎉 사람 많은 핫플이 좋아요', crowd: 3 },
      { label: '🍃 한적한 소도시가 좋아요', crowd: 1 },
      { label: '😊 둘 다 괜찮아요', crowd: 0 },
    ],
  },
];
