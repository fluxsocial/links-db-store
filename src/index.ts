import type { Address, Language, Interaction, HolochainLanguageDelegate, LanguageContext } from "@perspect3vism/ad4m";
import { DbStoreLinkAdapter } from "./linksAdapter";

function interactions(expression: Address): Interaction[] {
  return [];
}

export default async function create(context: LanguageContext): Promise<Language> {
  const linksAdapter = new DbStoreLinkAdapter(context);

  return {
    name: "centralized-link-store",
    linksAdapter,
    interactions,
  } as Language;
}
