import { fetchAndSendChunks } from '../shared/fetch'
const { messageBuilder, storages } = getApp()._options.globalData;

const time = hmSensor.createSensor(hmSensor.id.TIME);
const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);

Page({
  state: {},
  build() {
    console.log("App loaded");

    // Fundo
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: 0, w: 390, h: 450, color: 0x111111
    });

    // Título
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20, y: 30, w: 350, h: 40,
      color: 0xffffff, text_size: 24,
      align_h: hmUI.align.CENTER_H, align_v: hmUI.align.CENTER_V,
      text: "DATA COLLECTOR",
    });

    // Texto de Status (Onde você vai ver o feedback)
    const statusText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20, y: 380, w: 350, h: 40,
      color: 0x00FF00, text_size: 18,
      align_h: hmUI.align.CENTER_H, align_v: hmUI.align.CENTER_V,
      text: "Toque no ícone",
    });

    // Botão
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 95, y: 120, w: 200, h: 200,
      normal_src: 'vape.png', press_src: 'vape_press.png',
      click_func: () => {
        // 1. Salva localmente
        storages.vape.append(time.utc);
        
        // 2. Vibra
        vibrate.stop();
        vibrate.scene = 25;
        vibrate.start();

        // 3. Muda o texto para avisar que está enviando
        statusText.setProperty(hmUI.prop.MORE, {
          text: "Enviando...",
        });

        // 4. Dispara o envio para o Supabase
        fetchAndSendChunks(storages, messageBuilder, statusText);
      }
    });
  }
});