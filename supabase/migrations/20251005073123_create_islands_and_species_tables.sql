/*
  # Create Islands and Extinct Species Database Schema

  ## Overview
  This migration creates the core database structure for the interactive 3D globe application
  featuring seven islands and their associated extinct species.

  ## New Tables

  ### 1. `islands`
  Stores information about the seven featured islands including geographical, climate, and cultural data.
  - `id` (uuid, primary key) - Unique identifier for each island
  - `name` (text, unique, not null) - Island name
  - `latitude` (numeric, not null) - Geographical latitude coordinate
  - `longitude` (numeric, not null) - Geographical longitude coordinate
  - `climate` (text) - Climate description
  - `terrain` (text) - Terrain characteristics
  - `history` (text) - Historical information
  - `biodiversity` (text) - Biodiversity details
  - `cultural_significance` (text) - Cultural importance
  - `background_video_url` (text) - URL to the island's background video
  - `images` (jsonb) - Array of image URLs and descriptions
  - `order_index` (integer, not null) - Display order (1-7)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. `extinct_species`
  Contains data about extinct creatures endemic to each island.
  - `id` (uuid, primary key) - Unique identifier for each species
  - `island_id` (uuid, foreign key) - References the island table
  - `name` (text, not null) - Species name
  - `scientific_name` (text) - Scientific nomenclature
  - `type` (text, not null) - Creature type (bird, marine, reptile, mammal)
  - `description` (text) - Species description
  - `extinction_year` (integer) - Year of extinction
  - `extinction_cause` (text) - Reason for extinction
  - `narration_text` (text) - Story narration content
  - `narration_audio_url` (text) - URL to audio narration
  - `animation_config` (jsonb) - Animation settings (colors, movements)
  - `images` (jsonb) - Array of species image URLs
  - `wikipedia_url` (text) - Link to Wikipedia article
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 3. `transition_videos`
  Stores video URLs for smooth transitions between islands.
  - `id` (uuid, primary key) - Unique identifier
  - `from_island_id` (uuid, foreign key) - Source island
  - `to_island_id` (uuid, foreign key) - Destination island
  - `video_url` (text, not null) - Transition video URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `chat_interactions`
  Logs user interactions with the AI chatbox for analytics and improvement.
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (uuid) - User session identifier
  - `island_id` (uuid, foreign key, nullable) - Current island context
  - `user_question` (text, not null) - User's question
  - `ai_response` (text, not null) - AI's response
  - `sources` (jsonb) - Data sources used (documents, Wikipedia, ChatGPT)
  - `created_at` (timestamptz) - Interaction timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public read access for islands, species, and transition videos (public application)
  - Authenticated insert access for chat_interactions (when user tracking is implemented)
  - No public write access to core data tables (islands, species, transitions)

  ## Indexes
  - Index on islands.order_index for efficient ordered retrieval
  - Index on extinct_species.island_id for quick species lookup by island
  - Index on transition_videos compound key (from_island_id, to_island_id)
  - Index on chat_interactions.session_id for session-based queries
*/

-- Create islands table
CREATE TABLE IF NOT EXISTS islands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  climate text,
  terrain text,
  history text,
  biodiversity text,
  cultural_significance text,
  background_video_url text,
  images jsonb DEFAULT '[]'::jsonb,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create extinct_species table
CREATE TABLE IF NOT EXISTS extinct_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  island_id uuid REFERENCES islands(id) ON DELETE CASCADE,
  name text NOT NULL,
  scientific_name text,
  type text NOT NULL CHECK (type IN ('bird', 'marine', 'reptile', 'mammal')),
  description text,
  extinction_year integer,
  extinction_cause text,
  narration_text text,
  narration_audio_url text,
  animation_config jsonb DEFAULT '{}'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  wikipedia_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transition_videos table
CREATE TABLE IF NOT EXISTS transition_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_island_id uuid REFERENCES islands(id) ON DELETE CASCADE,
  to_island_id uuid REFERENCES islands(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_island_id, to_island_id)
);

-- Create chat_interactions table
CREATE TABLE IF NOT EXISTS chat_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  island_id uuid REFERENCES islands(id) ON DELETE SET NULL,
  user_question text NOT NULL,
  ai_response text NOT NULL,
  sources jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_islands_order ON islands(order_index);
CREATE INDEX IF NOT EXISTS idx_species_island ON extinct_species(island_id);
CREATE INDEX IF NOT EXISTS idx_transitions_from_to ON transition_videos(from_island_id, to_island_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_interactions(created_at);

-- Enable Row Level Security
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE extinct_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE transition_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for islands (public read access)
CREATE POLICY "Islands are viewable by everyone"
  ON islands FOR SELECT
  TO public
  USING (true);

-- RLS Policies for extinct_species (public read access)
CREATE POLICY "Species are viewable by everyone"
  ON extinct_species FOR SELECT
  TO public
  USING (true);

-- RLS Policies for transition_videos (public read access)
CREATE POLICY "Transition videos are viewable by everyone"
  ON transition_videos FOR SELECT
  TO public
  USING (true);

-- RLS Policies for chat_interactions (public can insert, no one can read for privacy)
CREATE POLICY "Anyone can log chat interactions"
  ON chat_interactions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only system can read chat interactions"
  ON chat_interactions FOR SELECT
  TO authenticated
  USING (false);