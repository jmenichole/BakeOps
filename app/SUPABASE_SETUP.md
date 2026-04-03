# Supabase Database Optimization

Run the following SQL in your Supabase SQL Editor to ensure baker profiles are automatically created and pricing/leads work perfectly.

## 1. Automatic Profile Creation Trigger
This ensures that every new user who signs up automatically gets a `bakers` record with a 14-day trial and a referral code.

```sql
-- Create the function that will be called by the trigger
create or replace function public.handle_new_baker_profile()
returns trigger as $$
declare
  generated_referral_code text;
begin
  -- Generate a random 6-character referral code
  generated_referral_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  -- Insert the new baker profile
  insert into public.bakers (
    id, 
    trial_ends_at, 
    referral_code, 
    is_beta_tester, 
    onboarding_completed,
    created_at,
    updated_at
  )
  values (
    new.id, 
    now() + interval '14 days', 
    generated_referral_code,
    true,
    false,
    now(),
    now()
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger on the auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_baker_profile();
```

## 2. Back-fill Existing Users
If you have users who signed up before this trigger was added, run this to give them profiles:

```sql
insert into public.bakers (id, trial_ends_at, referral_code, is_beta_tester, onboarding_completed, created_at, updated_at)
select 
  id, 
  now() + interval '14 days', 
  upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  true,
  false,
  now(),
  now()
from auth.users
where id not in (select id from public.bakers)
on conflict (id) do nothing;
```

## 3. Schema Syncing (Run these if columns are missing)
Ensure your `bakers` table has all necessary business columns:

```sql
alter table public.bakers add column if not exists zip_code text;
alter table public.bakers add column if not exists business_name text;
alter table public.bakers add column if not exists role text default 'baker';
```
