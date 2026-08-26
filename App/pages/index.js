import { fetchAndSendChunks } from '../shared/fetch'
const { messageBuilder, storages } = getApp()._options.globalData;

const time = hmSensor.createSensor(hmSensor.id.TIME)
const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)

Page({
  state: {},
  build() {
    console.log("App build begin - Simplified UI")

    // Tela limpa e centralizada que ocupa 100% da tela do Bip 6
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 10,
      y: 100,
      w: 370,
      h: 100,
      color: 0xffffff,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "DATA COLLECTOR",
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 10,
      y: 220,
      w: 370,
      h: 80,
      color: 0x00FF00,
      text_size: 20,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "Sincronizando...",
    });

    // Dispara a sincronização de dados em background com o Supabase
    fetchAndSendChunks(storages, messageBuilder);
  }
});