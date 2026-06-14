"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const success = searchParams.get("success");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setEmailError(false);
        setPasswordError(false);

        let valid = true;

        if (!email.trim()) {
            setEmailError(true);
            valid = false;
        }

        if (!password.trim()) {
            setPasswordError(true);
            valid = false;
        }

        if (!valid) return;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setEmailError(true);
            setPasswordError(true);
            return;
        }

        router.push("/main");
    }

    function handleSignUp() {
        router.push("/signup")
    }

    return (
        <div className="login_main">
            {success && (
                <div className="toast">
                    Successfully created user!
                </div>
            )}
            <h2 className="login_title">log in</h2>
            <div className="login_form">
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

                    <button type="submit">submit</button>
                    <button onClick={handleSignUp}>sign up</button>
                </form>
            </div>
        </div>
    );
}