class AppLogger {
  constructor(){
    this.initLogger();
  }

  initLogger(){
    if (process.env.NODE_ENV !== 'production'){
      this.log = console.log.bind(console);
      this.debug = console.log.bind(console);
      this.info = console.log.bind(console);
      this.warn = console.log.bind(console);
      this.error = console.log.bind(console);
    } else{
      this.log = this.debug = this.info = this.warn = this.error = () => {};
    }
  }
}

export default new AppLogger();