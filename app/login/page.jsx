import { Suspense } from "react";
import LoginPage from "./loginPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}