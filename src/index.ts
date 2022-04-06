import type { Address, Language, Interaction, HolochainLanguageDelegate, LanguageContext } from "@perspect3vism/ad4m";
import { DbStoreLinkAdapter } from "./linksAdapter";

function interactions(expression: Address): Interaction[] {
  return [];
}

const activeAgentDurationSecs = 300;

export const name = "links-db-store";

export default async function create(context: LanguageContext): Promise<Language> {
  const Holochain = context.Holochain as HolochainLanguageDelegate;

  const linksAdapter = new DbStoreLinkAdapter();

  return {
    name,
    linksAdapter,
    interactions,
  } as Language;
}
