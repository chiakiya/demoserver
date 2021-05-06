import express from "express";
import * as clientService from "./service/clientService";
import {Client} from "./model/client";


export function mountRoutes(app: express.Application) {
  /**
   * Hello world
   */
  app.get('/', (req, res) => {
    res.json({
      message: 'Wellcome to IRemote server!'
    })
  });

  /**
   * Get all clients are connecting
   */
  app.get('/api/client/list', (req, res) => {
    let clients = clientService.getAllClient();
    res.json({
      listClient: clients
    })
  });

  /**
   * Get client ID by socketID
   * @requestParams {String} socketID
   */
  app.get('/api/client/clientID', (req, res) => {
    let client:Client = clientService.getClientBySocketID(req.query.socketID);
    res.json({
      socketID: req.query.socketID,
      clientID: client?client.clientID:null
    })
  });

  /**
   * Get list ids of all clients are connecting
   */
  app.get('/api/client/clientIDs', (req, res) => {
    let clients:Client[] = clientService.getAllClient();
    res.json({
      clientIDs: clients.map((o)=>{
        return o.clientID;
      })
    })
  });
}