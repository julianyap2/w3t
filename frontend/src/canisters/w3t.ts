import { ActorSubclass } from "@dfinity/agent";

import { CandidCanister } from "@bundly/ares-core";

import { _SERVICE, idlFactory } from "../declarations/w3t/w3t.did.js";

export type W3TActor = ActorSubclass<_SERVICE>;

export const w3t: CandidCanister = {
  idlFactory,
  actorConfig: {
    canisterId: process.env.NEXT_PUBLIC_W3T_CANISTER_ID!,
  },
};
