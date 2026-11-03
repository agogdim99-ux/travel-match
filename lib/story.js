'use client';
// 인스타 스토리(1080x1920) 결과 이미지
import { TYPES, comboName } from './quiz';
import { charSVG } from './char';

export async function makeStory({ type, order, nickname, top }) {
  const T = TYPES[type];
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
  const g = c.getContext('2d');
  const ink = '#14353d', paper = '#fbfdfc', accent = '#e2543a', stamp = '#f2b33d', muted = '#5b7177', line = '#c9d6d9';
  const disp = '"Do Hyeon","Gothic A1",sans-serif', body = '"Gothic A1",sans-serif', mono = '"IBM Plex Mono",monospace';
  try { if (document.fonts?.ready) await document.fonts.ready; } catch {}
  g.fillStyle = ink; g.fillRect(0, 0, 1080, 1920);
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  rr(80, 140, 920, 1640, 40); g.fillStyle = paper; g.fill();
  g.fillStyle = muted; g.font = `600 30px ${mono}`; g.textAlign = 'left'; g.fillText('BOARDING PASS', 140, 230);
  g.textAlign = 'right'; g.fillText(`ICN → ${top[0].d.details?.code || '???'}`, 940, 230);
  g.strokeStyle = line; g.lineWidth = 4; g.setLineDash([16, 14]); g.beginPath(); g.moveTo(80, 280); g.lineTo(1000, 280); g.stroke(); g.setLineDash([]);
  try {
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(charSVG(type));
    await new Promise((ok, no) => { img.onload = ok; img.onerror = no; });
    g.drawImage(img, 400, 310, 280, 280);
  } catch {}
  g.textAlign = 'center';
  g.fillStyle = muted; g.font = `600 34px ${body}`; g.fillText(`${nickname} 님의 여행 유형은`, 540, 640);
  g.fillStyle = ink; g.font = `100px ${disp}`; g.fillText(comboName(order), 540, 750);
  g.fillStyle = muted; g.font = `600 32px ${body}`; g.fillText(`${T.n} + ${TYPES[order[1]].n} · 찰떡 메이트 ${TYPES[T.best[0]].n}`, 540, 815);
  let y0 = 900;
  g.fillStyle = muted; g.font = `600 30px ${mono}`; g.fillText('RECOMMENDED ROUTES', 540, y0); y0 += 50;
  top.forEach((t, i) => {
    const yy = y0 + i * 170;
    rr(140, yy, 800, 140, 24); g.fillStyle = '#dfecee'; g.fill();
    g.textAlign = 'left'; g.fillStyle = ink; g.font = `800 48px ${body}`; g.fillText(`${i + 1}. ${t.d.city}`, 180, yy + 66);
    g.fillStyle = muted; g.font = `600 30px ${body}`; g.fillText(`${t.d.country}${t.match ? ` · 일치율 ${t.match}%` : ''}`, 180, yy + 112);
    g.textAlign = 'right'; rr(700, yy + 44, 210, 56, 10); g.fillStyle = stamp; g.fill();
    g.fillStyle = '#2b1d00'; g.font = `600 32px ${mono}`; g.fillText(`ICN→${t.d.details?.code || ''}`, 890, yy + 84);
    g.textAlign = 'center';
  });
  g.fillStyle = accent; rr(220, 1530, 640, 100, 50); g.fill();
  g.fillStyle = '#fff'; g.font = `800 38px ${body}`; g.fillText('너의 여행 취향도 알려줘!', 540, 1593);
  g.fillStyle = muted; g.font = `600 28px ${body}`; g.fillText(location.host, 540, 1700);
  g.fillStyle = paper; g.font = `600 30px ${mono}`; g.fillText('TRIPPASS 4.0', 540, 1850);
  return c.toDataURL('image/png');
}
