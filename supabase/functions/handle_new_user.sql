CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, company_id, email)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'last_name',
      cast(new.raw_user_meta_data ->> 'company_id' as uuid),
      new.email
    );
    RETURN new;
  END;
$$

