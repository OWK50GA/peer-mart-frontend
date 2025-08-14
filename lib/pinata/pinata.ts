'use client'

import { PinataSDK } from 'pinata'

export interface PinataConfig {
    apiKey: string,
    apiSecret: string,
    jwt: string
}

export const pinata = new PinataSDK({
    pinataJwt: "",
    pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

// export class PinataService {
//   async uploadMetadata(metadata: any): Promise<string> {
//     try {
//       // 1. Get signed upload URL from our API
//       const urlRequest = await fetch("/api/pinata-url");
//       if (!urlRequest.ok) {
//         throw new Error(`Failed to get signed URL: ${urlRequest.statusText}`);
//       }
//       const urlResponse = await urlRequest.json();

//       // 2. Create JSON file from metadata
//       const jsonData = JSON.stringify(metadata, null, 2);
//       const file = new File([jsonData], "organization.json", { type: "application/json" });

//       // 3. Upload using Pinata SDK with signed URL
//       const upload = await pinata.upload.public
//         .file(file)
//         .url(urlResponse.url)
//         .keyvalues({
//           env: "prod",
//           type: "organization-data",
//           orgName: metadata.name,
//           version: "1.0"
//         });

//       console.log("Upload successful:", upload);

//       // 4. Return IPFS URL
//       return `ipfs://${upload.cid}`;
//     } catch (error) {
//       console.error("Error uploading to Pinata:", error);
//       throw error;
//     }
//   }

//   async testConnection(): Promise<boolean> {
//     try {
//       // Test by trying to get a signed URL
//       const response = await fetch("/api/pinata-url");
//       return response.ok;
//     } catch (error) {
//       console.error("Pinata connection test failed:", error);
//       return false;
//     }
//   }
// }