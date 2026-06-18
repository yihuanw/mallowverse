import { Suspense } from "react";
import MainPage from "./mainPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MainPage />
    </Suspense>
  );
}