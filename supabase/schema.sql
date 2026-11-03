-- 1) Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 Run 하세요.
-- 2) 그다음 seed.sql 을 붙여넣고 Run 하면 여행지 데이터가 들어가요.

create table if not exists destinations (
  id text primary key,
  country text not null,
  city text not null,
  region text not null,
  emoji text,
  summary text,
  beach int not null default 0,
  city_life int not null default 0,
  nature int not null default 0,
  culture int not null default 0,
  food int not null default 0,
  activity int not null default 0,
  romance int not null default 0,
  crowd int not null default 2,
  budget int not null default 2,
  flight_hours numeric not null default 3,
  climate text not null default 'mild',
  family_friendly boolean not null default false,
  pair_id text references destinations(id),
  advisory_level int not null default 0,
  advisory_note text,
  caution boolean not null default false,
  news_title text,
  news_url text
);

-- (이미 표를 만들었다면 아래 줄이 새 칸만 추가해 줘요)
alter table destinations add column if not exists caution boolean not null default false;
alter table destinations add column if not exists news_title text;
alter table destinations add column if not exists news_url text;

create table if not exists advisories (
  id bigint generated always as identity primary key,
  country text not null,
  level int not null,
  note text,
  base_date date
);

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  owner_key text not null,
  nickname text not null check (char_length(nickname) between 1 and 20),
  answers jsonb not null,
  top_destination_id text not null references destinations(id),
  candidates text[] not null default '{}',
  memo text check (char_length(memo) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists results_owner_idx on results(owner_key);

-- 행 수준 보안(RLS)을 켜고 정책은 만들지 않아요.
-- → 브라우저(공개 키)로는 어떤 표도 직접 읽거나 쓸 수 없고,
--   반드시 우리 API 서버(비밀 키)를 거쳐야만 데이터에 닿아요.
alter table destinations enable row level security;
alter table advisories enable row level security;
alter table results enable row level security;
