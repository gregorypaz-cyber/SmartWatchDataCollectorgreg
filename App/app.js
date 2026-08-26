import { MessageBuilder } from "./shared/message";
import LocalStorage from './shared/storage'
import { STORAGES } from './utils/config/constants'

App({
  globalData: {
    messageBuilder: null,
    storages: {}
  },
  onCreate(options) {
    console.log("app on create invoke");

    // Cria os arquivos de forma limpa, sem o hack de pastas do ZeppOS antigo
    for(const element of STORAGES) {
      this.globalData.storages[element] = new LocalStorage(element + "_storage.txt")
    }

    let appId;
    if (!hmApp.packageInfo) {      
      throw new Error('Set appId,  appId needs to be the same as the configuration in app.json');
    } else {
      appId = hmApp.packageInfo().appId;
    }
    this.globalData.messageBuilder = new MessageBuilder({
      appId,
    });
    this.globalData.messageBuilder.connect();
  },

  onDestroy(options) {
    console.log("app on destroy invoke");
    this.globalData.messageBuilder.disConnect();
  },
});