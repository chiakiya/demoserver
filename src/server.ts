import express from "express";
import cors from "cors";
import * as http from "http";
import { mountRoutes } from "./api";
import { Client } from "./model/client";
import * as clientService from "./service/clientService";
import { randomStr } from "./util/stringUtils";
import { EVENTS } from "./constant/socketEvents";

export class Server {
  public static readonly PORT: number = 3000;
  private app: express.Application;
  private server: http.Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    mountRoutes(this.app);
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || Server.PORT;
  }

  private sockets(): void {
    this.io = require("socket.io").listen(this.server, { origins: '*:*' });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on(EVENTS.CONNECT, (socket: any) => {
      let client = new Client(randomStr(10, "0123456789"), socket.id, socket.handshake.address);
      console.log("New client connected: %s", client.clientID);
      clientService.addClient(client);

      socket.emit(EVENTS.UPDATE_USER_LIST);
      socket.broadcast.emit(EVENTS.UPDATE_USER_LIST);

      // Call make
      socket.on(EVENTS.CALL_MAKE, (data: any) => {
        console.log("Call make: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_MAKE, {
            from: client.clientID
          })
        } else {
          socket.emit(EVENTS.CALL_REJECT, {
            from: data.to,
            message: "Partner is not exist!"
          });
        }
      });
      
      // Call cancel
      socket.on(EVENTS.CALL_CANCEL, (data: any) => {
        console.log("Call cancel: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_CANCEL, {
            from: client.clientID
          })
        }
      });

      // Call reject
      socket.on(EVENTS.CALL_REJECT, (data: any) => {
        console.log("Call reject: " + client.clientID + " <=> " + data.to);
        console.log(data);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_REJECT, {
            from: client.clientID,
            reason: data.reason?data.reason:"Can not connect to partner!"
          })
        }
      });

      // Call accept
      socket.on(EVENTS.CALL_ACCEPT, (data: any) => {
        console.log("Call accept: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_ACCEPT, {
            from: client.clientID
          })
        }
      });

      // Call offer
      socket.on(EVENTS.CALL_OFFER, (data: any) => {
        console.log("Call offer: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_OFFER, {
            from: client.clientID,
            offer: data.offer,
          })
        } else {
          console.log("Call disconnect: " + client.clientID + " <=> " + data.to);
          socket.emit(EVENTS.CALL_DISCONNECT, {
            from: data.to,
            message: "Can not connect to partner!"
          });
        }
      });

      // Call answer
      socket.on(EVENTS.CALL_ANSWER, (data: any) => {
        console.log("Call answer: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_ANSWER, {
            from: client.clientID,
            answer: data.answer
          })
        } else {
          console.log("Call disconnect: " + client.clientID + " <=> " + data.to);
          socket.emit(EVENTS.CALL_DISCONNECT, {
            from: data.to,
            message: "Can not connect to partner!"
          });
        }
      });

      // ice candidate
      socket.on(EVENTS.CALL_ICE_CANDIDATE, (data: any) => {
        console.log("Call ice candidate: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_ICE_CANDIDATE, {
            from: client.clientID,
            candidate: data.candidate
          })
        } else {
          console.log("Call disconnect: " + client.clientID + " <=> " + data.to);
          socket.emit(EVENTS.CALL_DISCONNECT, {
            from: data.to,
            message: "Can not connect to partner!"
          });
        }
      });

      // Call disconnect
      socket.on(EVENTS.CALL_DISCONNECT, (data: any) => {
        console.log("Call disconnect: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_DISCONNECT, {
            from: client.clientID
          })
        }
      });

      // Call finish
      socket.on(EVENTS.CALL_FINISH, (data: any) => {
        console.log("Call finish: " + client.clientID + " <=> " + data.to);
        let partner = clientService.getClientByID(data.to);
        if (partner) {
          socket.broadcast.to(partner.socketID).emit(EVENTS.CALL_FINISH, {
            from: client.clientID
          })
        }
      });

      // Disconnect
      socket.on(EVENTS.DISCONNECT, () => {
        clientService.deleteClientByID(client.clientID);
        socket.emit(EVENTS.UPDATE_USER_LIST);
        socket.broadcast.emit(EVENTS.UPDATE_USER_LIST);
        console.log("Client disconnected: %s", client.clientID);
      });

    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}