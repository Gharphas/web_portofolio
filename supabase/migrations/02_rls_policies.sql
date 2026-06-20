-- Enable Row Level Security (RLS) on all tables (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. profiles policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');

-- 2. about policies
DROP POLICY IF EXISTS "Public read about" ON public.about;
DROP POLICY IF EXISTS "Admin manage about" ON public.about;
CREATE POLICY "Public read about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admin manage about" ON public.about FOR ALL USING (auth.role() = 'authenticated');

-- 3. skills policies
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
DROP POLICY IF EXISTS "Admin manage skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- 4. projects policies
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Admin manage projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- 5. project_images policies
DROP POLICY IF EXISTS "Public read project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admin manage project_images" ON public.project_images;
CREATE POLICY "Public read project_images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Admin manage project_images" ON public.project_images FOR ALL USING (auth.role() = 'authenticated');

-- 6. experience policies
DROP POLICY IF EXISTS "Public read experience" ON public.experience;
DROP POLICY IF EXISTS "Admin manage experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admin manage experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');

-- 7. education policies
DROP POLICY IF EXISTS "Public read education" ON public.education;
DROP POLICY IF EXISTS "Admin manage education" ON public.education;
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Admin manage education" ON public.education FOR ALL USING (auth.role() = 'authenticated');

-- 8. achievements policies
DROP POLICY IF EXISTS "Public read achievements" ON public.achievements;
DROP POLICY IF EXISTS "Admin manage achievements" ON public.achievements;
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admin manage achievements" ON public.achievements FOR ALL USING (auth.role() = 'authenticated');

-- 9. hobbies policies
DROP POLICY IF EXISTS "Public read hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Admin manage hobbies" ON public.hobbies;
CREATE POLICY "Public read hobbies" ON public.hobbies FOR SELECT USING (true);
CREATE POLICY "Admin manage hobbies" ON public.hobbies FOR ALL USING (auth.role() = 'authenticated');

-- 10. photos policies
DROP POLICY IF EXISTS "Public read photos" ON public.photos;
DROP POLICY IF EXISTS "Admin manage photos" ON public.photos;
CREATE POLICY "Public read photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Admin manage photos" ON public.photos FOR ALL USING (auth.role() = 'authenticated');

-- 11. contact_messages policies
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin manage contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage contact_messages" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- 12. social_links policies
DROP POLICY IF EXISTS "Public read social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admin manage social_links" ON public.social_links;
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admin manage social_links" ON public.social_links FOR ALL USING (auth.role() = 'authenticated');

-- 13. site_settings policies
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin manage site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
