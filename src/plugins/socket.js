import * as socketIo from "socket.io-client";

const SERVER_URL = process.env.VUE_APP_SERVER_URL;

class Socket {
  connect() {
    this.socket = socketIo(SERVER_URL);
  }

  on(event, fnc) {
    this.socket.on(event, fnc);
  }

  emit(event, ...args){
    this.socket.emit(event, ...args);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  isConnected(){
    return this.socket.connected;
  }
}

export default new Socket();
