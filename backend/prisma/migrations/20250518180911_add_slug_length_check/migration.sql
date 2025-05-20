ALTER TABLE "Link"
ADD CONSTRAINT short_slug_length_check
CHECK (char_length("shortSlug") >= 4 AND char_length("shortSlug") <= 15);
