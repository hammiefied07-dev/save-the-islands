import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ChatRequest {
  question: string;
  islandId: string | null;
  sessionId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { question, islandId, sessionId }: ChatRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let context = '';

    if (islandId) {
      const { data: island } = await supabase
        .from('islands')
        .select('*')
        .eq('id', islandId)
        .maybeSingle();

      const { data: species } = await supabase
        .from('extinct_species')
        .select('*')
        .eq('island_id', islandId);

      if (island) {
        context = `Current island: ${island.name}\n`;
        context += `Climate: ${island.climate || 'N/A'}\n`;
        context += `Terrain: ${island.terrain || 'N/A'}\n`;
        context += `History: ${island.history || 'N/A'}\n`;
        context += `Biodiversity: ${island.biodiversity || 'N/A'}\n`;
        context += `Cultural Significance: ${island.cultural_significance || 'N/A'}\n\n`;
      }

      if (species && species.length > 0) {
        context += 'Extinct species on this island:\n';
        species.forEach(sp => {
          context += `- ${sp.name} (${sp.scientific_name || 'unknown'}): ${sp.description || 'No description'}\n`;
          context += `  Type: ${sp.type}, Extinct: ${sp.extinction_year || 'unknown'}, Cause: ${sp.extinction_cause || 'unknown'}\n`;
        });
      }
    } else {
      const { data: allIslands } = await supabase
        .from('islands')
        .select('name, latitude, longitude')
        .order('order_index');

      if (allIslands) {
        context = 'Available islands:\n';
        allIslands.forEach(island => {
          context += `- ${island.name} (Lat: ${island.latitude}, Lng: ${island.longitude})\n`;
        });
      }
    }

    const systemPrompt = `You are an expert guide for an interactive 3D globe application about islands and their extinct species. You provide engaging, educational, and concise responses about island geography, climate, history, culture, and extinct species. Use the provided context to answer questions accurately. If you don't have specific information, be honest but helpful. Keep responses conversational and engaging.`;

    const prompt = `${systemPrompt}\n\nContext:\n${context}\n\nUser question: ${question}\n\nProvide a helpful, engaging response:`;

    const aiResponse = generateMockResponse(question, context, islandId !== null);

    await supabase.from('chat_interactions').insert({
      session_id: sessionId,
      island_id: islandId,
      user_question: question,
      ai_response: aiResponse,
      sources: { type: 'internal_database' }
    });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generateMockResponse(question: string, context: string, hasIslandContext: boolean): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('weather') || lowerQuestion.includes('climate')) {
    if (hasIslandContext && context.includes('Climate:')) {
      const climateMatch = context.match(/Climate: (.+?)\n/);
      if (climateMatch && climateMatch[1] !== 'N/A') {
        return climateMatch[1];
      }
    }
    return 'The climate varies by island. Some have tropical climates with warm temperatures year-round, while others experience more temperate conditions with distinct seasons.';
  }

  if (lowerQuestion.includes('extinct') || lowerQuestion.includes('species') || lowerQuestion.includes('animal')) {
    if (context.includes('Extinct species on this island:')) {
      return 'This island was home to several remarkable extinct species. Each played a unique role in the ecosystem before disappearing due to various factors including habitat loss, introduced predators, and climate change. Would you like to know more about any specific species?';
    }
    return 'Many islands around the world have lost unique species to extinction. These islands are particularly notable for their endemic species that evolved in isolation and were vulnerable to environmental changes and human activity.';
  }

  if (lowerQuestion.includes('history') || lowerQuestion.includes('discovered')) {
    if (hasIslandContext && context.includes('History:')) {
      const historyMatch = context.match(/History: (.+?)\n/);
      if (historyMatch && historyMatch[1] !== 'N/A') {
        return historyMatch[1];
      }
    }
    return 'Each island has a rich history of discovery and human interaction. Many were isolated for millennia before contact with explorers, which unfortunately often led to devastating impacts on native species.';
  }

  if (lowerQuestion.includes('terrain') || lowerQuestion.includes('geography') || lowerQuestion.includes('landscape')) {
    if (hasIslandContext && context.includes('Terrain:')) {
      const terrainMatch = context.match(/Terrain: (.+?)\n/);
      if (terrainMatch && terrainMatch[1] !== 'N/A') {
        return terrainMatch[1];
      }
    }
    return 'The terrain varies significantly across these islands, from volcanic peaks to lush forests and coastal plains. Each landscape created unique habitats for diverse species.';
  }

  if (lowerQuestion.includes('culture') || lowerQuestion.includes('people')) {
    if (hasIslandContext && context.includes('Cultural Significance:')) {
      const cultureMatch = context.match(/Cultural Significance: (.+?)\n/);
      if (cultureMatch && cultureMatch[1] !== 'N/A') {
        return cultureMatch[1];
      }
    }
    return 'These islands hold deep cultural significance for their indigenous peoples and continue to be important sites for scientific research and conservation efforts.';
  }

  return 'That\'s an interesting question! Feel free to ask me about the climate, terrain, history, biodiversity, cultural significance, or extinct species of these remarkable islands. I\'m here to help you explore and learn!';
}
