"use client"

import { useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button"
import { ECommerceAddress } from "@/lib/abi/ecommerce-abi"
import { Toaster } from "../ui/sonner";
import { FileUploadWithPreview } from "../file-upload-with-preview";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { getContract, prepareContractCall, PreparedTransaction } from "thirdweb";
import { client } from "@/contexts/thirdwebclient";
import { avalancheFuji } from "thirdweb/chains";

type RegisterData = {
    name: string,
    profileUri: string,
    location: string,
    phoneNumber: string
}

export default function RegisterSeller() {

    const [formdata, setFormdata] = useState<RegisterData>({
        name: "",
        profileUri: "",
        location: "",
        phoneNumber: ""
    })
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (field: keyof RegisterData, value: any) => {
        setFormdata(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
        if (field === "profileUri") {
            console.log(value)
        }
    };

    const [errors, setErrors] = useState<Partial<RegisterData>>({})

    const validateForm = () => {
        const newErrors: Partial<RegisterData> = {};

        if (!formdata.name) newErrors.name = "Name is required";
        if (!formdata.profileUri) newErrors.profileUri = "Profile URI is required";
        if (!formdata.location) newErrors.location = "Location is required";
        if (!formdata.phoneNumber) newErrors.phoneNumber = "Phone Number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const contract = getContract({
        client: client,
        chain: avalancheFuji,
        address: ECommerceAddress
    })
    console.log(contract);

    const account = useActiveAccount();
    const connectedAddress = account?.address;
    console.log(connectedAddress)

    const { push } = useRouter();
    const { mutateAsync: registerSeller, isPending, isSuccess, isError } = useSendTransaction();

    const transaction = useMemo(() => {
        if (!contract) {
            throw new Error("Not Prepared for call")
        };

        const call = prepareContractCall({
            contract,
            method: "function registerSeller(string memory _name, string memory _profileURI, string memory _location, string memory _phoneNumber) public",
            params: [formdata.name, formdata.profileUri, formdata.location, formdata.phoneNumber]
        })
        return call;
    }, [formdata.name, formdata.profileUri, formdata.location, formdata.phoneNumber])

    const handleRegister = async () => {
        const isValid = validateForm();
        if (!isValid) return;
        console.log("Started")
        console.log(transaction);
        try {
            let txHash = await registerSeller(transaction as PreparedTransaction);
            push("/sell")
        } catch (err) {
            console.error(err);
        }
    }

    // const {
    //     data,
    //     isPending,
    //     writeContract,
    //     error,
    //     isSuccess
    // } = useWriteContract()

    // const handleSubmit = async () => {
    //     const isValid = validateForm();
    //     if (!isValid) return;

    //     try {
    //         const result = writeContract({
    //             abi: ECommerceABI,
    //             address: ECommerceAddress as `0x${string}`,
    //             functionName: "registerSeller",
    //             args: [formdata.name, formdata.profileUri, formdata.location, formdata.phoneNumber]
    //         })
    //         // const approvalReceipt = await waitForTransactionReceipt(config, {
    //         //     hash: result,
    //         //     confirmations: 1
    //         // })

    //         // console.log("Approval confirmed: ", approvalReceipt);
    //         console.log("Approval confirmed: ", result);
    //         toast.success("Transaction Confirmed")
    //     } catch (err) {
    //         console.error("tx failed by async fn", error)
    //         console.error("fatal error", err);
    //     }


    // }

    return (
        <>
            <Toaster />
            <Card className="bg-gray-900/50 border-gray-800 p-8 w-[60%] mx-auto mt-20">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="name" className="text-white mb-2 block">
                            Seller Name
                        </Label>
                        <Input
                            id="name"
                            value={formdata.name}
                            onChange={(e) => setFormdata((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* <div>
                        <Label htmlFor="name" className="text-white mb-2 block">
                        Profile URI
                        </Label>
                        {/* This has to do with image sha *
                        <Input
                            id="name"
                            value={formdata.profileUri}
                            onChange={(e) => setFormdata((prev) => ({ ...prev, profileUri: e.target.value }))}
                            placeholder="Enter your profile uri"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.profileUri && <p className="text-red-400 text-sm mt-1">{errors.profileUri}</p>}
                    </div> */}

                    <FileUploadWithPreview
                        id="profileUri"
                        label="Profile Picture"
                        value={formdata.profileUri}
                        onChange={(uri, filename) => {
                            handleInputChange("profileUri", uri);
                        }}
                        error={errors.profileUri}
                        required={true}
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                    />

                    <div>
                        <Label htmlFor="name" className="text-white mb-2 block">
                            location
                        </Label>
                        <Input
                            id="name"
                            value={formdata.location}
                            onChange={(e) => setFormdata((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your location"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-white mb-2 block">
                            Phone Number
                        </Label>
                        <Input
                            id="name"
                            value={formdata.phoneNumber}
                            onChange={(e) => setFormdata((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            placeholder="Enter your phone number"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <Button onClick={handleRegister}>
                        Submit
                    </Button>
                </div>
            </Card>
        </>
    )
}