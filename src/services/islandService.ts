import { supabase } from '../lib/supabase';

export interface Island {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  climate: string | null;
  terrain: string | null;
  history: string | null;
  biodiversity: string | null;
  cultural_significance: string | null;
  background_video_url: string | null;
  images: string[];
  order_index: number;
}

export interface ExtinctSpecies {
  id: string;
  island_id: string | null;
  name: string;
  scientific_name: string | null;
  type: 'bird' | 'marine' | 'reptile' | 'mammal';
  description: string | null;
  extinction_year: number | null;
  extinction_cause: string | null;
  narration_text: string | null;
  narration_audio_url: string | null;
  animation_config: {
    colors?: string[];
    movements?: string[];
    size?: string;
  };
  images: string[];
  wikipedia_url: string | null;
}

export async function fetchAllIslands(): Promise<Island[]> {
  const { data, error } = await supabase
    .from('islands')
    .select('*')
    .order('order_index');

  if (error) throw error;
  return data as Island[];
}

export async function fetchIslandById(id: string): Promise<Island | null> {
  const { data, error } = await supabase
    .from('islands')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Island | null;
}

export async function fetchSpeciesByIsland(islandId: string): Promise<ExtinctSpecies[]> {
  const { data, error } = await supabase
    .from('extinct_species')
    .select('*')
    .eq('island_id', islandId);

  if (error) throw error;
  return data as ExtinctSpecies[];
}

export async function fetchAllSpecies(): Promise<ExtinctSpecies[]> {
  const { data, error } = await supabase
    .from('extinct_species')
    .select('*');

  if (error) throw error;
  return data as ExtinctSpecies[];
}
