import {httpClient} from '@/utils/http-client'

export function getClientID(socketID){
  return httpClient({
    url: '/api/client/clientID',
    method: 'get',
    params: {
      socketID: socketID
    }
  });
}

export function getClientIDs(){
  return httpClient({
    url: '/api/client/clientIDs',
    method: 'get'
  });
}