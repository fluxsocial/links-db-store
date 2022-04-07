import type { Expression, LinksAdapter, NewLinksObserver, LanguageContext, LinkQuery } from "@perspect3vism/ad4m";
import type { DID } from "@perspect3vism/ad4m/lib/DID";
import axios from "axios";

export class DbStoreLinkAdapter implements LinksAdapter {
  linkCallback?: NewLinksObserver
  languageHash: string

  constructor(context: LanguageContext) {
    this.languageHash = context.storageDirectory.split("/")[-1];
  }

  writable(): boolean {
    return true;
  }

  public(): boolean {
    return false;
  }

  async others(): Promise<DID[]> {
    return []
  }

  async addLink(link: Expression): Promise<void> {
    const data = prepareExpressionLink(link);
    data["graph"] = this.languageHash;
    console.warn("CENTRALIZED LINK LANGUAGE POSTING DATA", data);
    await axios.post("https://centralized-link-store-production.up.railway.app/addLink", data)
  }

  async updateLink(
    oldLinkExpression: Expression,
    newLinkExpression: Expression
  ): Promise<void> {
    throw new Error("updateLink is unimplemented")
  }

  async removeLink(link: Expression): Promise<void> {
    throw new Error("removeLink is unimplemented")
  }

  async getLinks(query: LinkQuery): Promise<Expression[]> {
    let links = await axios.get("https://centralized-link-store-production.up.railway.app/getLinks", Object.assign(query))
    return links.data;
  }

  addCallback(callback: NewLinksObserver): number {
    this.linkCallback = callback;
    return 1;
  }

}

function prepareExpressionLink(link: Expression): object {
  const data = Object.assign(link);
  if (data.data.source == "") {
    data.data.source = null;
  }
  if (data.data.target == "") {
    data.data.target = null;
  }
  if (data.data.predicate == "") {
    data.data.predicate = null;
  }
  return data;
}
