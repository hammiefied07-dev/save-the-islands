export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      islands: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          climate: string | null
          terrain: string | null
          history: string | null
          biodiversity: string | null
          cultural_significance: string | null
          background_video_url: string | null
          images: Json
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          latitude: number
          longitude: number
          climate?: string | null
          terrain?: string | null
          history?: string | null
          biodiversity?: string | null
          cultural_significance?: string | null
          background_video_url?: string | null
          images?: Json
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          climate?: string | null
          terrain?: string | null
          history?: string | null
          biodiversity?: string | null
          cultural_significance?: string | null
          background_video_url?: string | null
          images?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      extinct_species: {
        Row: {
          id: string
          island_id: string | null
          name: string
          scientific_name: string | null
          type: 'bird' | 'marine' | 'reptile' | 'mammal'
          description: string | null
          extinction_year: number | null
          extinction_cause: string | null
          narration_text: string | null
          narration_audio_url: string | null
          animation_config: Json
          images: Json
          wikipedia_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          island_id?: string | null
          name: string
          scientific_name?: string | null
          type: 'bird' | 'marine' | 'reptile' | 'mammal'
          description?: string | null
          extinction_year?: number | null
          extinction_cause?: string | null
          narration_text?: string | null
          narration_audio_url?: string | null
          animation_config?: Json
          images?: Json
          wikipedia_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          island_id?: string | null
          name?: string
          scientific_name?: string | null
          type?: 'bird' | 'marine' | 'reptile' | 'mammal'
          description?: string | null
          extinction_year?: number | null
          extinction_cause?: string | null
          narration_text?: string | null
          narration_audio_url?: string | null
          animation_config?: Json
          images?: Json
          wikipedia_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transition_videos: {
        Row: {
          id: string
          from_island_id: string | null
          to_island_id: string | null
          video_url: string
          created_at: string
        }
        Insert: {
          id?: string
          from_island_id?: string | null
          to_island_id?: string | null
          video_url: string
          created_at?: string
        }
        Update: {
          id?: string
          from_island_id?: string | null
          to_island_id?: string | null
          video_url?: string
          created_at?: string
        }
      }
      chat_interactions: {
        Row: {
          id: string
          session_id: string
          island_id: string | null
          user_question: string
          ai_response: string
          sources: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          island_id?: string | null
          user_question: string
          ai_response: string
          sources?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          island_id?: string | null
          user_question?: string
          ai_response?: string
          sources?: Json
          created_at?: string
        }
      }
    }
  }
}
