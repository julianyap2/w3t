import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { idlFactory } from "../declarations/w3t/w3t.did.js";

interface CanisterContextType {
  principalId: string;
  role: string;
  w3tActor: any;
  requestConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const CanisterContext = createContext<CanisterContextType | undefined>(undefined);

export const CanisterProvider = ({ children }: { children: ReactNode }) => {
  const [principalId, setPrincipalId] = useState("");
  const [w3tActor, setW3tActor] = useState<any>(null);
  const [role, setRole] = useState("User");
  
  const w3tCanisterId = process.env.NEXT_PUBLIC_W3T_CANISTER_ID ?? "";
  
  useEffect(() => {
    if(w3tActor !== null) {
      initRole();
    }
  }, [w3tActor]);

  const requestConnect = async () => {
    let plugExtension = window?.ic?.plug;

    if(!!plugExtension) {
      try {
        const whitelist: [string] = [w3tCanisterId];
        const isConnected = await plugExtension.isConnected();
        if (!isConnected) await plugExtension.requestConnect({ whitelist });
        await initW3tActor();
        setPrincipalId(plugExtension.principalId);

      } catch (error) {
        console.log("Failed to connect to canister:", error);
      }
    } else {
      // Direct to extension installation page
      window.open("https://chromewebstore.google.com/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm", "_blank");
    }
  };

  const initW3tActor = async (): Promise<any> => {
    let plugExtension = window?.ic?.plug;
    const NNSUiActor = await plugExtension!.createActor({
      canisterId: w3tCanisterId,
      interfaceFactory: idlFactory,
    }) as any;
    setW3tActor(NNSUiActor);
  }

  const initRole = async (): Promise<void> => {
    const role = await w3tActor.getMyRole();
    setRole(role);
  }

  const disconnect = async () => {
    let plugExtension = window?.ic?.plug;

    try {
      await plugExtension!.disconnect();
      resetState();
    } catch(error) {
      console.log("Failed to disconnect to canister:", error);
    }
  }; 

  const resetState = () => {
    setW3tActor(null);
    setPrincipalId("");
    setRole("User");
  };

  return <CanisterContext.Provider value={{ principalId, role, w3tActor, requestConnect, disconnect }}>{children}</CanisterContext.Provider>;
};

export const useCanister = () => {
  const context = useContext(CanisterContext);
  if (!context) {
    throw new Error("useCanister must be used within an CanisterProvider");
  }
  return context;
};
