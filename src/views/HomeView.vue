<template>
  <v-app id="home">
    <message-ui></message-ui>
    <v-content class="grey lighten-5" style="height:100vh">
      <v-container fluid style="height: 100%">
        <v-layout row>
          <v-flex xs8 md6 offset-md3 offset-xs2 class="white">
            <!-- title -->
            <v-card dark flat color="blue lighten-1">
              <v-card-text style="text-align: center; font-size:20px;"
                >Realtime communication with WebRTC</v-card-text
              >
            </v-card>

            <v-card elevation="2">
              <v-form class="pa-3" :elevation="23">
                <!-- Partner ID input -->
                <div class="text-xs-center">Partner ID</div>
                <v-container fluid>
                  <v-layout row wrap class="mb-0">
                    <v-flex xs10 offset-xs1 md6 offset-md3>
                      <v-combobox
                        outline
                        single-line
                        clearable
                        :color="isError ? 'red lighten-1' : 'blue lighten-1'"
                        :autofocus="true"
                        :items="partnerIDs"
                        @input="isError = false"
                        v-model="partnerID"
                        class="partnerID font-weight-bold"
                        ref="partnerID"
                      ></v-combobox>
                    </v-flex>
                  </v-layout>

                  <!-- button submit -->
                  <v-layout row wrap style="text-align:center">
                    <v-flex xs12>
                      <v-btn @click="handleConnect" color="blue lighten-1">
                        <v-icon left dark>compare_arrows</v-icon>
                        Connect
                      </v-btn>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <h4 style="text-align:center;">
                        <span>Your ID:&nbsp; </span>
                        <span>{{ clientID }}&nbsp;</span>
                      </h4>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <dialog-connecting
        :partnerID="partnerID"
        ref="dialogConnecting"
        @callAcepted="openCallingDialog"
      />
      <dialog-calling :partnerID="partnerID" ref="dialogCalling" />
    </v-content>
  </v-app>
</template>
<script>
import { isBlank } from "../utils/common";
import { getClientID, getClientIDs } from "@/api/client";
import { SOCKET_EVENTS } from "@/constant/socketEvents";

export default {
  data: () => ({
    partnerID: "",
    isError: false,
    partnerIDs: [],
    clientID: "-",
  }),
  mounted() {
    this.$refs["partnerID"].$refs.input.maxLength = 10;

    // Connect to signalling server
    this.$socket.connect();
    this.$socket.on(SOCKET_EVENTS.CONNECT, () => {
      let socketID = this.$socket.socket.id;
      getClientID(socketID)
        .then((res) => {
          this.$logger.log(res.clientID);
          this.clientID = res.clientID;
          this.$store.dispatch("client/setClient", {
            clientID: res.clientID,
            socketID: socketID,
          });
        })
        .catch((err) => {
          this.$bus.$emit(
            "showErrorMessage",
            "Not ready. Check your internet connection!"
          );
        });

      this.$socket.on(SOCKET_EVENTS.UPDATE_USER_LIST, () => {
        this.getPartnerIDs();
      });
    });
  },
  methods: {
    handleConnect() {
      this.$bus.$emit("closeMessage");
      if (isBlank(this.partnerID)) {
        this.$bus.$emit("showErrorMessage", "Partner ID is required!");
        this.isError = true;
        this.$refs["partnerID"].$refs.input.focus();
      } else {
        this.$refs.dialogConnecting.showDialog();
      }
    },
    getPartnerIDs() {
      getClientIDs()
        .then((res) => {
          this.partnerIDs = res.clientIDs.filter(
            (clientID) => clientID !== this.$store.getters.clientID
          );
        })
        .catch((err) => {
          this.partnerIDs = [];
        });
    },
    openCallingDialog() {
      this.$refs.dialogCalling.showDialog();
    },
  },
};
</script>
<style scoped>
.partnerID >>> input {
  text-align: center;
}
</style>
