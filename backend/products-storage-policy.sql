-- ============================================================
-- Metro Cool — Products Bucket Storage RLS Policies
-- Run this in your Supabase SQL Editor if you want to allow
-- direct uploads to the 'products' bucket from the browser.
-- ============================================================

-- 1. Ensure the 'products' bucket is public and allows files up to 50MB
UPDATE storage.buckets
SET public = true,
    file_size_limit = 52428800 -- 50MB in bytes
WHERE id = 'products';

-- If bucket doesn't exist, create it:
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('products', 'products', true, 52428800)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 52428800;

-- 2. Allow public/authenticated upload (INSERT)
DROP POLICY IF EXISTS "Public can upload to products" ON storage.objects;
CREATE POLICY "Public can upload to products"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');

-- 3. Allow public view (SELECT)
DROP POLICY IF EXISTS "Public can view products" ON storage.objects;
CREATE POLICY "Public can view products"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

-- 4. Allow public update (UPDATE)
DROP POLICY IF EXISTS "Public can update products" ON storage.objects;
CREATE POLICY "Public can update products"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'products');

-- 5. Allow public delete (DELETE)
DROP POLICY IF EXISTS "Public can delete products" ON storage.objects;
CREATE POLICY "Public can delete products"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'products');
