import Vue from 'vue';

class EventBus{
  constructor(){
    this.bus = new Vue();
  }

  $on(event, handler){
    this.bus.$on(event, handler);
  }

  $once(event, handler){
    this.bus.$once(event, handler);
  }

  $off(event, handler){
    this.bus.$off(event, handler);
  }

  $emit(event, handler){
    this.bus.$emit(event, handler);
  }
}

export default{
  install(Vue){
    const bus = new EventBus();

    Vue.prototype.$bus = bus;
  }
}