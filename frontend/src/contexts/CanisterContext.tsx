import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { idlFactory as w3tIF } from "../declarations/w3t/w3t.did.js";
import { TransferArg, idlFactory as w3tTokenIF } from "../declarations/w3t_token/w3t_token.did.js";
import { Principal } from "@dfinity/principal";

interface CanisterContextType {
  principalId: string;
  role: string;
  balance: BigInt;
  w3tActor: any;
  tokenActor: any;
  requestConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  depositToken: (amount: number) => Promise<void>; 
  withdrawToken: (amount: number) => Promise<void>; 
}

const CanisterContext = createContext<CanisterContextType | undefined>(undefined);

export const CanisterProvider = ({ children }: { children: ReactNode }) => {
  const [principalId, setPrincipalId] = useState("");
  const [w3tActor, setW3tActor] = useState<any>(null);
  const [tokenActor, setTokenActor] = useState<any>(null);
  const [role, setRole] = useState("User");
  const [balance, setBalance] = useState<BigInt>(BigInt(0));
  
  const w3tCanisterId = process.env.NEXT_PUBLIC_W3T_CANISTER_ID ?? "";
  const w3tTokenCanisterId = process.env.NEXT_PUBLIC_W3T_TOKEN_CANISTER_ID ?? "";
  
  useEffect(() => {
    if(w3tActor !== null) {
      initRole();
      fetchBalance();
    }
  }, [w3tActor]);

  const requestConnect = async () => {
    let plugExtension = window?.ic?.plug;

    if(!!plugExtension) {
      try {
        const whitelist: string[] = [w3tCanisterId, w3tTokenCanisterId];
        const isConnected = await plugExtension.isConnected();
        if (!isConnected) await plugExtension.requestConnect({ whitelist });
        await Promise.all([
          initW3tActor(),
          initTokenActor()
        ])
        
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
      interfaceFactory: w3tIF,
    }) as any;
    setW3tActor(NNSUiActor);
    console.log("Successfully connect to w3t actor");
  }

  const initRole = async (): Promise<void> => {
    const role = await w3tActor.getMyRole();
    setRole(role);
  }

  const initTokenActor = async (): Promise<any> => {
    let plugExtension = window?.ic?.plug;
    const NNSUiActor = await plugExtension!.createActor({
      canisterId: w3tTokenCanisterId,
      interfaceFactory: w3tTokenIF,
    }) as any;
    setTokenActor(NNSUiActor);
    console.log("Successfully connect to token actor");
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

  const depositToken = async (amount: number) => {
    try {
      const args: TransferArg = {
        to: {
          owner: Principal.fromText(w3tCanisterId),
          subaccount: [],
        },
        amount: BigInt(amount),
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      }

      const transferRes = await tokenActor.icrc1_transfer(args);
      if("ok" in transferRes) {
        await w3tActor.deposit(amount);
        console.log("Deposit succeed:", transferRes.ok);
      } else if("err" in transferRes) console.log("Failed to deposit token:", transferRes.err);
    } catch (error) {
      console.log("Failed to deposit token:", error);
    }

    fetchBalance();
  }

  const withdrawToken = async (amount: number) => {
    try {
      const transferRes = await w3tActor.withdrawToken(amount);
      if("ok" in transferRes) console.log("Withdraw succeed:", transferRes.ok);
      else if('err' in transferRes) console.log("Failed to withdraw token:", transferRes.err);
    } catch (error) {
      console.log("Failed to withdraw token:", error);
    }

    fetchBalance();
  }

  const fetchBalance = async () => {
    const response = await w3tActor.getMyBalance();
      if ("err" in response) {
        if ("userNotAuthorized" in response.err) console.log("User Not Authorized");
        else console.log("Error fetching Report");
      }
      
      console.log(response);
      const balances: any = "ok" in response ? response.ok : 0;
      setBalance(balances)
  };

  return <CanisterContext.Provider value={{ principalId, role, balance, w3tActor, tokenActor, requestConnect, disconnect, depositToken, withdrawToken }}>{children}</CanisterContext.Provider>;
};

export const useCanister = () => {
  const context = useContext(CanisterContext);
  if (!context) {
    throw new Error("useCanister must be used within an CanisterProvider");
  }
  return context;
};
