import { Suspense } from "react";
import { SwapPage } from "../../../components/swap/swap-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SwapPage />
    </Suspense>
  );
}
