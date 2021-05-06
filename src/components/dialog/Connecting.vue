<template>
  <v-dialog
    v-model="show"
    persistent
    width="300"
    content-class="dialogConnection"
  >
    <v-card>
      <v-card-text>
        Connecting ...
        <v-progress-linear
          indeterminate
          color="blue lighten-1"
          class="mb-0"
        ></v-progress-linear>
        <v-card-actions class="ma-0">
          <v-flex class="text-xs-right">
            <v-btn color="blue lighten-1" flat @click="cancelCall"
              >Cancel</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { SOCKET_EVENTS } from "@/constant/socketEvents";

export default {
  props: {
    partnerID: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    show: false,
  }),
  methods: {
    /**
     * show dialog
     */
    showDialog() {
      // On call reject
      this.$socket.on(SOCKET_EVENTS.CALL_REJECT, (data) => {
        if (this.show) {
          this.$bus.$emit("showErrorMessage", data.reason);
          this.closeDialog();
        }
      });

      // on call accept
      this.$socket.on(SOCKET_EVENTS.CALL_ACCEPT, (data) => {
        if (this.show) {
          this.$emit("callAcepted");
          this.closeDialog();
        }
      });

      // On call finish
      this.$socket.on(SOCKET_EVENTS.CALL_FINISH, (data) => {
        if (this.show) {
          this.$bus.$emit("showErrorMessage", "Can not connect to partner!");
          this.closeDialog();
        }
      });

      this.show = true;
      let clientID = this.$store.getters.clientID;
      if (!clientID) {
        this.$bus.$emit(
          "showErrorMessage",
          "Not ready. Check your internet connection!"
        );
      } else {
        // call make
        this.$socket.emit(SOCKET_EVENTS.CALL_MAKE, {
          to: this.partnerID,
        });
      }
    },
    cancelCall() {
      this.$socket.emit(SOCKET_EVENTS.CALL_CANCEL, {
        to: this.partnerID,
      });
      this.closeDialog();
    },
    /**
     * Close dialog
     */
    closeDialog() {
      this.show = false;
    },
  },
};
</script>
<style>
.dialogConnection {
  position: absolute !important;
  top: 10vh !important;
}
</style>
