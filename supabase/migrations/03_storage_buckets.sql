-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('photos', 'photos', true),
  ('documents', 'documents', true),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 1. Public Read Access Policy for the buckets
DROP POLICY IF EXISTS "Public Storage Read Access" ON storage.objects;
CREATE POLICY "Public Storage Read Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'projects', 'photos', 'documents', 'logos'));

-- 2. Admin Insert Access Policy (Authenticated users)
DROP POLICY IF EXISTS "Admin Storage Insert Access" ON storage.objects;
CREATE POLICY "Admin Storage Insert Access" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars', 'projects', 'photos', 'documents', 'logos'));

-- 3. Admin Update Access Policy (Authenticated users)
DROP POLICY IF EXISTS "Admin Storage Update Access" ON storage.objects;
CREATE POLICY "Admin Storage Update Access" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id IN ('avatars', 'projects', 'photos', 'documents', 'logos'));

-- 4. Admin Delete Access Policy (Authenticated users)
DROP POLICY IF EXISTS "Admin Storage Delete Access" ON storage.objects;
CREATE POLICY "Admin Storage Delete Access" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id IN ('avatars', 'projects', 'photos', 'documents', 'logos'));
