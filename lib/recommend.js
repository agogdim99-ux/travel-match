// 답변 8개 + 여행지 목록 → 점수 계산 → 1위 + 후보 2곳
import { questions } from './questions';

const TAGS = ['beach', 'city_life', 'nature', 'culture', 'food', 'activity', 'romance'];

export function buildProfile(answers) {
  const p = { w: Object.fromEntries(TAGS.map((t) => [t, 0])), climate: 'any', family: false, maxFlight: 99, longHaul: false, budget: 2, crowd: 0 };
  questions.forEach((q, i) => {
    const opt = q.options[answers[i]];
    if (!opt) throw new Error(`${i + 1}번 질문의 답이 올바르지 않아요.`);
    for (const [t, v] of Object.entries(opt.w || {})) p.w[t] += v;
    if (opt.climate) p.climate = opt.climate;
    if (opt.family) p.family = true;
    if (opt.maxFlight) { p.maxFlight = opt.maxFlight; p.longHaul = !!opt.longHaul; }
    if (opt.budget) p.budget = opt.budget;
    if (opt.crowd !== undefined) p.crowd = opt.crowd;
  });
  return p;
}

export function scoreDestination(d, p) {
  if (d.advisory_level >= 4) return -Infinity;
  let s = TAGS.reduce((sum, t) => sum + p.w[t] * d[t], 0);
  if (p.climate !== 'any') s += d.climate === p.climate ? 4 : d.climate === 'mild' ? 0 : -3;
  if (Number(d.flight_hours) > p.maxFlight) s -= 15;
  if (p.longHaul && Number(d.flight_hours) >= 9) s += 2;
  s -= 2 * Math.abs(d.budget - p.budget);
  if (p.crowd) s -= 2.5 * Math.abs(d.crowd - p.crowd);
  if (p.family && d.family_friendly) s += 4;
  if (d.advisory_level === 3) s -= 10;
  if (d.advisory_level === 2) s -= 2;
  return s;
}

export function recommend(answers, destinations) {
  const p = buildProfile(answers);
  const ranked = destinations
    .map((d) => ({ d, s: scoreDestination(d, p) }))
    .filter((x) => x.s > -Infinity)
    .sort((a, b) => b.s - a.s);
  const top = ranked[0].d;
  // 후보 2곳은 되도록 1위와 다른 나라에서 골라요.
  const others = ranked.slice(1);
  const picks = others.filter((x) => x.d.country !== top.country).slice(0, 2);
  while (picks.length < 2 && others.length) {
    const next = others.find((x) => !picks.includes(x));
    if (!next) break;
    picks.push(next);
  }
  return { top: top.id, candidates: picks.map((x) => x.d.id) };
}
