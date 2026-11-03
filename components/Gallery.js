'use client';
import { useEffect, useState } from 'react';

// 사진 3장: TRIPPASS v3 사진이 있으면 그걸 쓰고, 없으면 위키백과 문서 대표 사진을 불러와요
async function wikiImage(title) {
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    if (!r.ok) return null;
    const j = await r.json();
    const src = j.thumbnail?.source || j.originalimage?.source;
    return src ? { src: src.replace(/\/\d+px-/, '/800px-'), page: j.content_urls?.desktop?.page } : null;
  } catch { return null; }
}

export default function Gallery({ d }) {
  const det = d.details || {};
  const fixed = det.photos;
  const spots = det.spots || [];
  const [imgs, setImgs] = useState(() => (fixed || []).map((p) => ({ src: p[0], name: p[1], by: p[2], lic: p[3], page: p[4] })));

  useEffect(() => {
    if (fixed && fixed.length >= 3) return;
    let alive = true;
    (async () => {
      const have = (fixed || []).map((p) => ({ src: p[0], name: p[1], by: p[2], lic: p[3], page: p[4] }));
      const need = spots.filter((s) => !have.some((h) => h.name === s[0])).slice(0, 3 - have.length);
      const found = await Promise.all(need.map(async (s) => {
        const w = (await wikiImage(s[2] || s[0])) || (await wikiImage(det.en || d.city));
        return w ? { src: w.src, name: s[0], by: 'Wikipedia', lic: '위키백과 문서 사진', page: w.page } : { src: null, name: s[0] };
      }));
      if (alive) setImgs([...have, ...found]);
    })();
    return () => { alive = false; };
  }, [d.id]); // eslint-disable-line

  const slots = [0, 1, 2].map((i) => imgs[i] || { src: null, name: spots[i]?.[0] || d.city });
  return (
    <>
      <div className="gallery">
        {slots.map((p, i) => (
          <figure key={i}>
            {p.src ? <img src={p.src} alt={p.name} loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <span aria-hidden="true">{d.emoji}</span>}
            <figcaption>{p.name}</figcaption>
          </figure>
        ))}
      </div>
      {imgs.some((p) => p.src) && (
        <p className="credit">사진: {imgs.filter((p) => p.src).map((p, i) => (
          <span key={i}>{i > 0 && ' · '}<a href={p.page} target="_blank" rel="noreferrer">{p.name}</a> {p.by}, {p.lic}</span>
        ))}</p>
      )}
    </>
  );
}
