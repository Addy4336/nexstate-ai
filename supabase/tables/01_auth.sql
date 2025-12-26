-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing auth tables to ensure clean slate if needed
-- WARNING: This deletes all user data
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;

-- Users table
create table "user" (
  id text primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  email_verified boolean not null default false,
  image text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  role text default 'user',
  banned boolean default false,
  ban_reason text,
  ban_expires timestamp
);

-- Sessions table
create table "session" (
  id text primary key default uuid_generate_v4(),
  expires_at timestamp not null,
  token text not null unique,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  ip_address text,
  user_agent text,
  user_id text not null references "user"(id) on delete cascade
);

-- Accounts table (for OAuth)
create table "account" (
  id text primary key default uuid_generate_v4(),
  account_id text not null,
  provider_id text not null,
  user_id text not null references "user"(id) on delete cascade,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamp,
  refresh_token_expires_at timestamp,
  scope text,
  password text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Verifications table
create table "verification" (
  id text primary key default uuid_generate_v4(),
  identifier text not null,
  value text not null,
  expires_at timestamp not null,
  created_at timestamp,
  updated_at timestamp
);

-- Seed Initial Admin
INSERT INTO "user" (id, name, email, role, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'Admin User',
  'admin@hopohomes.com',
  'admin',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;
