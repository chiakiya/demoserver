import { Client } from "../model/client";

const clients = require("../db/allClient");

export function getClientByID(clientID:string):Client{
  let index =clients.findIndex(function (o:Client) {
    return o.clientID === clientID;
  });
  if (index !== -1){
    return clients[index];
  }else{
    return null;
  }
};

export function getClientBySocketID(socketID:any):Client{
  let index =clients.findIndex(function (o:Client) {
    return o.socketID === socketID;
  });
  if (index !== -1){
    return clients[index];
  }else{
    return null;
  }
};

export function addClient(client: Client){
  clients.push(client);
};

export function deleteClientByID(clientID:string){
  let index =clients.findIndex(function (o:Client) {
    return o.clientID === clientID;
  });
  if (index !== -1){
    clients.splice(index, 1);
  } 
}


export function deleteClientBySocketID(socketID:string){
  let index =clients.findIndex(function (o:Client) {
    return o.socketID === socketID;
  });
  if (index !== -1){
    clients.splice(index, 1);
  } 
};

export function getAllClient():Client[]{
  return clients;
}
