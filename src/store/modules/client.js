const state = {
  clientID: null,
  socketID: null
}

const mutations = {
  SET_CLIENT_ID: (state, clientID) => {
    state.clientID = clientID
  },
  SET_SOCKET_ID: (state, socketID) => {
    state.socketID = socketID
  }
}

const actions = {
  setClient({ commit }, client) {
    commit('SET_CLIENT_ID', client.clientID);
    commit('SET_SOCKET_ID', client.socketID);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}