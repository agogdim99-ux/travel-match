'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COND, DEF, QS } from '@/lib/quiz';
import { getOwnerKey } from '@/lib/owner';
import Loading from '@/components/Loading';
import CautionBox from '@/components/CautionBox';

const CODES = ['TYO', 'BKK', 'CDG', 'HNL', 'DAD', 'BCN', 'ZRH', 'TPE', 'SIN', 'JFK', 'IST', 'MLE', 'SYD', 'CTS'];
const LETTERS = ['A', 'B', 'C', 'D'];

// 질문마다 선택지 순서를 섞어요 (답은 원래 번호로 저장)
function shuffledOrder(seed) {
  return QS.map((q, i) => {
    const idx = q[1].map((_, j) => j);
    let s = (seed + i * 7919) % 2147483647;
    for (let k = idx.length - 1; k > 0; k--) { s = (s * 16807) % 2147483647; const r = s % (k + 1); [idx[k], idx[r]] = [idx[r], idx[k]]; }
    return idx;
  });
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState('start');
  const [code, setCode] = useState('???');
  const [cond, setCond] = useState(DEF);
  const [name, setName] = useState('');
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [err, setErr] = useState('');
  const [adv, setAdv] = useState(null);
  const [cautions, setCautions] = useState([]);
  const order = useMemo(() => shuffledOrder(Math.floor(Math.random() * 100000) + 1), []);

  // 출발 안내판처럼 도착지 코드가 바뀌어요
  useEffect(() => {
    if (step !== 'start') return;
    let i = 0;
    const t = setInterval(() => { i++; setCode(i % 6 === 5 ? '???' : CODES[i % CODES.length]); }, 900);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    Promise.all([fetch('/api/advisories'), fetch('/api/destinations?sort=advisory')])
      .then(async ([a, d]) => {
        if (!a.ok || !d.ok) throw new Error();
        setAdv(await a.json());
        setCautions((await d.json()).filter((x) => x.caution));
      })
      .catch(() => setAdv([]));
  }, []);

  async function submit(final) {
    setStep('saving'); setErr('');
    try {
      const res = await fetch('/api/results', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerKey: getOwnerKey(), nickname: name.trim(), cond, answers: final }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/result/${data.id}`);
    } catch (e) { setErr(e.message || '탑승권 발급에 실패했어요. 다시 시도해 주세요.'); setStep('q'); }
  }

  function choose(orig) {
    const next = [...answers.slice(0, qi), orig];
    setAnswers(next);
    if (qi + 1 < QS.length) setQi(qi + 1); else submit(next);
  }

  if (step === 'saving') return <section className="pass"><div className="pass-body"><Loading text="탑승권을 발급하고 있어요… ✈️" /></div></section>;

  if (step === 'cond') {
    return (
      <section className="pass">
        <div className="pass-head"><span>STEP 1 · 탑승 정보</span><span>6 / 6</span></div>
        <form className="pass-body" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { setQi(0); setAnswers([]); setStep('q'); window.scrollTo(0, 0); } }}>
          <div className="field">
            <span className="t">탑승객 이름 (닉네임)</span>
            <input className="input" maxLength={20} placeholder="탑승권에 들어갈 이름" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          {Object.entries(COND).map(([k, c]) => (
            <div className="field" key={k}>
              <span className="t">{c.t}</span>
              <div className="chips">
                {c.o.map(([v, l]) => (
                  <button type="button" key={v} className={`chip-btn ${cond[k] === v ? 'on' : ''}`} aria-pressed={cond[k] === v}
                    onClick={() => setCond((c0) => ({ ...c0, [k]: v }))}>{l}</button>
                ))}
              </div>
            </div>
          ))}
          <button className="btn" disabled={!name.trim()}>질문 시작하기 →</button>
        </form>
      </section>
    );
  }

  if (step === 'q') {
    const q = QS[qi];
    const pct = (qi / QS.length) * 100;
    return (
      <section className="pass">
        <div className="pass-head"><span>STEP 2 · 취향 질문</span><span>{String(qi + 1).padStart(2, '0')} / {QS.length}</span></div>
        <div className="pass-body">
          <div className="bar"><i style={{ width: `${pct}%` }} /><span className="mini-plane" style={{ left: `${Math.max(pct, 2)}%` }}>✈</span></div>
          <div className="qmeta"><span>ICN → ???</span><span>남은 비행 약 {Math.max(1, Math.round(((QS.length - qi) * 11) / 60 * 10) / 10)}분</span></div>
          <h2>{q[0]}</h2>
          <div className="opts">
            {order[qi].map((orig, j) => (
              <button key={`${qi}-${orig}`} className="opt" onClick={() => choose(orig)}>
                <span className="k">{LETTERS[j]}</span><span>{q[1][orig][0]}</span>
              </button>
            ))}
          </div>
          {err && <p className="error">{err}</p>}
          <button className="btn ghost" onClick={() => (qi > 0 ? setQi(qi - 1) : setStep('cond'))}>← 이전</button>
        </div>
      </section>
    );
  }

  const countries = adv?.filter((b) => b.note === '국가 전역 여행금지') ?? [];
  const regions = adv?.filter((b) => b.note !== '국가 전역 여행금지') ?? [];
  return (
    <>
      <section className="pass board">
        <div className="pass-head board-head"><span className="air">TRIPPASS AIR</span><span>PERSONALITY TEST</span></div>
        <div className="perf" aria-hidden="true" />
        <div className="pass-body board-body">
          <div className="routebox">
            <div className="ap"><b>ICN</b><span>INCHEON</span></div>
            <div className="flight" aria-hidden="true"><span className="plane">✈</span><span className="track" /></div>
            <div className="ap"><b className="q"><span className="flap" key={code}>{code}</span></b><span>YOUR DEST</span></div>
          </div>
          <div className="hero-copy">
            <h1>나만의 여행 탑승권</h1>
            <p className="muted">16개 질문으로 내 여행 유형을 알아보고,<br />전 세계 62곳 중 꼭 맞는 여행지 3곳을 찾아드려요</p>
          </div>
          <div className="stats">
            <div><span>QUESTIONS</span><b>16개</b></div>
            <div><span>DESTINATIONS</span><b>62곳</b></div>
            <div><span>TIME</span><b>약 3분</b></div>
            <div><span>SAFETY</span><b>여행경보</b></div>
          </div>
          <button className="btn btn-big" onClick={() => { setStep('cond'); window.scrollTo(0, 0); }}>탑승권 발급하기 <span aria-hidden="true">→</span></button>
        </div>
        <div className="stub">
          <div className="barcode" aria-hidden="true" />
          <div className="stub-info"><span>GATE</span><b>16</b><span>BOARDING</span><b>NOW</b><span>SEAT</span><b>1A</b></div>
        </div>
      </section>

      <section className="pass">
        <div className="pass-head"><span>🛂 SAFETY BRIEFING</span><span>외교부 · 2027.1.31까지</span></div>
        <div className="pass-body">
          <h3>🚫 지금 가면 안 되는 곳 (여행금지)</h3>
          {!adv && <Loading />}
          {adv && adv.length === 0 && <p className="error">여행경보를 불러오지 못했어요. 잠시 후 새로고침해 주세요.</p>}
          {adv && adv.length > 0 && (
            <>
              <div className="danger-chips">{countries.map((b) => <span key={b.id}>{b.country}</span>)}</div>
              <details>
                <summary className="small" style={{ cursor: 'pointer', fontWeight: 800 }}>일부 지역만 금지된 나라 {regions.length}곳 보기</summary>
                <ul className="region-list">{regions.map((b) => <li key={b.id}><b>{b.country}</b> <span className="muted">{b.note}</span></li>)}</ul>
              </details>
            </>
          )}
          {cautions.length > 0 && (
            <>
              <h3>🔴 추천 여행지 중 꼭 확인할 곳</h3>
              {cautions.map((d) => <CautionBox key={d.id} d={d} compact />)}
            </>
          )}
        </div>
      </section>
    </>
  );
}
