"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  function handleSubmit(e) {
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

    if (valid) {
      router.push("/main");
    }
  }

  return (
    <div className="login">
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
      </form>
    </div>
  );
}