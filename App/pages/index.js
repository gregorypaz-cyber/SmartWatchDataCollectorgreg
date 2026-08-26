const { storages } = getApp()._options.globalData;
const time = hmSensor.createSensor(hmSensor.id.TIME);
const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);

Page({
  state: {},
  build() {
    console.log("App build ultra-clean started");

    // 1. Fundo principal visível para garantir que a tela não está preta
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 390,
      h: 450,
      color: 0x111111,
    });

    // 2. Título do App visível
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20,
      y: 40,
      w: 350,
      h: 60,
      color: 0xffffff,
      text_size: 28,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "DATA COLLECTOR",
    });

    // 3. Botão de Teste de Registro Direto (Ex: Vape / Registro rápido)
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 95,
      y: 150,
      w: 200,
      h: 200,
      normal_src: 'vape.png',
      press_src: 'vape_press.png',
      click_func: () => {
        console.log("Botão clicado!");
        storages.vape.append(time.utc);
        
        // Feedback tátil seguro
        vibrate.stop();
        vibrate.scene = 25;
        vibrate.start();
      }
    });

    // Nota informativa na tela
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 20,
      y: 380,
      w: 350,
      h: 40,
      color: 0x00FF00,
      text_size: 16,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "Toque no ícone para registrar",
    });
  }
});