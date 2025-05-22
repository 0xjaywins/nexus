// /lib/hook/use-mini-app.ts
import { useMiniAppContext } from "../../components/providers/farcaster-provider";
import { ContextResult, WarpcastUser, FrameContext } from "../../types";

export const useMiniAppContexted = (): ContextResult => {
  try {
    const farcasterContext = useMiniAppContext();
    if (farcasterContext.context) {
      console.log("Farcaster Context:", farcasterContext.context);
      const context: FrameContext = farcasterContext.context;
      const user: WarpcastUser = {
        fid: context.user.fid,
        pfpUrl: context.user.pfpUrl ?? undefined,
        username: context.user.username ?? undefined,
        displayName: context.user.displayName ?? undefined,
      };
      return {
        context,
        actions: {
          ...farcasterContext,
          sendToken: async () => {
            throw new Error("sendToken not implemented");
          },
        },
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
        user,
        showSplash: farcasterContext.showSplash,
      };
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
  };
};
