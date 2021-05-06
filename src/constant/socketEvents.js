export const SOCKET_EVENTS = {
  /* #region Socket.io events  */
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  /* #endregion */

  /* #region Custom events */
  UPDATE_USER_LIST: "UPDATE_USER_LIST",
  CALL_MAKE: "CALL_MAKE",
  CALL_ICE_CANDIDATE: "CALL_ICE_CANDIDATE",
  CALL_REJECT: "CALL_REJECT",
  CALL_CANCEL: "CALL_CANCEL",
  CALL_ACCEPT: "CALL_ACCEPT",
  CALL_OFFER: "CALL_OFFER",
  CALL_ANSWER: "CALL_ANSWER",
  CALL_DISCONNECT: "CALL_DISCONNECT",
  CALL_FINISH: "CALL_FINISH"
  /* #endregion */
}