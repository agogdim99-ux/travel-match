// 결과지에서 '주의 필요' 여행지를 빨갛게 보여 주고, 외교부 + 관련 뉴스 링크를 달아요.
export function CautionTag() {
  return <span className="caution-tag">⚠️ 주의 필요</span>;
}

export default function CautionBox({ d, compact = false }) {
  if (!d?.caution && !d?.advisory_note) return null;
  if (!d.caution) return <p className="note-soft">ℹ️ {d.advisory_note}</p>;
  return (
    <div className={`caution ${compact ? 'compact' : ''}`}>
      <p className="caution-title"><CautionTag /> {d.country} {d.city}</p>
      {d.advisory_note && <p className="caution-text">{d.advisory_note}</p>}
      <div className="caution-links">
        <a href="https://www.0404.go.kr" target="_blank" rel="noreferrer">🏛 외교부 해외안전여행에서 확인</a>
        {d.news_url && (
          <a href={d.news_url} target="_blank" rel="noreferrer">📰 {d.news_title || '관련 뉴스 보기'}</a>
        )}
      </div>
    </div>
  );
}
