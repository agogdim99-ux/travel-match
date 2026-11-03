// data/*.mjs 를 읽어 supabase/seed.sql 을 만들어요.
import { writeFileSync } from 'node:fs';
import { destinations, advisories } from '../data/destinations.mjs';
import { details } from '../data/details.mjs';
import { photos } from '../data/photos.mjs';

const q = (v) => (v === null || v === undefined ? 'null' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : String(v));
const cols = ['id','country','city','region','emoji','summary','beach','city_life','nature','culture','food','activity','romance','crowd','budget','flight_hours','climate','family_friendly','advisory_level','advisory_note','caution','news_title','news_url'];

const missing = destinations.filter((d) => !details[d.id]).map((d) => d.id);
if (missing.length) throw new Error('details 없음: ' + missing.join(','));

let sql = '-- 여행지·여행경보 데이터 (schema.sql 실행 후 Run)\n';
sql += 'delete from results; delete from destinations; delete from advisories;\n\n';
sql += `insert into destinations (${cols.join(', ')}, details) values\n`;
sql += destinations.map((d) => {
  const det = { ...details[d.id], photos: photos[d.id] || null };
  return `(${cols.map((c) => q(d[c])).join(', ')}, ${q(JSON.stringify(det))}::jsonb)`;
}).join(',\n') + ';\n\n';
for (const d of destinations.filter((x) => x.pair_id)) sql += `update destinations set pair_id = ${q(d.pair_id)} where id = ${q(d.id)};\n`;
sql += '\ninsert into advisories (country, level, note, base_date) values\n';
sql += advisories.map((a) => `(${q(a.country)}, ${a.level}, ${q(a.note)}, ${q(a.base_date)})`).join(',\n') + ';\n';
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log(`destinations: ${destinations.length}, advisories: ${advisories.length}, bytes: ${sql.length}`);
