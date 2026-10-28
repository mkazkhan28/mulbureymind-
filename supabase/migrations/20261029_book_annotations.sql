-- Highlights and notes students make in the in-site book reader.
-- Not used yet: the reader stores notes in the browser until Supabase auth is connected.

CREATE TABLE IF NOT EXISTS public.book_annotations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id     text NOT NULL,
  page        integer NOT NULL CHECK (page > 0),
  rects       jsonb NOT NULL DEFAULT '[]'::jsonb,   -- [{x,y,w,h}] as fractions of the page
  color       text NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow','green','blue','pink')),
  quote       text NOT NULL DEFAULT '',
  note        text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_book_annotations_user_book ON public.book_annotations(user_id, book_id);

ALTER TABLE public.book_annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own book annotations"
  ON public.book_annotations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
