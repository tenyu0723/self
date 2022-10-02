const http = require('http')
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js-selfbot-v13");
const Keyv = require("keyv");
const db = new Keyv(`sqlite://db.sqlite`, { table: "power" });
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767),
  restTimeOffset: -1000
});
const prefix = ""
process.env.TZ = 'Asia/Tokyo'

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    response.end(`${client.user.tag} is ready!\n導入サーバー:${client.guilds.cache.size}\nユーザー:${client.users.cache.size}`)
  })
  .listen(3000)

if (process.env.TOKEN == undefined) {
  console.error('tokenが設定されていません！')
  process.exit(0)
}

client.on('ready', async () => {
  console.log(`${client.user.tag} is ready!`);
  const power = await db.get(client.user.id)
  if(power == undefined){
    await db.set(client.user.id,false)
  }
  setInterval(async () => {
    const p = await db.get(client.user.id)
    if(p != true) return;
    client.channels.cache.get("1026025040925437972").send("Interval") 
  }, 3000);
});

client.on("messageCreate", async message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(message.author.id != "945460382733058109" || !message.cotent.startsWith(prefix)){
    return;
  }
  if(command == "say"){
    const msg = message.content.slice(prefix.length+4).trim()
    message.delete()
    message.channel.send(msg)
  }
  if(command == "change"){
    const power = await db.get(client.user.id)
    if(power == true){
      message.reply("```diff\n- SETTING:STOP```停止します。")
      await db.set(client.user.id,false)
    }else if(power == false){
      message.reply("```diff\n+ SETTING:START```開始します。")
      await db.set(client.user.id,true)
    }
  }
});

client.login(process.env.TOKEN)
