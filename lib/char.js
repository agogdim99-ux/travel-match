// 유형 캐릭터 (TRIPPASS v3에서 직접 그린 SVG)
import { TYPES } from './quiz';

export function charSVG(type) {
  const col = TYPES[type].col;
  const face = `<ellipse cx="60" cy="70" rx="40" ry="37" fill="${col}"/><ellipse cx="60" cy="80" rx="26" ry="18" fill="#fff" opacity=".25"/>`;
  const eyes = `<circle cx="47" cy="66" r="4.5" fill="#1d2a2e"/><circle cx="73" cy="66" r="4.5" fill="#1d2a2e"/><circle cx="48.5" cy="64.5" r="1.4" fill="#fff"/><circle cx="74.5" cy="64.5" r="1.4" fill="#fff"/>`;
  const blush = `<ellipse cx="38" cy="76" rx="6" ry="3.5" fill="#f58f7c" opacity=".75"/><ellipse cx="82" cy="76" rx="6" ry="3.5" fill="#f58f7c" opacity=".75"/>`;
  const mouth = `<path d="M53 77 Q60 84 67 77" stroke="#1d2a2e" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  let extra = '';
  if (type === 'explorer') extra = `<ellipse cx="60" cy="37" rx="46" ry="8" fill="#b9864b"/><path d="M36 37 Q37 15 60 15 Q83 15 84 37 Z" fill="#d6a565"/><rect x="36" y="30" width="48" height="6" fill="#7a5530"/><path d="M98 96 l10 -24" stroke="#7a5530" stroke-width="4" stroke-linecap="round"/><path d="M104 70 l8 -6 l-1 10 z" fill="#e2543a"/>`;
  if (type === 'foodie') extra = `<circle cx="46" cy="24" r="12" fill="#fff"/><circle cx="60" cy="18" r="14" fill="#fff"/><circle cx="74" cy="24" r="12" fill="#fff"/><rect x="40" y="26" width="40" height="12" rx="3" fill="#fff" stroke="#e3e3e3"/><path d="M34 98 h52 a26 15 0 0 1 -52 0 z" fill="#e2543a"/><path d="M42 98 q4 -10 8 0 q4 -10 8 0 q4 -10 8 0 q4 -10 8 0" stroke="#f7d27a" stroke-width="3" fill="none"/><path d="M80 84 l18 -22 M86 88 l18 -22" stroke="#7a5530" stroke-width="3" stroke-linecap="round"/>`;
  if (type === 'healer') extra = `<circle cx="84" cy="36" r="7" fill="#ff7aa8"/><circle cx="92" cy="42" r="7" fill="#ff7aa8"/><circle cx="84" cy="48" r="7" fill="#ff7aa8"/><circle cx="76" cy="42" r="7" fill="#ff7aa8"/><circle cx="84" cy="42" r="4" fill="#ffd34d"/><rect x="35" y="58" width="22" height="14" rx="6" fill="#1d2a2e"/><rect x="63" y="58" width="22" height="14" rx="6" fill="#1d2a2e"/><path d="M57 64 h6" stroke="#1d2a2e" stroke-width="3"/><rect x="39" y="60" width="7" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="67" y="60" width="7" height="3" rx="1.5" fill="#fff" opacity=".6"/>`;
  if (type === 'urban') extra = `<ellipse cx="54" cy="33" rx="36" ry="11" fill="#2f3a5c"/><circle cx="54" cy="21" r="4" fill="#2f3a5c"/><rect x="42" y="90" width="36" height="22" rx="5" fill="#33384a"/><circle cx="60" cy="101" r="7" fill="#9fb3c8" stroke="#1d2a2e" stroke-width="2"/><rect x="48" y="86" width="10" height="6" rx="2" fill="#33384a"/>`;
  const eyesPart = type === 'healer' ? '' : eyes;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${TYPES[type].n} 캐릭터">${face}${eyesPart}${blush}${mouth}${extra}</svg>`;
}
