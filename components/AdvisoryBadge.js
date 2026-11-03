const LEVELS = {
  0: { label: '특별 경보 없음', cls: 'lv0' },
  1: { label: '1단계 여행유의', cls: 'lv1' },
  2: { label: '2단계 여행자제', cls: 'lv2' },
  3: { label: '3단계 출국권고', cls: 'lv3' },
  4: { label: '4단계 여행금지', cls: 'lv4' },
};

export default function AdvisoryBadge({ level = 0 }) {
  const l = LEVELS[level] ?? LEVELS[0];
  return <span className={`badge ${l.cls}`}>{l.label}</span>;
}
