-- Properties table
create table if not exists "property" (
  id text primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric not null,
  location text not null,
  bedrooms integer default 0,
  bathrooms integer default 0,
  area_sqft integer,
  status text default 'available', -- available, rented, sold, maintenance
  images text[], -- Array of image URLs
  featured boolean default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
