"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useLogic } from "./useLogic";
import { Avatar } from "./avatar";

export default function MainPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const session = useLogic(router);

  return (
    <div>
      <div className="main">
        <div className="top">
          <div className="left-panel">
            <Avatar
              avatarUrl={session.avatarUrl}
              setAvatarUrl={session.setAvatarUrl}
              fileInputRef={fileInputRef}
              onUpload={session.handleAvatarUpload}
              onDelete={session.handleDeleteAvatar}
            />
          </div>

          <div className="right-panel">
            <table>
              <tbody>
                <tr>
                  <td>user</td>
                  <td>{session.profileData.email}</td>
                </tr>
                <tr>
                  <td>companions</td>
                  <td>{session.profileData.companionCount}</td>
                </tr>
                <tr>
                  <td>time studied</td>
                  <td>{session.profileData.studyTime}</td>
                </tr>
                <tr>
                  <td>user since</td>
                  <td>{session.profileData.userSince}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-panel">
          <label className="label-profile">companions</label>
          <div className="companions-container">
            {session.companions.map((companion) => (
              <div key={companion.name} className="companion-card">
                <img src={`/assets/${companion.companion}.gif`} alt={companion.companion} width="120px" height="120px" />
                <label>
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
      </div>

      <div className="main-buttons">
        <button type="button" title="back" onClick={() => router.push("/main")}>
          <img src="/icons/back.svg" width="20" />
        </button>
      </div>
    </div>
  );
}