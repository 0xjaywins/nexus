// import { useMiniAppContext } from "@/components/providers/farcaster-provider";
import { FrameContext } from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import { useMiniAppContext } from "../../components/providers/farcaster-provider";

interface WarpcastUser {
  fid?: number;
  pfpUrl?: string;
  username?: string;
  displayName?: string;
}

interface FarcasterContextResult {
  context: FrameContext;
  actions: typeof sdk.actions | null;
  isEthProviderAvailable: boolean;
  user: WarpcastUser;
  showSplash: boolean;
}

interface NoContextResult {
  type: null;
  context: null;
  actions: null;
  isEthProviderAvailable: boolean;
  user: null;
  showSplash: boolean;
}

type ContextResult = FarcasterContextResult | NoContextResult;

export const useMiniAppContexted = (): ContextResult => {
  try {
    const farcasterContext = useMiniAppContext();
    if (farcasterContext.context) {
      console.log("Farcaster Context:", farcasterContext.context);
      const context = farcasterContext.context;
      const user: WarpcastUser = {
        fid: context?.user?.fid ?? undefined,
        pfpUrl: context?.user?.pfpUrl ?? undefined,
        username: context?.user?.username ?? undefined,
        displayName: context?.user?.displayName ?? undefined,
      };
      return {
        context,
        actions: farcasterContext.actions,
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
        user,
        showSplash: farcasterContext.showSplash,
      } as FarcasterContextResult;
    }
  } catch (e) {
    console.error("Error accessing Farcaster context:", e);
  }
  return {
    type: null,
    context: null,
    actions: null,
    isEthProviderAvailable:
      typeof window !== "undefined" && !!(window as any).ethereum,
    user: null,
    showSplash: false,
  } as NoContextResult;
};
