export interface InfinityWallet {
    requestConnect: (params?: { whitelist?: string[] }) => Promise<{ publicKey: string }>;
}

export interface IC {
    infinityWallet?: InfinityWallet;
}

declare global {
    interface Window {
        ic?: IC;
    }
}
  