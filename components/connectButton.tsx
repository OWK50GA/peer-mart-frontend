import { ConnectButton } from 'thirdweb/react';
import { Button } from './ui/button';
import { client } from '@/contexts/thirdwebclient';
import { avalancheFuji } from 'thirdweb/chains';


export const CustomConnectButton = () => {
  return (
    <ConnectButton
        client={client} 
        accountAbstraction={{
            chain: avalancheFuji,
            sponsorGas: true
        }}
        connectButton={{
            className: 'rounded-4xl font-semibold w-40 py-4 px-2 bg-[#4E36E9] text-white',
            style: {
                color: 'black',
                backgroundColor: 'gold',
                borderRadius: '50px',
                padding: '16px 8px',
                fontWeight: 'bold'
            },
            label: 'Connect Wallet'
        }}
        // wallets={wallets}
        connectModal={{
            showThirdwebBranding: false,
            size: "compact",
            title: "Connect Wallet",
        }}
    />
  );
};