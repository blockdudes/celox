import { defineChain, } from "thirdweb/chains";

const Bubs_Sepolia = defineChain({
  id: 0x206CE7,
  name: "Bubs Sepolia",
  rpc: "https://bubs-sepolia.rpc.caldera.xyz/http",

  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  slug: "Bubs-Sepolia",
});

const celox = defineChain({
  id: 0x4029,
  name: "celox",
  rpc: "https://rpc-celox-2gv2cks7od.t.conduit.xyz",

  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  slug: "conduit:celox-2gv2cks7od",
});

export const supportedChains = new Map([
  [
    "celox",
    {
      chain: celox,
      supportedMarket: { "DOGE/USDC": "0x118e253AD66E7d30C8bEE487eaa42463E9cD0f78", "SOL/USDC": "0x71831D9c34694779ef36CD0cAbD36A3d1eC88C6C" },
      contractAddress: "0xF9bA059AA30c1CC9bB28aD10c233A6FA1B684157",
      usdcAddress: "0x20108ff52701902692b936d2b88dDa5C34C0fe40",
    },
  ],
  [
    "Bubs Sepolia",
    {
      chain: Bubs_Sepolia,
      supportedMarket: {
        "DOGE/USDC": "0x20108ff52701902692b936d2b88dDa5C34C0fe40",
        "SOL/USDC": "0x118e253AD66E7d30C8bEE487eaa42463E9cD0f78",
      },
      contractAddress: "0x71831D9c34694779ef36CD0cAbD36A3d1eC88C6C",
      usdcAddress: "0x6b45aC5FBf1822feCfa585E87b0b4ea44C31bb54",
    },
  ],
]);
