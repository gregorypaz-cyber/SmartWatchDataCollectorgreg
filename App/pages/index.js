import { fetchAndSendChunks } from '../shared/fetch'
const { messageBuilder, storages } = getApp()._options.globalData;

const time = hmSensor.createSensor(hmSensor.id.TIME)
const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)

Page({
  state: {},
  build() {
    console.log("App build begin")

    // Tela de loading inicial
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 0,
      w: 390,
      h: 450,
      color: 0xffffff,
      text_size: 40,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "DATA COLLECTOR\nPronto para uso!",
    });

    // Altura útil ajustada para a tela do Bip 6 (450px por página)
    const pageH = 450;

    // Ativa o scroll vertical para passar pelas 7 páginas de categorias
    hmUI.setScrollView(true, px(pageH), 7, true)
    
    // PAGE #1: VAPE
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 1, w: 390, h: pageH, color: 0x003049
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 95, y: 125 + pageH * 1, w: 200, h: 200,
      normal_src: 'vape.png', press_src: 'vape_press.png',
      click_func: () => {
        storages.vape.append(time.utc)
        vibrate.stop(); vibrate.scene = 25; vibrate.start();
      }
    })

    // PAGE #2: DRINKS
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 2, w: 390, h: pageH, color: 0xd62828
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 80 + pageH * 2, w: 140, h: 140,
      normal_src: 'drink_1.png', press_src: 'drink_1_press.png',
      click_func: () => { storages.drink.append(`${time.utc};${1}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 80 + pageH * 2, w: 140, h: 140,
      normal_src: 'drink_2.png', press_src: 'drink_2_press.png',
      click_func: () => { storages.drink.append(`${time.utc};${3}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 235 + pageH * 2, w: 140, h: 140,
      normal_src: 'drink_3.png', press_src: 'drink_3_press.png',
      click_func: () => { storages.drink.append(`${time.utc};${5}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 235 + pageH * 2, w: 140, h: 140,
      normal_src: 'drink_4.png', press_src: 'drink_4_press.png',
      click_func: () => { storages.drink.append(`${time.utc};${20}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })

    // PAGE #3: FOOD
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 3, w: 390, h: pageH, color: 0xf77f00
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 80 + pageH * 3, w: 140, h: 140,
      normal_src: 'food_1.png', press_src: 'food_1_press.png',
      click_func: () => { storages.food.append(`${time.utc};${1}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 80 + pageH * 3, w: 140, h: 140,
      normal_src: 'food_2.png', press_src: 'food_2_press.png',
      click_func: () => { storages.food.append(`${time.utc};${2}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 235 + pageH * 3, w: 140, h: 140,
      normal_src: 'food_3.png', press_src: 'food_3_press.png',
      click_func: () => { storages.food.append(`${time.utc};${6}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 235 + pageH * 3, w: 140, h: 140,
      normal_src: 'food_4.png', press_src: 'food_4_press.png',
      click_func: () => { storages.food.append(`${time.utc};${9}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })

    // PAGE #4: ALCOHOL
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 4, w: 390, h: pageH, color: 0xfcbf49
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 135 + pageH * 4, w: 140, h: 140,
      normal_src: 'alcohol_1.png', press_src: 'alcohol_1_press.png',
      click_func: () => { storages.alcohol.append(`${time.utc};${1}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 135 + pageH * 4, w: 140, h: 140,
      normal_src: 'alcohol_2.png', press_src: 'alcohol_2_press.png',
      click_func: () => { storages.alcohol.append(`${time.utc};${3}`); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })

    // PAGE #5: PEE / POO
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 5, w: 390, h: pageH, color: 0xeae2b7
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 40, y: 135 + pageH * 5, w: 140, h: 140,
      normal_src: 'pee.png', press_src: 'pee_press.png',
      click_func: () => { storages.pee.append(time.utc); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 210, y: 135 + pageH * 5, w: 140, h: 140,
      normal_src: 'poo.png', press_src: 'poo_press.png',
      click_func: () => { storages.poo.append(time.utc); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })

    // PAGE #6: HEADACHE
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0, y: pageH * 6, w: 390, h: pageH, color: 0xf9f7eb
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 95, y: 125 + pageH * 6, w: 200, h: 200,
      normal_src: 'headache.png', press_src: 'headache_press.png',
      click_func: () => { storages.headache.append(time.utc); vibrate.stop(); vibrate.scene = 25; vibrate.start(); }
    })

    // Executa o envio sincronizado para o Supabase via app-side
    fetchAndSendChunks(storages, messageBuilder);
  }
});