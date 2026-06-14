"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getActiveCompanion } from "../../lib/companion";

export default function MainPage() {
    const router = useRouter();
    const [companion, setCompanion] = useState(null)

    useEffect(() => {
        async function loadCompanion() {
            const { data: userData } = await supabase.auth.getUser();

            if (!userData?.user) return;

            const result = await getActiveCompanion(userData.user.id);
            
            setCompanion(result);
        }
        loadCompanion();
    }, []);

    async function goLogin() {
        router.push("/login");
    }

    return (
        <div>
            <div className="main">
                <div className="top">
                    <div className="left-panel">
                        <img
                            src="/assets/calico.gif"
                            alt="calico"
                            onClick={goLogin}
                        />
                    </div>

                    <div className="right-panel">
                        <table>
                            <tbody>
                                <tr>
                                    <td>companion</td>
                                    <td>{companion?.companion}</td>
                                </tr>
                                <tr>
                                    <td>name</td>
                                    <td>{companion?.name}</td>
                                </tr>
                                <tr>
                                    <td>level</td>
                                    <td>{companion?.level}</td>
                                </tr>
                                <tr>
                                    <td>field</td>
                                    <td>{companion?.field}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bottom-panel">
                    <div className="bottom-container">
                        <div className="timepiece">
                            <button type="button">timer</button>
                            <button type="button">stopwatch</button>
                        </div>
                        <div className="clock">
                            <label>25:13</label>
                        </div>

                        <label className="exp-notif">+ 5 exp</label>
                        <div className="exp-bar">
                            <div className="exp-filled"></div>
                        </div>
                        <label className="exp-ratio">{companion?.exp}/100</label>
                    </div>
                </div>
            </div>
            <div className="main-buttons">
                <button type="button" title="profile">
                    <img src="/icons/profile.svg" width="20"/>
                </button>
                <button type="button" title="switch field">
                    <img src="/icons/switch.svg" width="20"/>
                </button>
                <button type="button" title="add field">
                    <img src="/icons/add.svg" width="20"/>
                </button>
                <div className="divider"></div>
                <button type="button" title="log out">
                    <img src="/icons/logout.svg" width="20"/>
                </button>
            </div>
        </div>
    );
}