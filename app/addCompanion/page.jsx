"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const COMPANION_OPTIONS = ["calico", "samoyed"];

export default function MainPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [selectedCompanion, setSelectedCompanion] = useState(null);

  const [nameError, setNameError] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [companionError, setCompanionError] = useState(false);

  const canSubmit = name.trim() && field.trim() && selectedCompanion;

  async function handleSubmit(e) {
    e.preventDefault();

    setNameError(false);
    setFieldError(false);
    setCompanionError(false);

    let valid = true;

    if (!name.trim()) {
      setNameError(true);
      valid = false;
    }

    if (!field.trim()) {
      setFieldError(true);
      valid = false;
    }

    if (!selectedCompanion) {
      setCompanionError(true);
      valid = false;
    }

    if (!valid) return;

    const { data: authData } = await supabase.auth.getSession();
    const user = authData.session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("companions").insert({
      user_id: user.id,
      name,
      field,
      companion: selectedCompanion,
    });

    if (error) {
      console.error(error);
      return;
    }

    router.push("/main?success=1");
  }

  return (
    <div>
      <div className="main-full add-companion">
        <label className="companions-label">creating new companion</label>
        <input
          className={`input ${nameError ? "input-error" : ""}`}
          type="text"
          placeholder="enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={`input ${fieldError ? "input-error" : ""}`}
          type="text"
          placeholder="enter field"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />

        <label className="companions-label">select companion style</label>
        <div className="companions-container" style={{ paddingTop: "10px" }}>
          {COMPANION_OPTIONS.map((companion) => (
            <div
              key={companion}
              className={`companion-card add-companion ${selectedCompanion === companion ? "selected" : ""}`}
              onClick={() => {
                setSelectedCompanion(companion);
                setCompanionError(false);
              }}
            >
              <img src={`/assets/${companion}.gif`} alt={companion} width="120" height="120" />

              <label className="companion-card-text">{companion}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="main-buttons">
        <button type="button" title="cancel" onClick={() => router.push("/main")}>
          <img src="/icons/cancel.svg" width="20" />
        </button>
        <button type="button" title="confirm" onClick={handleSubmit} disabled={!canSubmit}>
          <img src="/icons/confirm.svg" width="20" />
        </button>
      </div>
    </div>
  );
}
