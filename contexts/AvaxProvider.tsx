"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  avalancheFuji,
  avalanche,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode, useMemo } from 'react';



export const AvaxProvider = ({ children }: {
  children: ReactNode
}) => {
  
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
  const queryClient = new QueryClient();
  const config = useMemo(() => {
  if (!projectId) return;

  return getDefaultConfig({
    appName: 'My Avalanche Dapp',
    projectId,
    chains: [avalancheFuji, avalanche],
  });
}, [projectId])



  if (!config) return;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};