"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function useLogic(router) {
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    email: "",
    companionCount: 0,
    studyTime: "0h 0m 0s",
    userSince: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("/assets/default.svg");
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }

      const { id, email, created_at } = user;
      setUserId(id);

      const { data: companions } = await supabase
        .from("companions")
        .select("id, companion, name, level, exp, field, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: true });

      const totalSeconds = (companions?.reduce((sum, c) => sum + c.level, 0) ?? 0) * 3600 + (companions?.reduce((sum, c) => sum + c.exp, 0) ?? 0);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setProfileData({
        email,
        companionCount: companions?.length ?? 0,
        studyTime: `${hours}h ${minutes}m ${seconds}s`,
        userSince: new Date(created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      const { data } = supabase.storage.from("avatars").getPublicUrl(`${id}.png`);
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);

      setCompanions(companions || []);
    }

    loadProfile();
  }, []);

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("avatar file too large (max 2MB)");
      return;
    }

    const filePath = `${userId}.png`;
    const { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true, contentType: file.type });

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    event.target.value = "";
  }

  async function handleDeleteAvatar() {
    if (!userId) return;
    await supabase.storage.from("avatars").remove([`${userId}.png`]);
    setAvatarUrl("/assets/default.svg");
  }

  async function handleChangeCompanion(companion, newCompanion) {
    if (!userId) return;
    const { error } = await supabase.from("companions").update({ companion: newCompanion }).eq("user_id", userId).eq("id", companion.id);

    if (error) {
      console.error("Change companion error:", error);
      return;
    }

    setCompanions((prev) => prev.map((c) => (c.id === companion.id ? { ...c, companion: newCompanion } : c)));
  }

  async function handleChangeName(companion, newName) {
    if (!userId || !newName || newName === companion.name) return;
    const { error } = await supabase.from("companions").update({ name: newName }).eq("user_id", userId).eq("id", companion.id);

    if (error) {
      console.error("Change name error:", error);
      return;
    }

    setCompanions((prev) => prev.map((c) => (c.id === companion.id ? { ...c, name: newName } : c)));
  }

  async function handleChangeField(companion, newField) {
    if (!userId) return;
    const { error } = await supabase.from("companions").update({ field: newField }).eq("user_id", userId).eq("id", companion.id);

    if (error) {
      console.error("Change field error:", error);
      return;
    }

    setCompanions((prev) => prev.map((c) => (c.id === companion.id ? { ...c, field: newField } : c)));
  }

  async function handleDeleteCompanion(companion) {
    if (!userId) return;
    const { error } = await supabase.from("companions").delete().eq("user_id", userId).eq("id", companion.id);

    if (error) {
      console.error("Delete companion error:", error);
      return;
    }

    setCompanions((prev) => prev.filter((c) => c.id !== companion.id));
    setProfileData((prev) => ({ ...prev, companionCount: prev.companionCount - 1 }));
  }

  return {
    userId,
    profileData,
    avatarUrl,
    setAvatarUrl,
    companions,
    handleAvatarUpload,
    handleDeleteAvatar,
    handleChangeCompanion,
    handleChangeName,
    handleChangeField,
    handleDeleteCompanion,
  };
}
