import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Place {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  category: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async () => {
    setLoading(true); // Optionally set loading to true on refetch
    try {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlaces(data as Place[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch places");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return { places, loading, error, refetch: fetchPlaces };
};
