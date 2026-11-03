'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdvisoryBadge from '@/components/AdvisoryBadge';
import Loading from '@/components/Loading';
import CautionBox from '@/components/CautionBox';

export default function Home() {
  const [bans, setBans] = useState(null);
  const [cautions, setCautions] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([fetch('/api/advisories'), fetch('/api/destinations?sort=advisory')])
      .then(async ([a, d]) => {
        if (!a.ok || !d.ok) throw new Error();
        const [adv, dests] = await Promise.all([a.json(), d.json()]);
        setBans(adv);
        setCautions(dests.filter((x) => x.caution || x.advisory_level >= 1).sort((a, b) => b.caution - a.caution));
      })
      .catch(() => setErr('여행경보를 불러오지 못했어요. 잠시 후 새로고침해 주세요.'));
  }, []);

  const countries = bans?.filter((b) => b.note === '국가 전역 여행금지') ?? [];
  const regions = bans?.filter((b) => b.note !== '국가 전역 여행금지') ?? [];

  return (
    <>
      <section className="hero">
        <p className="eyebrow">여행 취향 테스트 2.0</p>
        <h1>
          나라 말고, <em>도시</em>까지
          <br />
          딱 맞게 골라 드릴게요
        </h1>
        <p className="lead">8개 질문이면 끝. 29개 나라·지역, 62곳 중에서 내 취향 여행지를 찾고 여행경보까지 확인해요.</p>
        <Link href="/test" className="btn primary big">테스트 시작하기 →</Link>
      </section>

      <section className="card alert">
        <div className="card-head">
          <h2>🚫 지금 가면 안 되는 곳</h2>
          <span className="muted small">외교부 여행금지 · 2027.1.31까지</span>
        </div>
        {err && <p className="error">{err}</p>}
        {!bans && !err && <Loading />}
        {bans && (
          <>
            <p className="small muted">국가 전역</p>
            <div className="chips">
              {countries.map((b) => <span key={b.id} className="chip danger">{b.country}</span>)}
            </div>
            <p className="small muted" style={{ marginTop: 16 }}>일부 지역</p>
            <ul className="region-list">
              {regions.map((b) => (
                <li key={b.id}><strong>{b.country}</strong> <span className="muted">{b.note}</span></li>
              ))}
            </ul>
          </>
        )}
      </section>

      {cautions.some((d) => d.caution) && (
        <section className="card">
          <div className="card-head"><h2>🔴 지금 꼭 확인할 곳</h2></div>
          {cautions.filter((d) => d.caution).map((d) => <CautionBox key={d.id} d={d} compact />)}
        </section>
      )}

      {cautions.length > 0 && (
        <section className="card">
          <div className="card-head">
            <h2>⚠️ 여행유의 단계인 추천 여행지</h2>
          </div>
          <ul className="caution-list">
            {cautions.filter((d) => !d.caution).map((d) => (
              <li key={d.id}>
                <span>{d.emoji} {d.country} {d.city}</span>
                <AdvisoryBadge level={d.advisory_level} />
                {d.advisory_note && <p className="small muted">{d.advisory_note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
