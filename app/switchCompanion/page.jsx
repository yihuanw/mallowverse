"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function MainPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: companions } = await supabase
        .from("companions")
        .select("id, companion, name, level, field, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setCompanions(companions || []);
    }

    loadProfile();
  }, [router]);

  async function setActiveCompanion(companionId) {
    const { data: authData } = await supabase.auth.getSession();
    const user = authData.session?.user;

    await supabase.from("companions").update({ active: false }).eq("user_id", user.id);
    await supabase.from("companions").update({ active: true }).eq("id", companionId);

    router.push("/main");
  }

  return (
    <div>
      <div className="main-full">
        <label className="companions-label">companions</label>
        <div className="companions-container" style={{ height: "100%" }}>
          {companions.map((companion) => (
            <div className="companion-card" key={companion.name}>
              <img
                src={`/assets/${companion.companion}.gif`}
                alt={companion.companion}
                width="120"
                height="120"
                onClick={() => setActiveCompanion(companion.id)}
              />

              <label className="companion-card-text">
                {companion.name}
                <br />
                lvl {companion.level}
                <br />
                {companion.field}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="main-buttons">
        <button type="button" title="back" onClick={() => router.push("/main")}>
          <img src="/icons/back.svg" width="20" />
        </button>
      </div>
    </div>
  );
}
