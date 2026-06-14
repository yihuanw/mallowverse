"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        async function check() {
            const { data: { user } } = await supabase.auth.getUser();

            router.replace(user ? "/main" : "/login");
        }

        check();
    }, []);

    return null;
}