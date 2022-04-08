import type { Address, Language, Interaction, LanguageContext } from "@perspect3vism/ad4m";
import { DbStoreLinkAdapter } from "./linksAdapter";
import { io } from "socket.io-client";

function interactions(expression: Address): Interaction[] {
  return [];
}

export default async function create(context: LanguageContext): Promise<Language> {
  const linksAdapter = new DbStoreLinkAdapter(context);
  let languageHash = context.storageDirectory.split("/")[context.storageDirectory.split("/").length - 2];

  console.log("CENTRALIZED LINK LANGUAGE ATTEMPTING WEBSOCKET CONNECTION WITH GRAPH", languageHash)
  const socket = io(`wss://centralized-link-store-production.up.railway.app/signals?graph=${languageHash}`);

  socket.on('connectFailed', function(error) {
      console.log('Connect Error: ' + error.toString());
  });

  socket.on('connect', () => {
      console.log('WebSocket Client Connected');
      // connection.on('error', function(error) {
      //     console.log("Connection Error: " + error.toString());
      // });
      // connection.on('close', function() {
      //     console.log('echo-protocol Connection Closed');
      // });
      // connection.on('message', function(message) {
      //     if (message.type === 'utf8') {
      //         console.log("Received: '" + message.utf8Data + "'");
      //     }
      // });
  });

  return {
    name: "centralized-link-store",
    linksAdapter,
    interactions,
  } as Language;
}
