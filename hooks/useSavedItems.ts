import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface SavedItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: "post" | "place";
  created_at: string;
}

export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ تحميل العناصر المحفوظة عند بدء التطبيق
  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Fetch all saved items for current user
  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSavedItems([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("saved_items")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;
      setSavedItems(data || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch saved items"
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if a specific item is saved
  const isSaved = (itemId: string, itemType: "post" | "place"): boolean => {
    return savedItems.some(
      (item) => item.item_id === itemId && item.item_type === itemType
    );
  };

  // Save an item
  const saveItem = async (
    itemId: string,
    itemType: "post" | "place"
  ): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: saveError } = await supabase
        .from("saved_items")
        .insert([
          {
            user_id: user.id,
            item_id: itemId,
            item_type: itemType,
          },
        ])
        .select()
        .single();

      if (saveError) throw saveError;

      // Update local state with real data from database
      if (data) {
        setSavedItems([
          ...savedItems,
          {
            id: data.id,
            user_id: data.user_id,
            item_id: data.item_id,
            item_type: data.item_type,
            created_at: data.created_at,
          },
        ]);
      }
      setError(null);
      return true;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save item";
      setError(errorMsg);
      return false;
    }
  };

  // Remove a saved item
  const removeItem = async (
    itemId: string,
    itemType: "post" | "place"
  ): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: deleteError } = await supabase
        .from("saved_items")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .eq("item_type", itemType);

      if (deleteError) throw deleteError;

      // Update local state
      setSavedItems(
        savedItems.filter(
          (item) => !(item.item_id === itemId && item.item_type === itemType)
        )
      );
      setError(null);
      return true;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to remove item";
      setError(errorMsg);
      return false;
    }
  };

  // Toggle save status
  const toggleSaveItem = async (
    itemId: string,
    itemType: "post" | "place"
  ): Promise<boolean> => {
    if (isSaved(itemId, itemType)) {
      return removeItem(itemId, itemType);
    } else {
      return saveItem(itemId, itemType);
    }
  };

  return {
    savedItems,
    loading,
    error,
    fetchSavedItems,
    saveItem,
    removeItem,
    toggleSaveItem,
    isSaved,
  };
};
