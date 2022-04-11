import type { Expression, LinksAdapter, NewLinksObserver, LanguageContext, LinkQuery } from "@perspect3vism/ad4m";
import type { DID } from "@perspect3vism/ad4m/lib/DID";
import axios from 'axios'

export class DbStoreLinkAdapter implements LinksAdapter {
  linkCallback?: NewLinksObserver
  languageHash: string

  constructor(context: LanguageContext) {
    this.languageHash = context.storageDirectory.split("/")[context.storageDirectory.split("/").length - 2];
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
    const oldLinkData = prepareExpressionLink(oldLinkExpression);
    oldLinkData["graph"] = this.languageHash;
    const newLinkData = prepareExpressionLink(newLinkExpression);
    newLinkData["graph"] = this.languageHash;

    await axios.post("https://centralized-link-store-production.up.railway.app/removeLink", oldLinkData);
    await axios.post("https://centralized-link-store-production.up.railway.app/addLink", newLinkData);
  }

  async removeLink(link: Expression): Promise<void> {
    const linkData = prepareExpressionLink(link);
    linkData["graph"] = this.languageHash;

    await axios.post("https://centralized-link-store-production.up.railway.app/removeLink", linkData);
  }

  async getLinks(query: LinkQuery): Promise<Expression[]> {

    query["graph"] = this.languageHash;
    console.log("CENTRALIZED LINK LANGUAGE QUERYING DATA", query);


    let links = await axios.post("https://centralized-link-store-production.up.railway.app/getLinks", query);

    console.log("Got result", links.data);
    //@ts-ignore
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
