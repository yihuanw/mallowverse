import { supabase } from "./supabase.js";

export async function getActiveCompanion(userId) {
  const { data: companions, error } = await supabase
    .from("companions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return null;
  }

  if (!companions || companions.length === 0) {
    return null;
  }

  // if only one companion exists, ensure it's active
  if (companions.length === 1 && !companions[0].active) {
    const only = companions[0];

    const { error: updateError } = await supabase
      .from("companions")
      .update({ active: true })
      .eq("id", only.id);

    if (updateError) {
      console.error(updateError);
    }
  }

  const { data, error: activeError } = await supabase
    .from("companions")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (activeError) {
    console.error(activeError);
    return null;
  }

  return data;
}