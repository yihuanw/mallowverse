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
                        <button>timer</button>
                        <button>stopwatch</button>
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
    );
}