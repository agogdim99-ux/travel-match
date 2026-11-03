'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TYPES, TYPE_KEYS, QS, COMBO, STAT_LABELS, comboName, statsOf, condLabel, costOf, stayOf } from '@/lib/quiz';
import { getOwnerKey } from '@/lib/owner';
import { makeStory } from '@/lib/story';
import Char from '@/components/Char';
import Loading from '@/components/Loading';
import AdvisoryBadge from '@/components/AdvisoryBadge';
import CautionBox from '@/components/CautionBox';
import MemoEditor from '@/components/MemoEditor';
import Gallery from '@/components/Gallery';

const REGION_CHECK = {
  '동아시아': '110V 돼지코 어댑터 (일본·대만)', '동남아시아': '선크림과 모기 기피제', '아메리카': '팁 계산용 소액 달러',
  '오세아니아': '자외선 차단 모자', '유럽': '멀티 어댑터 (C타입)', '남아시아': '수중 카메라', '중동·아프리카': '얇은 긴팔 (노출 자제)',
};

// 결과 id로 항공편 번호·좌석 같은 탑승권 정보를 만들어요 (같은 결과는 항상 같은 값)
function passInfo(id) {
  const n = parseInt(id.replace(/-/g, '').slice(0, 8), 16);
  return { flight: `TP${100 + (n % 900)}`, gate: `${1 + (n % 48)}`, seat: `${1 + (n % 38)}${'ABCDEF'[n % 6]}` };
}

