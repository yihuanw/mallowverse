"use client";

import { useRouter } from "next/navigation";

export default function MainPage() {
    const router = useRouter();

    function goLogin() {
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
                                <td>pet</td>
                                <td>[pet]</td>
                            </tr>
                            <tr>
                                <td>name</td>
                                <td>[name]</td>
                            </tr>
                            <tr>
                                <td>level</td>
                                <td>[#]</td>
                            </tr>
                            <tr>
                                <td>field</td>
                                <td>[field]</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bottom-panel"></div>
        </div>
    );
}