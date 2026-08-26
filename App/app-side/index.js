import { MessageBuilder } from "../shared/message"
import { ENDPOINT, KEY } from '../utils/config/constants'

const messageBuilder = new MessageBuilder();

async function fetchData(ctx, param) {
  try {    
    const res = await fetch({
      url: ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`
      },
      body: JSON.stringify({        
        type: param.type,
        provider: 'ZEPP',
        raw_payload: param.data 
      })
    });

    // O Supabase salva e retorna sucesso com corpo vazio. 
    // Em vez de tentar fazer JSON.parse do nada, simplesmente assumimos que deu certo se não caiu no catch!
    ctx.response({
      data: { result: "OK" },
    });

  } catch (error) {        
    ctx.response({
      data: { result: "ERROR-" + error.message },
    });
  }
};

AppSideService({
  onInit() {
    messageBuilder.listen(() => { });

    messageBuilder.on("request", (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);      
      return fetchData(ctx, jsonRpc);
    });
  },

  onRun() { },

  onDestroy() { },
});