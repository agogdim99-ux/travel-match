// 서버(API)에서만 쓰는 Supabase 연결. 비밀 키는 .env / Vercel 환경변수에만 있어요.
import { createClient } from '@supabase/supabase-js';

let client;
export function db() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SECRET_KEY 환경변수가 없어요.');
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
