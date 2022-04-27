import type { Address, Language, Interaction, LanguageContext } from "@perspect3vism/ad4m";
import { DbStoreLinkAdapter } from "./linksAdapter";
import { io } from "socket.io-client";
import os from 'os';

function interactions(expression: Address): Interaction[] {
  return [];
}

export default async function create(context: LanguageContext): Promise<Language> {
  const split = os.platform() === 'win32' ? "\\" : "/";

  const linksAdapter = new DbStoreLinkAdapter(context);
  let languageHash = context.storageDirectory.split(split)[context.storageDirectory.split(split).length - 2];

  console.log("CENTRALIZED LINK LANGUAGE ATTEMPTING WEBSOCKET CONNECTION WITH GRAPH", languageHash)
  const socket = io('https://centralized-link-store-production.up.railway.app');

  socket.on('connectFailed', function(error) {
      console.log('Connect Error: ' + error.toString());
  });

  socket.on('connect', () => {
    console.log('WebSocket Client Connected');
    socket.emit("connectSignal", {"graph": languageHash});
  });

  socket.on("linkAdded", (msg) => {
    console.log("Got new link signal", msg)
    linksAdapter.linkCallback([msg], []);
  })

  return {
    name: "centralized-link-store",
    linksAdapter,
    interactions,
  } as Language;
}