function Dest({ t, i, cond }) {
  const d = t.d; const det = d.details || {};
  const cost = costOf(d);
  const checks = ['여권 (만료 6개월 이상)', ...(det.check || []), REGION_CHECK[d.region]].filter(Boolean);
  const [done, setDone] = useState({});
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(`chk-${d.id}`) || '{}')); } catch {} }, [d.id]);
  const toggle = (j) => { const n = { ...done, [j]: !done[j] }; setDone(n); try { localStorage.setItem(`chk-${d.id}`, JSON.stringify(n)); } catch {} };
  return (
    <div className="dest">
      <div className="dest-top">
        <h3>{['🥇', '🥈', '🥉'][i]} {d.city} <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{d.country}</span></h3>
        <span className="code">ICN → {det.code}</span>
      </div>
      {t.match && <div className="match"><span>취향 일치율</span><span className="mb"><i style={{ width: `${t.match}%` }} /></span><b>{t.match}%</b></div>}
      <Gallery d={d} />
      <div className="facts">
        <span className="fact">🗓️ 베스트 시즌 {det.season}</span>
        <span className="fact">⏱️ 추천 {stayOf(d)}</span>
        <span className="fact">✈️ 비행 약 {Number(d.flight_hours)}시간</span>
        <span className="fact">💰 1인 약 {cost[0]}~{cost[1]}만원</span>
        <AdvisoryBadge level={d.advisory_level} />
      </div>
      <CautionBox d={d} />
      {t.why?.length > 0 && <div className="sec"><h4>💡 추천한 이유</h4><ul>{t.why.map((w, j) => <li key={j}>{w}</li>)}</ul></div>}
      <div className="sec"><h4>📍 꼭 가볼 곳</h4><ul>{(det.spots || []).map((s) => <li key={s[0]}><b>{s[0]}</b> · {s[1]}</li>)}</ul></div>
      <div className="sec"><h4>🍜 꼭 먹어 볼 것</h4><ul>{(det.foods || []).map((f) => <li key={f}>{f}</li>)}</ul><p className="warnline">방문 전 가게 운영시간과 휴무일을 꼭 확인하세요.</p></div>
      <div className="sec"><h4>⚠️ 주의할 점</h4><p style={{ fontSize: 15 }}>{det.warn}</p></div>
      <div className="sec"><h4>🧳 준비물 체크리스트 <span className="muted small">(체크하면 이 기기에 저장돼요)</span></h4>
        <div className="checks">{checks.map((c, j) => <label key={j}><input type="checkbox" checked={!!done[j]} onChange={() => toggle(j)} /> {c}</label>)}</div>
      </div>
      {t.pair && <p className="pair">🧳 <b>함께 가면 좋은 곳</b> · {t.pair.emoji} {t.pair.city} — {t.pair.summary}</p>}
      <div className="sec"><h4>🔎 항공권·숙소 찾아보기</h4>
        <div className="links">
          <a href={`https://www.skyscanner.co.kr/transport/flights/icn/${det.air}/`} target="_blank" rel="noreferrer">✈️ 항공권 (스카이스캐너)</a>
          <a href={`https://www.booking.com/searchresults.ko.html?ss=${encodeURIComponent(det.en || d.city)}`} target="_blank" rel="noreferrer">🏨 숙소 (부킹닷컴)</a>
          <a href="https://www.0404.go.kr/" target="_blank" rel="noreferrer">🛡️ {d.country} 여행경보</a>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    fetch(`/api/results/${id}?owner=${getOwnerKey() ?? ''}`)
      .then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setR(data); })
      .catch((e) => setErr(e.message || '결과를 불러오지 못했어요.'));
  }, [id]);

  if (err) return <section className="pass"><div className="pass-body"><p className="error">{err}</p><Link href="/" className="btn">테스트 하러 가기</Link></div></section>;
  if (!r) return <section className="pass"><div className="pass-body"><Loading text="탑승권을 불러오는 중이에요…" /></div></section>;
  if (!r.result) return <section className="pass"><div className="pass-body"><p>예전 버전에서 저장된 결과예요. 새 테스트로 다시 탑승권을 받아 보세요!</p><Link href="/" className="btn">새로 테스트하기</Link></div></section>;

  const { type, order, sc, picked } = r.result;
  const T = TYPES[type]; const second = order[1];
  const total = QS.length; const win = sc[type];
  const stats = statsOf(sc);
  const P = passInfo(r.id);
  const top1 = r.top[0]?.d;
  const share = typeof window !== 'undefined' ? `${location.origin}/result/${r.id}` : '';
  const copy = (txt, msg) => { try { navigator.clipboard.writeText(txt).then(() => setToast(msg)).catch(() => setToast(txt)); } catch { setToast(txt); } };
  const mate = (k, title, txt) => (
    <div className="mate"><span className="label">{title}</span><div className="who"><Char type={k} /><span>{TYPES[k].n}</span></div><p>{txt}</p></div>
  );

  return (
    <>
      <section className="pass board">
        <div className="pass-head board-head"><span className="air">TRIPPASS AIR · BOARDING PASS</span><span>{P.flight}</span></div>
        <div className="perf" aria-hidden="true" />
        <div className="pass-body">
          {!r.isMine && <p className="shared">친구가 보낸 탑승권이에요. 나는 어떤 유형일까? 맨 아래에서 바로 해 볼 수 있어요.</p>}
          <div className="ticket-top">
            <div style={{ display: 'grid', gap: 10 }}>
              <div className="tinfo">
                <div><span>PASSENGER</span><b>{r.nickname}</b></div>
                <div><span>FROM</span><b>ICN</b></div>
                <div><span>TO</span><b style={{ color: 'var(--accent)' }}>{top1?.details?.code}</b></div>
                <div><span>SEAT</span><b>{P.seat}</b></div>
              </div>
              <p className="small muted mono">GATE {P.gate} · {r.cond ? `${condLabel('season', r.cond.season)} · ${condLabel('days', r.cond.days)} · ${condLabel('with', r.cond.with)}` : ''}</p>
            </div>
            <div className="stampmark">APPROVED<b>{top1?.city}</b>{new Date(r.created_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</div>
          </div>

          <div className="hero">
            <Char type={type} />
            <div><p className="label">{r.nickname} 님의 여행 유형</p><h2>{comboName(order)}</h2><p className="muted small">주 유형 {T.n} + 보조 유형 {TYPES[second].n}</p></div>
          </div>
          <p className="combo">"{COMBO[`${type}-${second}`]}"</p>
          <p>{T.d}</p>

          <div className="box">
            <h3>📊 왜 {T.n}일까요?</h3>
            <p style={{ fontSize: 15 }}>{total}문항 중 <b>{win}개</b>가 {T.n} 쪽 답이었어요.{sc[second] >= win - 1 ? ` ${TYPES[second].n} 기질도 꽤 진하게 섞여 있어요.` : ''}</p>
            <div className="mix">{TYPE_KEYS.map((k) => (
              <div key={k} className={`mixrow ${k === type ? 'win' : ''}`}><span>{TYPES[k].emoji} {TYPES[k].n}</span><span className="mixbar"><i style={{ width: `${(sc[k] / total) * 100}%` }} /></span><b>{sc[k]}개</b></div>
            ))}</div>
            {picked?.length > 0 && <><p className="label">결정적인 답변</p><ul className="picks">{picked.map((p) => <li key={p}>"{p}"</li>)}</ul></>}
          </div>

          <div className="box">
            <h3>🎮 나의 여행 능력치</h3>
            <div className="statgrid">{Object.entries(STAT_LABELS).map(([k, l]) => (
              <div className="statrow" key={k}><span>{l}</span><span className="statbar"><i style={{ width: `${stats[k]}%` }} /></span><b className="mono">{stats[k]}</b></div>
            ))}</div>
          </div>

          <div className="traits">
            <div className="trait"><span className="label">💬 여행 중 입버릇</span><p>{T.quote}</p></div>
            <div className="trait"><span className="label">⭐ 특기</span><p>{T.skill}</p></div>
            <div className="trait"><span className="label">🫠 약점</span><p>{T.weak}</p></div>
          </div>
          <div className="box">
            <h3>🧳 캐리어 속 필수템</h3>
            <div className="bag">{T.bag.map((b) => <span key={b}>{b}</span>)}</div>
            <p className="small muted">돌아올 때 캐리어에 담겨 있는 것: {T.souvenir}</p>
          </div>

          <div className="school"><h3>🏫 학생이었다면?</h3><p>{T.school}</p></div>
          <div className="mates">{mate(T.best[0], '💞 찰떡 여행 메이트', T.best[1])}{mate(T.worst[0], '⚡ 같이 가면 싸울 수도', T.worst[1])}</div>

          <h2 style={{ marginTop: 8 }}>✈️ 추천 여행지 TOP 3</h2>
          {r.top.map((t, i) => <Dest key={t.id} t={t} i={i} cond={r.cond} />)}

          {r.isMine && <div className="box"><h3>📝 이 여행 메모</h3><MemoEditor id={r.id} initial={r.memo} /></div>}
          {!r.isMine && r.memo && <div className="box"><h3>📝 메모</h3><p>{r.memo}</p></div>}

          <div className="actions">
            {r.isMine ? (
              <>
                <button className="btn" onClick={() => copy(`나는 ${T.n}! 추천 여행지는 ${r.top.map((t) => t.d.city).join(', ')} ✈️ 내 탑승권 보기 → ${share}`, '결과 링크를 복사했어요. 친구가 열면 내 탑승권이 바로 보여요.')}>내 탑승권 링크 복사</button>
                <button className="btn ghost" onClick={async () => { setToast('이미지를 만들고 있어요…'); setImg(await makeStory({ type, order, nickname: r.nickname, top: r.top })); setToast(''); }}>결과 이미지 만들기 (인스타 스토리 크기)</button>
                {img && <div className="imgbox"><img src={img} alt="내 여행 취향 결과 이미지" /><a className="btn ghost" href={img} download="TRIPPASS-결과.png">이미지 저장</a></div>}
                <button className="btn ghost" onClick={() => copy(`나랑 여행 취향 맞는지 테스트해 볼래? 3분이면 끝나 ✈️ ${location.origin}`, '초대 문구를 복사했어요.')}>친구에게 테스트 보내기 (문구 복사)</button>
                <Link className="btn ghost" href="/my">🗂️ 내 기록 보기</Link>
                <Link className="btn ghost" href="/">다시 하기</Link>
              </>
            ) : (
              <Link className="btn" href="/">나도 탑승권 받아 보기</Link>
            )}
            <p className="toast" role="status">{toast}</p>
          </div>
        </div>
        <div className="stub">
          <div className="barcode" aria-hidden="true" />
          <div className="stub-info"><span>FLIGHT</span><b>{P.flight}</b><span>GATE</span><b>{P.gate}</b><span>SEAT</span><b>{P.seat}</b></div>
        </div>
      </section>
    </>
  );
}
