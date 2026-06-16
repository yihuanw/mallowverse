"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function MainPage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    email: "",
    companionCount: 0,
    studyTime: "0h 0m 0s",
    userSince: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      const user = authData.user;

      const { data: companions } = await supabase.from("companions").select("level, exp").eq("user_id", user.id);

      const companionCount = companions?.length ?? 0;

      const totalLevels = companions?.reduce((sum, c) => sum + c.level, 0) ?? 0;

      const totalExp = companions?.reduce((sum, c) => sum + c.exp, 0) ?? 0;

      let totalSeconds = totalLevels * 3600 + totalExp;

      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setProfileData({
        email: user.email ?? "",
        companionCount,
        studyTime: `${hours}h ${minutes}m ${seconds}s`,
        userSince: new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }

    loadProfile();
  }, [router]);

  function handleBack() {
    router.push("/main");
  }

  return (
    <div>
      <div className="main">
        <div className="top">
          <div className="left-panel">
            <img src="/assets/calico.gif" alt="calico" />
          </div>

          <div className="right-panel">
            <table>
              <tbody>
                <tr>
                  <td>user</td>
                  <td>{profileData?.email}</td>
                </tr>
                <tr>
                  <td>companions</td>
                  <td>{profileData?.companionCount}</td>
                </tr>
                <tr>
                  <td>time studied</td>
                  <td>{profileData?.studyTime}</td>
                </tr>
                <tr>
                  <td>user since</td>
                  <td>
                    {profileData?.userSince}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-panel"></div>
      </div>

      <div className="main-buttons">
        <button type="button" title="back" onClick={handleBack}>
          <img src="/icons/back.svg" width="20" />
        </button>
      </div>
    </div>
  );
}
