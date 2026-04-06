-- BakeOps - Baker Style Reference Images
-- Migration: 013_style_reference_images
-- Adds a column for bakers to store public URLs of their uploaded style reference images.
-- These images are stored in the existing 'design-images' bucket under {userId}/style-images/
-- and are automatically used as AI style conditioning when generating new cake mockups.

ALTER TABLE public.bakers
ADD COLUMN IF NOT EXISTS style_reference_images TEXT[] DEFAULT ARRAY[]::TEXT[];
