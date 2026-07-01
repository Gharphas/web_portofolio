-- Drop camelCase triggers for Better Auth tables to avoid trigger errors
-- since update_updated_at_column expects a snake_case "updated_at" column, 
-- but Better Auth tables use camelCase "updatedAt".

DROP TRIGGER IF EXISTS update_user_updated_at ON public."user";
DROP TRIGGER IF EXISTS update_session_updated_at ON public.session;
DROP TRIGGER IF EXISTS update_account_updated_at ON public.account;
DROP TRIGGER IF EXISTS update_verification_updated_at ON public.verification;
