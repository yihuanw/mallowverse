import { supabase } from "./supabase.js";

export async function getActiveCompanion(userId) {
  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
