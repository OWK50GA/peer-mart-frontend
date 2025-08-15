'use client'

import { getContract, prepareContractCall, PreparedTransaction } from "thirdweb";
import { Button } from "./ui/button";
import { avalancheFuji } from "thirdweb/chains";
import { MockUSDCAddress } from "@/lib/abi/mockusdc";
import { client } from "@/contexts/thirdwebclient";
import { useActiveAccount, useSendBatchTransaction, useSendTransaction } from "thirdweb/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function MintUSDC() {

    const contract = getContract({
        chain: avalancheFuji,
        address: MockUSDCAddress,
        client: client
    })

    const account = useActiveAccount();
    const address = account?.address;

    const [isMinting, setIsMinting] = useState(false)

    const { mutateAsync: sendCalls, isSuccess: txSuccess, error: txError } = useSendBatchTransaction();

    const approvalTransaction = useMemo(() => {
        if (!contract) return;

        const call = prepareContractCall({
            contract,
            method: "function approve(address _to, uint256 _amount )",
            params: [address as `0x${string}`, BigInt(10000)]
        });
        return call;
    }, [address])

    const mintTransaction = useMemo(() => {
        if (!contract) return;

        const call = prepareContractCall({
            contract,
            method: "function mint(address _to, uint256 _amount)",
            params: [address as `0x${string}`, BigInt(10000)]
        })
        return call;
    }, [address])

    const handleMint = async () => {
        setIsMinting(true);

        try {
            const txHash = await sendCalls([approvalTransaction as PreparedTransaction, mintTransaction as PreparedTransaction])
            if (txSuccess) {
                console.log("transaction successful");
                toast.success("Mint successful")
            }
        } catch (err) {
            console.error((err as Error).message);
        } finally {
            setIsMinting(false);
        }
    }

    return (
        <Button onClick={handleMint} disabled={isMinting}>
            {isMinting ? <Loader /> : "Mint 10000 USDC"}
        </Button>
    )
}