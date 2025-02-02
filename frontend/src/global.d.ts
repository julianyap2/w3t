export interface Plug {
    principalId: string;
    requestConnect: (args: {whitelist?: [string], host?: string}) => Promise<boolean>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    createActor: <T>(options: {
        canisterId: string;
        interfaceFactory: any;
    }) => Promise<T>;
    createAgent: (options: { whitelist: [string] }) => any;
    requestTransfer: (args: {
        to: string;
        amount: number;
        opts?: {
            fee?: number;
            memo?: number;
            from_subaccount?: number[];
            created_at_time?: {
                timestamp_nanos: number;
            };
        };
    }) => Promise<{ height: number }>;
    agent: {
        getPrincipal: () => Promise<import("@dfinity/principal").Principal>;
    };  
}

export interface IC {
    plug: Plug;
}

declare global {
    interface Window {
        ic?: IC;
    }
}
  