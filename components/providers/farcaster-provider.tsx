"use client";

import { FrameContext } from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import FrameWalletProvider from "./frame-provider";

interface FrameContextValue {
	context: FrameContext | null;
	isSDKLoaded: boolean;
	isEthProviderAvailable: boolean;
	error: string | null;
	actions: typeof sdk.actions | null;
	showSplash: boolean;
	setShowSplash: Dispatch<SetStateAction<boolean>>;
}

const FrameProviderContext = createContext<FrameContextValue | undefined>(
	undefined
);

interface FrameProviderProps {
	children: ReactNode;
}

export function FrameProvider({ children }: FrameProviderProps) {
	const [showSplash, setShowSplash] = useState(true);
	const [context, setContext] = useState<FrameContext | null>(null);
	const [actions, setActions] = useState<typeof sdk.actions | null>(null);
	const [isEthProviderAvailable, setIsEthProviderAvailable] =
		useState<boolean>(false);
	const [isSDKLoaded, setIsSDKLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const context = await sdk.context;
				console.log("context", context);
				if (context) {
					setContext(context as FrameContext);
					setActions(sdk.actions);
					setIsEthProviderAvailable(sdk.wallet.ethProvider ? true : false);
				}
				await sdk.actions.ready();
				setShowSplash(false);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to initialize SDK"
				);
				console.error("SDK initialization error:", err);
			}
		};

		if (sdk && !isSDKLoaded) {
			load().then(() => {
				setIsSDKLoaded(true);
				console.log("SDK loaded");
			});
		}
	}, [isSDKLoaded]);

	return (
		<FrameProviderContext.Provider
			value={{
				showSplash,
				context,
				actions,
				isSDKLoaded,
				isEthProviderAvailable,
				error,
				setShowSplash,
			}}
		>
			<FrameWalletProvider>{children}</FrameWalletProvider>
		</FrameProviderContext.Provider>
	);
}

export function useMiniAppContext() {
	const context = useContext(FrameProviderContext);
	if (context === undefined) {
		throw new Error("useFrame must be used within a FrameProvider");
	}
	return context;
}
