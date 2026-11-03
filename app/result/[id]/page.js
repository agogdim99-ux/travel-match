'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdvisoryBadge from '@/components/AdvisoryBadge';
import Loading from '@/components/Loading';
import MemoEditor from '@/components/MemoEditor';
import CautionBox from '@/components/CautionBox';
import { getOwnerKey } from '@/lib/owner';

const TAG_LABELS = { beach: '바다·휴양', city_life: '도시·쇼핑', nature: '자연·풍경', culture: '역사·문화', food: '미식', activity: '액티비티', romance: '낭만' };

function topTags(d) {
  return Object.keys(TAG_LABELS).filter((t) => d[t] >= 3).map((t) => TAG_LABELS[t]);
}

export default function ResultPage() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/results/${id}?owner=${getOwnerKey() ?? ''}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setR(data);
      })
      .catch((e) => setErr(e.message || '결과를 불러오지 못했어요.'));
  }, [id]);

  if (err) return <section className="card narrow"><p className="error">{err}</p><Link href="/test" className="btn primary">테스트 하러 가기</Link></section>;
  if (!r) return <Loading />;

  const t = r.top;
  return (
    <>
      <p className="eyebrow center">{r.nickname} 님에게 딱 맞는 여행지는</p>

      <article className={`ticket ${t.caution ? 'warn' : ''}`}>
        <div className="ticket-main">
          <p className="mono small">BOARDING PASS · ICN → {t.city}</p>
          <div className="dest-emoji">{t.emoji}</div>
          <h1 className="dest-name">{t.city}</h1>
          <p className="dest-country">{t.country} · {t.region}</p>
          <p className="dest-summary">{t.summary}</p>
          <div className="chips">{topTags(t).map((x) => <span key={x} className="chip">{x}</span>)}</div>
        </div>
        <div className="ticket-stub">
          <div><p className="mono tiny">FLIGHT</p><p className="mono">약 {Number(t.flight_hours)}시간</p></div>
          <div><p className="mono tiny">BUDGET</p><p className="mono">{'₩'.repeat(t.budget)}</p></div>
          <div>
            <p className="mono tiny">SAFETY</p>
            <AdvisoryBadge level={t.advisory_level} />
          </div>
        </div>
      </article>

      <CautionBox d={t} />

      {r.pair && (
        <section className="card pair">
          <h2>🧳 함께 가면 좋은 곳</h2>
          <p><strong>{r.pair.emoji} {r.pair.city}</strong> — {r.pair.summary}</p>
          {r.pair.caution && <CautionBox d={r.pair} compact />}
        </section>
      )}

      <section className="card">
        <h2>이런 곳도 잘 맞아요</h2>
        <div className="grid2">
          {r.candidates.map((c) => (
            <div key={c.id} className="mini">
              <p className="mini-title">{c.emoji} {c.city} <span className="muted small">{c.country}</span></p>
              <p className="small">{c.summary}</p>
              <AdvisoryBadge level={c.advisory_level} />
              {c.caution && <CautionBox d={c} compact />}
            </div>
          ))}
        </div>
      </section>

      {r.isMine ? (
        <section className="card">
          <h2>📝 메모 남기기</h2>
          <MemoEditor id={r.id} initial={r.memo} />
        </section>
      ) : (
        r.memo && <section className="card"><h2>📝 메모</h2><p>{r.memo}</p></section>
      )}

      <div className="row center gap">
        <Link href="/test" className="btn">다시 테스트</Link>
        <Link href="/my" className="btn">내 기록 보기</Link>
        <button
          className="btn primary"
          onClick={() => navigator.clipboard?.writeText(location.href).then(() => setCopied(true))}
        >
          {copied ? '링크 복사됨 ✓' : '결과 링크 복사'}
        </button>
      </div>
    </>
  );
}
