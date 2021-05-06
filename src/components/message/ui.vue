<template>
  <v-alert
    :value="true"
    :type="type"
    class="message-ui pb-0 pt-0"
    :color="color"
    transition="scale-transition"
    v-show="showMessage"
  >
    <v-sheet :color="color" class="d-flex" dark>
      <p style="padding-top: 15px; margin: 0px;">{{ message }}</p>
      <v-spacer></v-spacer>
      <v-btn flat="flat" icon color="white" @click="showMessage = false"><v-icon>close</v-icon></v-btn>
    </v-sheet>
  </v-alert>
</template>
<script>
export default {
  data: () => ({
    showMessage: false,
    message: "",
    type: "success",
    color: "red"
  }),
  mounted: function() {
    this.$bus.$on("showErrorMessage", (msg) => {
      this.showMessage = true;
      this.message = msg;
      this.type = "error";
      this.color = "red";
      setTimeout(() => (this.showMessage = false), 5000);
    });
    this.$bus.$on("showMessage", (msg) => {
      this.showMessage = true;
      this.message = msg;
      this.type = "success";
      this.color = "green";
      setTimeout(() => (this.showMessage = false), 5000);
    });
    this.$bus.$on("closeMessage", () => {
      this.showMessage = false;
    });
  },
};
</script>
<style scoped>
.message-ui {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 999;
  padding: 5px;
}
</style>
