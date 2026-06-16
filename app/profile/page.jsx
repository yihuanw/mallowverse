"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function MainPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    email: "",
    companionCount: 0,
    studyTime: "0h 0m 0s",
    userSince: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("/assets/default.svg");

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/login");
        return;
      }

      const { id, email, created_at } = authData.user;
      setUserId(id);

      const { data: companions } = await supabase.from("companions").select("level, exp").eq("user_id", id);

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
    }

    loadProfile();
  }, [router]);

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

  return (
    <div>
      <div className="main">
        <div className="top">
          <div className="left-panel">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <img src={avatarUrl} alt="profile" className="profile-picture" onError={() => setAvatarUrl("/assets/default.svg")} />
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content">
                  <DropdownMenu.Item className="dropdown-item" onClick={() => fileInputRef.current?.click()}>
                    Change avatar
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="dropdown-item dropdown-item--danger" onClick={handleDeleteAvatar}>
                    Delete avatar
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <input type="file" accept="image/*" ref={fileInputRef} className="avatar-file-input" onChange={handleAvatarUpload} />
          </div>

          <div className="right-panel">
            <table>
              <tbody>
                <tr>
                  <td>user</td>
                  <td>{profileData.email}</td>
                </tr>
                <tr>
                  <td>companions</td>
                  <td>{profileData.companionCount}</td>
                </tr>
                <tr>
                  <td>time studied</td>
                  <td>{profileData.studyTime}</td>
                </tr>
                <tr>
                  <td>user since</td>
                  <td>{profileData.userSince}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-panel" />
      </div>

      <div className="main-buttons">
        <button type="button" title="back" onClick={() => router.push("/main")}>
          <img src="/icons/back.svg" width="20" />
        </button>
      </div>
    </div>
  );
}