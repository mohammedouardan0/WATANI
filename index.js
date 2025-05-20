const venom = require("venom-bot");
const qrcode = require("qrcode-terminal");

venom
  .create({
    session: 'mySpecificBotSession',
    multidevice: true, // required for modern WhatsApp
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
    autoClose: 0, // <== IMPORTANT: NEVER AUTO CLOSE (0 = disable timeout)
  })
  .then((client) => startBot(client))
  .catch((e) => console.error('❌ Error starting bot:', e));

function startBot(client) {
  const sessions = new Map();

  client.onMessage(async (message) => {
    const chatId = message.from;

    if (message.body.toLowerCase() === "!hseb") {
      sessions.set(chatId, { step: "first" });
      await client.sendText(
        chatId,
        "📘Aji n7sbo Lek.\n\nCh7al Jbti F  **DAWRA LWLA** ?",
      );
      return;
    }

    const session = sessions.get(chatId);
    if (!session) return;

    if (session.step === "first") {
      const first = parseFloat(message.body.replace(",", "."));
      if (isNaN(first)) {
        await client.sendText(chatId, "❌ kteb Ra9m m9ad.");
        return;
      }
      session.first = first;
      session.step = "second";
      await client.sendText(
        chatId,
        "✅ mzyan Daba Gol lia ch7al jbti f  **Dawra tania**",
      );
    } else if (session.step === "second") {
      const second = parseFloat(message.body.replace(",", "."));
      if (isNaN(second)) {
        await client.sendText(chatId, "❌ kteb ra9m m9ad.");
        return;
      }
      session.second = second;
      session.step = "regional";
      await client.sendText(chatId, "✅ Daba etini no9ta dial  **Jihawi** ");
    } else if (session.step === "regional") {
      const regional = parseFloat(message.body.replace(",", "."));
      if (isNaN(regional)) {
        await client.sendText(chatId, "❌ Kteb ra9m m9ad.");
        return;
      }
      session.regional = regional;

      const averageSemesters = (session.first + session.second) / 2;
      const inside = averageSemesters + session.regional;
      const requiredNational = (40 - inside) / 2;

      let reply;
      if (requiredNational <= 0) {
        reply = `🎉 Mbrook! ela hsab hadchi li katgol.\nra Khassek **0** flwatani bach tnjh.`;
      } else if (requiredNational > 20) {
        reply = `⚠️ Smouhat, Bhad no9at li nta Jayb impossible tnJh khouya gha Glbha OFPPT`;
      } else {
        reply =
          `📊 7sabek Sala!\n\n` +
          `📝 Dawra 1: ${session.first}\n` +
          `📝 Dawra 2: ${session.second}\n` +
          `📝 Jihawi: ${session.regional}\n\n` +
          `🎯 Khassek Tjib **${requiredNational.toFixed(2)}** F **LWATANI** bach tnjeh inshaalah.`;
      }

      await client.sendText(chatId, reply);
      sessions.delete(chatId);
    }
  });
}
