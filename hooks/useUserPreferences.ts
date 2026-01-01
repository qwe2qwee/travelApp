import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export interface UserPreferences {
  id: string;
  user_id: string;
  interests: string[];
  preferred_cities: string[];
  budget_level: "budget" | "moderate" | "luxury";
  travel_style: "relaxed" | "balanced" | "intensive";
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user preferences
  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: fetchError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows found" which is okay for new users
        throw fetchError;
      }

      setPreferences(data || null);
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch preferences";
      // Don't set error for "no rows found" case
      if (!err?.toString().includes("PGRST116")) {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create user preferences
  const createPreferences = async (
    prefs: Partial<
      Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">
    >
  ): Promise<UserPreferences | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: insertError } = await supabase
        .from("user_preferences")
        .insert([
          {
            user_id: user.id,
            interests: prefs.interests || [],
            preferred_cities: prefs.preferred_cities || [],
            budget_level: prefs.budget_level || "moderate",
            travel_style: prefs.travel_style || "balanced",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setPreferences(data);
      setError(null);
      return data;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create preferences";
      setError(errorMsg);
      return null;
    }
  };

  // Update user preferences
  const updatePreferences = async (
    updates: Partial<
      Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">
    >
  ): Promise<UserPreferences | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: updateError } = await supabase
        .from("user_preferences")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPreferences(data);
      setError(null);
      return data;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update preferences";
      setError(errorMsg);
      return null;
    }
  };

  // Add interest to preferences
  const addInterest = async (interest: string): Promise<boolean> => {
    try {
      if (!preferences) {
        // If no preferences exist, create them
        const newPrefs = await createPreferences({
          interests: [interest],
        });
        return newPrefs !== null;
      }

      const updatedInterests = Array.from(
        new Set([...preferences.interests, interest])
      );
      const updated = await updatePreferences({
        interests: updatedInterests,
      });
      return updated !== null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add interest");
      return false;
    }
  };

  // Remove interest from preferences
  const removeInterest = async (interest: string): Promise<boolean> => {
    try {
      if (!preferences) return false;

      const updatedInterests = preferences.interests.filter(
        (i) => i !== interest
      );
      const updated = await updatePreferences({
        interests: updatedInterests,
      });
      return updated !== null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove interest"
      );
      return false;
    }
  };

  // Add preferred city
  const addPreferredCity = async (city: string): Promise<boolean> => {
    try {
      if (!preferences) {
        const newPrefs = await createPreferences({
          preferred_cities: [city],
        });
        return newPrefs !== null;
      }

      const updatedCities = Array.from(
        new Set([...preferences.preferred_cities, city])
      );
      const updated = await updatePreferences({
        preferred_cities: updatedCities,
      });
      return updated !== null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add preferred city"
      );
      return false;
    }
  };

  // Remove preferred city
  const removePreferredCity = async (city: string): Promise<boolean> => {
    try {
      if (!preferences) return false;

      const updatedCities = preferences.preferred_cities.filter(
        (c) => c !== city
      );
      const updated = await updatePreferences({
        preferred_cities: updatedCities,
      });
      return updated !== null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove preferred city"
      );
      return false;
    }
  };

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    createPreferences,
    updatePreferences,
    addInterest,
    removeInterest,
    addPreferredCity,
    removePreferredCity,
  };
};
