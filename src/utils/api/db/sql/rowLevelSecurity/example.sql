create policy "Individuals can view their own todos." on public.todos for
select
  using (auth.uid () = user_id);

create policy "Individuals can view their own todos." on public.todos for
select
  using (true);

-- allow all