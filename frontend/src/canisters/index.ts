import { CandidCanister } from "@bundly/ares-core";

import { W3TActor, w3t } from "./w3t";

export type CandidActors = {
  w3t: W3TActor;
};

export let candidCanisters: Record<keyof CandidActors, CandidCanister> = {
  w3t,
};
