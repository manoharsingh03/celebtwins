
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // For this example, we'll use a mock API response with celebrity data
    // In a real implementation, you would call a face recognition API like:
    // - Microsoft Azure Face API
    // - Amazon Rekognition
    // - Kairos Face Recognition
    // These typically require paid subscriptions, but offer free tiers

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock celebrity database with diverse celebrities
    const celebrityDatabase = [
      {
        id: "1",
        name: "Dwayne Johnson",
        image: "https://m.media-amazon.com/images/M/MV5BMTkyNDQ3NzAxM15BMl5BanBnXkFtZTgwODIwMTQ0NTE@._V1_UY1200_CR84,0,630,1200_AL_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "2",
        name: "Zendaya",
        image: "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDAtYjI3Mi00OTk3LTg0NDEtNWFlNzE5NDM5MWM1XkEyXkFqcGdeQXVyOTI3MjYwOQ@@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "3",
        name: "Ryan Reynolds",
        image: "https://m.media-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UY1200_CR146,0,630,1200_AL_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "4",
        name: "Jennifer Lawrence",
        image: "https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "5",
        name: "Idris Elba",
        image: "https://m.media-amazon.com/images/M/MV5BNzEzMTI2NjEyNF5BMl5BanBnXkFtZTcwNTA0OTE4OA@@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "6",
        name: "Priyanka Chopra",
        image: "https://m.media-amazon.com/images/M/MV5BMjAxNzUwNjExOV5BMl5BanBnXkFtZTcwNDUyMTUxNw@@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "7",
        name: "Chris Hemsworth",
        image: "https://m.media-amazon.com/images/M/MV5BOTU2MTI0NTIyNV5BMl5BanBnXkFtZTcwMTA4Nzc3OA@@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      },
      {
        id: "8",
        name: "Viola Davis",
        image: "https://m.media-amazon.com/images/M/MV5BNzUxNjM4ODI1OV5BMl5BanBnXkFtZTgwNzMwMjU5NzE@._V1_.jpg",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      }
    ];

    // Randomly select 3-5 celebrities
    const numberOfMatches = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...celebrityDatabase].sort(() => 0.5 - Math.random());
    const selectedCelebrities = shuffled.slice(0, numberOfMatches);
    
    // Sort by match percentage descending
    selectedCelebrities.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // For authenticated users, store the match in the database
    let matchId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: authHeader },
            },
          }
        );
        
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        
        if (user) {
          const { data, error } = await supabaseClient
            .from('celebrity_matches')
            .insert({
              user_id: user.id,
              user_image: imageUrl,
              celebrities: selectedCelebrities
            })
            .select()
            .single();
            
          if (error) {
            console.error('Error saving match:', error);
          } else {
            matchId = data.id;
          }
        }
      } catch (err) {
        console.error('Error processing authenticated request:', err);
      }
    }

    return new Response(
      JSON.stringify({
        celebrities: selectedCelebrities,
        matchId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
