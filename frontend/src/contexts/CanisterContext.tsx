import { createContext, useContext, useState, ReactNode } from "react";
import { idlFactory } from "../declarations/w3t/w3t.did.js";

interface CanisterContextType {
  principalId: string;
  w3tActor: any;
  requestConnect: () => Promise<void>;
}

const CanisterContext = createContext<CanisterContextType | undefined>(undefined);

export const CanisterProvider = ({ children }: { children: ReactNode }) => {
  const [principalId, setPrincipalId] = useState("");
  const [w3tActor, setW3tActor] = useState<any>(null);
  const plugExtension = window.ic?.plug;
  const w3tCanisterId = process.env.NEXT_PUBLIC_W3T_CANISTER_ID ?? "";

  const requestConnect = async () => {
    if(!!plugExtension) {
      try {
        const whitelist: [string] = [w3tCanisterId];
        const isConnected = await plugExtension.isConnected();

        if (!isConnected) await plugExtension.requestConnect({ whitelist });

        await plugExtension.createAgent({ whitelist });

        // Init actor
        const NNSUiActor = await plugExtension.createActor({
          canisterId: w3tCanisterId,
          interfaceFactory: idlFactory,
        }) as any;
        setW3tActor(NNSUiActor);
        setPrincipalId(plugExtension.principalId);
        
      } catch (error) {
        console.log("Failed to connect to canister:", error);
      }
    } else {
      // Direct to extension installation page
      window.open("https://chromewebstore.google.com/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm", "_blank");
    }
  };

  return <CanisterContext.Provider value={{ principalId, w3tActor, requestConnect }}>{children}</CanisterContext.Provider>;
};

export const useCanister = () => {
  const context = useContext(CanisterContext);
  if (!context) {
    throw new Error("useCanister must be used within an CanisterProvider");
  }
  return context;
};
