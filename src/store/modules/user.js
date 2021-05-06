const state = {
  userId: null
}

const mutations = {
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  setUserId({ commit }, userId) {
    commit('SET_USER_ID', userId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}