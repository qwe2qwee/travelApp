import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Post {
  id: string;
  user_id: string;
  media_url: string;
  media_type: "photo" | "video";
  title: string | null;
  caption: string | null;
  category: string | null;
  lat: number | null;
  lng: number | null;
  spot_name: string | null;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const usePosts = (limit = 20) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profile:profiles(display_name, avatar_url)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      setPosts(data as Post[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      // Get the post to find the media path
      const { data: post } = await supabase
        .from("posts")
        .select("media_url")
        .eq("id", postId)
        .maybeSingle();

      if (post && post.media_url) {
        // Extract the path from the full URL
        const url = new URL(post.media_url);
        const filePath = url.pathname.split(
          "/storage/v1/object/public/posts/"
        )[1];

        // Delete from storage
        if (filePath) {
          await supabase.storage.from("posts").remove([filePath]);
        }
      }

      // Delete the post record
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;

      // Update the local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete post";
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("posts-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const newPost = payload.new as Post;
          // Add new post to the beginning
          setPosts((prevPosts) => [newPost, ...prevPosts.slice(0, limit - 1)]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const deletedPostId = payload.old.id;
          // Remove deleted post from the list
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== deletedPostId)
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [limit]);

  return { posts, loading, error, refetch: fetchPosts, deletePost };
};
