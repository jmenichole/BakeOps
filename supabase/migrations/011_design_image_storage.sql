-- BakeOps - Design Image Storage
-- Migration: 011_design_image_storage
-- Creates a public storage bucket for AI-generated cake design images
-- so large base64 data URLs are not stored directly in the database.

-- 1. Create the bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-images',
  'design-images',
  true,
  10485760,  -- 10 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Authenticated users may upload to the bucket
CREATE POLICY "Authenticated users can upload design images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'design-images');

-- 3. Anyone can read design images (needed for public quote pages)
CREATE POLICY "Design images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-images');

-- 4. Users can update their own design images
CREATE POLICY "Users can update their own design images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'design-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Users can delete their own design images
CREATE POLICY "Users can delete their own design images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'design-images' AND auth.uid()::text = (storage.foldername(name))[1]);
