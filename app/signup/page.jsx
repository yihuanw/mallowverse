"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [codeError, setCodeError] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setEmailError(false);
        setPasswordError(false);
        setCodeError(false);

        let valid = true;

        if (!email.trim()) {
            setEmailError(true);
            valid = false;
        }

        if (!password.trim()) {
            setPasswordError(true);
            valid = false;
        }

        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        const api = await res.json();

        if (!api.valid) {
            setCodeError(true);
            valid = false;
        }

        if (!valid) return;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error(error);
            return;
        }

        router.push("/login?success=1");
    }

    function handleLogIn() {
        router.push("/login")
    }

    return (
        <div className="signup_main">
            <h2 className="signup_title">sign up</h2>
            <div className="signup_form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={emailError ? "error" : ""}
                    />
                    <br /><br />

                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={passwordError ? "error" : ""}
                    />
                    <br /><br />

                    <input
                        type="text"
                        placeholder="access code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={codeError ? "error" : ""}
                    />
                    <br /><br />

                    <button type="submit">submit</button>
                    <button onClick={handleLogIn}>log in</button>
                </form>
            </div>
        </div>
    );
}