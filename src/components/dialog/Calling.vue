<template>
  <v-dialog v-model="show" persistent width="95%" content-class="dialogCalling">
    <v-content class="black lighten-5" style="height:90vh">
      <v-container
        fluid
        style="height: 100%; position: relative; padding: 20px;"
      >
        <video autoplay playsinline class="remote-video" id="remote-video"></video>
        <video autoplay muted class="local-video" id="local-video"></video>
        <div class="text-xs-center">
          <v-btn fab dark large color="white" @click="finishCall()">
            <v-icon color="red">call_end</v-icon> </v-btn
          >``
        </div>
      </v-container>
    </v-content>
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
    peerConnection: null,
    stream: null,
    isAlreadyCalling: false,
    isPartnerAlreadyCalling: false,
    isConnected: false,
    num: 100
  }),
  mounted() {},
  methods: {
    /**
     * Show dialog
     */
    showDialog() {
      this.show = true;

      // Get user media
      this.getUserMedia();

      // Handling session disconnections
      this.$socket.on(SOCKET_EVENTS.CALL_DISCONNECT, (data) => {
        this.handleDisconnect(data.message);
      });

      // Hadling when the partner finish call
      this.$socket.on(SOCKET_EVENTS.CALL_FINISH, (data) => {
        this.handleCallFinish();
      });

      // Handling when the partner answer
      this.$socket.on(SOCKET_EVENTS.CALL_ANSWER, (data) => {
        this.handleCallAnswer(data);
      });

      // Handling when receive ice candidate from the partner
      this.$socket.on(SOCKET_EVENTS.CALL_ICE_CANDIDATE, async (data) => {
        this.handleIceCandidate(data);
      });

      // this.$socket.on(SOCKET_EVENTS.CALL_OFFER, async (data) => {
      //   await this.handleCallOffer(data);
      // });
    },
    /**
     * Handling session disconnections.
     */
    handleDisconnect(errorMsg) {
      // Show error message
      this.$bus.$emit("showErrorMessage", errorMsg);

      // Close dialog
      this.finishCall();
    },
    /**
     * Handling when the partner answer
     */
    handleCallAnswer(data) {
      this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      
    },
    /**
     * Hadling when the partner finish call
     */
    handleCallFinish() {
      this.closeDialog();
    },
    /**
     * Hadling when the partner finish call
     */
    handleIceCandidate(data) {
      let candidate = new RTCIceCandidate({
          sdpMid: data.candidate.sdpMid,
          sdpMLineIndex: data.candidate.sdpMLineIndex,
          candidate: data.candidate.sdp,
        });
        this.peerConnection.addIceCandidate(candidate);
    },
    // async handleCallOffer(data) {
    //   await this.peerConnection.setRemoteDescription(
    //     new RTCSessionDescription(data.offer)
    //   );
    
    /**
     * Stop streamed video
     */
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    },
    /**
     * Finish call
     */
    finishCall() {
      this.$socket.emit(SOCKET_EVENTS.CALL_FINISH, {
        to: this.partnerID,
      });
      this.closeDialog();
    },
    /**
     * Close dialog
     */
    closeDialog() {
      // Stop streamed video
      this.stopCamera();
      this.show = false;
    },
    /**
     * Initiating peer connections
     */
    sendOffer() {
      this.peerConnection.createOffer(
        this.setLocalAndSendOffer,
        this.handleCreateOfferError
      );
    },
    /**
     * Handling when create offer error
     */
    handleCreateOfferError(event) {
      console.log("createOffer() error: ", event);
    },
    /**
     * Set local description and send offer to partner
     */
    setLocalAndSendOffer(sessionDescription) {
      const remoteVideo = document.getElementById("remote-video");
      this.peerConnection.setLocalDescription(sessionDescription);
      console.log("setLocalAndSendMessage sending message", sessionDescription);
      this.$socket.emit(SOCKET_EVENTS.CALL_OFFER, {
        offer: sessionDescription,
        to: this.partnerID
      });
    },
    /**
     * The call to getUserMedia() will trigger a permissions request.
     * If the user accepts the permission,
     * the promise is resolved with a MediaStream containing one video and one audio track.
     * If the permission is denied, a PermissionDeniedError is thrown.
     * In case there are no matching devices connected, a NotFoundError will be thrown.
     */
    getUserMedia() {
      let vue = this;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(this.doCall)
        .catch(function(e) {
          vue.$bus.$emit(
            "showErrorMessage",
            "The permission was denied!"
          );
          vue.finishCall();
        });
    },
    /**
     * Do call
     */
    doCall(stream) {
      this.gotStream(stream);
      this.createPeerConnection();
      this.peerConnection.addStream(this.stream);
      this.sendOffer();
    },
    /**
     * Got stream
     */
    gotStream(stream) {
      this.stream = stream;
      const localVideo = document.getElementById("local-video");
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    },
    /**
     * Create peer connection
     */
    createPeerConnection() {
      try {
        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        this.peerConnection = new RTCPeerConnection(configuration);
        this.peerConnection.onicecandidate = this.sendIceCandidate;
        this.peerConnection.onaddstream = this.handleRemoteStreamAdded;
        console.log("Created RTCPeerConnnection");
      } catch (e) {
        console.log("Failed to create PeerConnection, exception: " + e.message);
        alert("Cannot create RTCPeerConnection object.");
        return;
      }
    },
    /**
     * Send ice candidate to the partner
     */
    sendIceCandidate(event) {
      if (event.candidate) {
        console.log("send ice candidate");
        let data = {
          candidate: {
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdp: event.candidate.candidate,
          },
          to: this.partnerID,
        };
        this.$socket.emit(SOCKET_EVENTS.CALL_ICE_CANDIDATE, data);
      } else {
        console.log("End of candidates.");
      }
    },
    /**
     * Handling when remote stream added
     */
    handleRemoteStreamAdded(event) {
      console.log("Remote stream added.");
      const remoteVideo = document.getElementById("remote-video");
      if (remoteVideo) {
        remoteVideo.srcObject = event.stream;
      }
    },
  },
};
</script>
<style scoped>
.remote-video {
  background: black;
  width: 100%;
  height: calc(100% - 80px);
}

.local-video {
  background: black;
  position: absolute;
  bottom: 100px;
  right: 20px;
  width: 250px;
}

.btn-call-end {
  position: absolute;
  bottom: 5px;
  left: 50%;
}
</style>
