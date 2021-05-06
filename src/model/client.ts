export class Client {
  clientID: string;
  socketID: string;
  ipAddr: string;

  constructor(clientID: string, socketID: string, ipAddr: string){
    this.clientID = clientID;
    this.socketID = socketID;
    this.ipAddr = ipAddr;
  }
}