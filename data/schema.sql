-- PlannersHub Supabase Database Schema Setup
-- Run this in the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. RESOURCES TABLE
-- =========================================================================
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  course_code text not null,
  semester integer not null,
  category text not null check (category in ('book', 'note', 'question', 'youtube')),
  thumbnail_url text,
  resource_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for resources
alter table public.resources enable row level security;

-- =========================================================================
-- 2. USERS TABLE
-- =========================================================================
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  roll text not null unique,
  email text not null unique,
  role text not null default 'student' check (role in ('student', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- =========================================================================
-- 3. TRIGGER TO SYNC AUTH.USERS SIGNUPS WITH PUBLIC.USERS
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, roll, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'roll', ''),
    new.email,
    'student',
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Helper function to check if the current auth user is an Admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where users.id = auth.uid() and users.role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if the current auth user is Approved
create or replace function public.is_approved()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where users.id = auth.uid() and users.status = 'approved'
  );
end;
$$ language plpgsql security definer;


-- POLICIES FOR public.resources:
-- 1. Admins can do anything on resources
create policy "Admins have full access to resources"
  on public.resources for all
  using (public.is_admin());

-- 2. Approved students can read resources
create policy "Approved students can read resources"
  on public.resources for select
  using (public.is_approved());


-- POLICIES FOR public.users:
-- 1. Admins can do anything on users
create policy "Admins have full access to users"
  on public.users for all
  using (public.is_admin());

-- 2. Users can read their own profile
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

-- 3. Users can update their own profile (name, roll)
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- =========================================================================
-- 5. SEED DATA FOR RESOURCES
-- =========================================================================
insert into public.resources (title, course_code, semester, category, resource_url) values
('CN Shankar Rao - Principles of Sociology', 'HUM 1255', 2, 'book', 'https://drive.google.com/file/d/12_9DsO9jJnvzs3NM-yllvfRJFnh3cRmT/view?usp=drive_link'),
('Differential Calculus (Das and Mukharjee)', 'MATH 1251', 2, 'book', 'https://drive.google.com/file/d/1_kGyEfFOeLx251tFg7zS2GL23-18CtCa/view?usp=drive_link'),
('Integral Calculus 54th Edition Chapter 1-12', 'MATH 1251', 2, 'book', 'https://drive.google.com/file/d/1pa_qjdmm6q-0yfA5whgCeawjJ33w1DY7/view?usp=drive_link'),
('A Textbook of Surveying by Aziz and Shahjahan', 'URP 1203', 2, 'book', 'https://drive.google.com/file/d/1SUzvxWSeNF2_wGkhEnsm5cIlx_bDZ9X1/view?usp=sharing'),
('Integral Calculus (Rafiqul Islam Sir)', 'MATH 1251', 2, 'note', 'https://drive.google.com/file/d/1NCXI-u-0I7NFzgbO9Vqzvwla4rq7Gkja/view?usp=drive_link'),
('Differential Equation (Rafiqul Islam Sir)', 'MATH 1251', 2, 'note', 'https://drive.google.com/file/d/1t_e9zkeJGxwuVEWUcpn0-Wg20KLjs3Vr/view?usp=drive_link'),
('Integral Calculus Note (Tanzil bhai)', 'MATH 1251', 2, 'note', 'https://drive.google.com/file/d/1xzP4ypVwuppn8QJ_pcGcmnWZV4-DNkld/view?usp=sharing'),
('First Year 1st Semester Previous Questions', 'Mixed', 1, 'question', 'https://drive.google.com/file/d/1xzP4ypVwuppn8QJ_pcGcmnWZV4-DNkld/view?usp=sharing'),
('GIS and Remote Sensing Short Questions', 'URP 3105', 5, 'question', 'https://drive.google.com/file/d/1xzP4ypVwuppn8QJ_pcGcmnWZV4-DNkld/view?usp=sharing');

-- Seed for videos
insert into public.resources (title, course_code, semester, category, resource_url, thumbnail_url) values
('QGIS Full Course for Beginners', 'URP 3105', 5, 'youtube', 'https://www.youtube.com/watch?v=SovdBaus7pM', 'https://img.youtube.com/vi/SovdBaus7pM/0.jpg'),
('Linear City Concepts', 'URP 1101', 1, 'youtube', 'https://www.youtube.com/watch?v=5Qr_nTspz9A', 'https://img.youtube.com/vi/5Qr_nTspz9A/0.jpg');
