
import { Router } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { AWW_COMMAND, INVITE_COMMAND, TEST_COMMAND } from './commands.js';
import { getCuteUrl } from './reddit.js';
import { InteractionResponseFlags } from 'discord-interactions';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = Router();
router.get('/', (request, env) => {
  return new Response(`👋 ${"1162176713904640010"}}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }
  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const send_t_mess = await fetch("https://discord.com/api/channels/1101115986670780519/messages", {
      body: JSON.stringify({
        content: `User: ${interaction.member.user.username}(id=${interaction.member.user.id})\nsend: ${JSON.stringify(interaction.data)}`,
      }),
      method: 'POST',
      headers: {
        'Authorization': `Bot ${"MTE2MjE3NjcxMzkwNDY0MDAxMA.GIdnSH.mx-_3ttw70VZJYRy4vMpuU0i-Lj8wUbkn8jOTc"}`,
        'Content-Type': 'application/json'
      },
    }).then((response) => response.json())
    await env.DB.prepare(
      `INSERT INTO log(timestamp,player,command,other) VALUES (${Date.now()},"${interaction.member.user.id}",'${JSON.stringify(interaction.data)}',"none")`
    ).run()


    // const interac = interaction.options
    // fs.appendFileSync("./data/log.txt", `{user:${interaction.user.tag},command:${interaction.data.name.toLowerCase()}}\n`)
    // const now = new Date()
    // const hour = now.getHours()
    // const min = now.getMinutes()
    // const day = now.getDate()
    // const month = now.getMonth()
    // client.channels.cache.get('1101115986670780519').send(`${JSON.stringify(interaction.options.data)} {user:${interaction.user.tag},command:${interaction.data.name.toLowerCase()}} {month:${((month) - 1)},day:${day},hour:${hour},min:${min}}\n`)
    // fs.appendFileSync("./data/log_test.txt", `${JSON.stringify(interaction.options.data)} {user:${interaction.user.tag},command:${interaction.data.name.toLowerCase()}} {month:${((month) - 1)},day:${day},hour:${hour},min:${min}}\n`);
    // if (interaction.data.name.toLowerCase() === 'pong') {

    //     const Guild = await client.guilds.create("Test Guild", {
    //         channels: [
    //             {"name": "invite-channel"},
    //         ]
    //     });

    //     const GuildChannel = Guild.channels.cache.find(channel => channel.name == "invite-channel");
    //     const Invite = await GuildChannel.createInvite({maxAge: 0, unique: true, reason: "Testing."});
    //     // message.channel.send(`Created guild. Here's the invite code: ${Invite.url}`);
    //     console.log(`Created guild. Here's the invite code: ${Invite.url}`)
    //     await interaction.reply(`Created guild. Here's the invite code: ${Invite.url}`);
    // }
    if (interaction.data.name.toLowerCase() === 'ping') {
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "pong!",
        },
      });
    }
    if (interaction.data.name.toLowerCase() === "アカウントの登録") {
      var u_data = []
      try {
        u_data[0] =
          await env.DB.prepare(
            `SELECT u_name FROM players WHERE u_name = "${interaction.data.options[0].value}"`
          ).all();
        u_data[1] =
          await env.DB.prepare(
            `SELECT u_name FROM players WHERE u_d_id = "${interaction.member.user.id}"`
          ).all();
        if (u_data[0].results == "" && u_data[1].results == "") {
          const data = await fetch(`https://api.mojang.com/users/profiles/minecraft/${interaction.data.options[0].value}`)
            .then((response) => response.json())
          await env.DB.prepare(
            `INSERT INTO players VALUES (1,"${interaction.data.options[0].value}","${data.id}","${interaction.member.user.id}","${Date.now()}",0,"none","none",0)`
          ).all()
        }
      } catch (error) {
        console.log(error)
      }
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "success !",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }
    if (interaction.data.name.toLowerCase() === "cart") {
    }
    if (interaction.data.name.toLowerCase() === 'add-cart') {
    }
    if (interaction.data.name.toLowerCase() === 'edit-cart') {
    }
    if (interaction.data.name.toLowerCase() === 'shopの登録') {
      var id = 1
      try {
        await env.DB.prepare(
          `CREATE TABLE shops${interaction.data.options[0].value} AS SELECT * FROM shop_0`
        ).run();
        await env.DB.prepare(
          `INSERT INTO shops VALUES (${interaction.data.options[0].value},0,${interaction.member.user.id},"none","none","none","none")`
        ).run();
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `creat success! shop id = ${interaction.data.options[0].value}`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      } catch (error) {
        console.log(error)
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "error",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
    }
    if (interaction.data.name.toLowerCase() === 'edit-shop') {
    }
    if (interaction.data.name.toLowerCase() === "remove-shop") {
    }
    if (interaction.data.name.toLowerCase() === 'list') {
    }
    if (interaction.data.name.toLowerCase() === 'log') {
      var result = await env.DB.prepare("SELECT * FROM log WHERE player = ?").bind(interaction.data.options[0].value).all()
      const token = "MTE2MjE3NjcxMzkwNDY0MDAxMA.GIdnSH.mx-_3ttw70VZJYRy4vMpuU0i-Lj8wUbkn8jOTc"
      var tex = ""
      for (var i in await result.results) {
        tex += JSON.stringify(result.results[i])
      }
      var text_line = tex.split("}{")
      if (tex.length >= 2000) {
        tex = ""
        var tex1 = ""
        for (var i = 0; true; i++) {
          tex1 = tex
          if ((tex += text_line[i]).length >= 1500) {
            console.log("送信")
            fetch(`https://discord.com/api/channels/1101115986670780519/messages`, {
                body: JSON.stringify({
                  content: "`{" + tex1 + "}`"
                }),
                method: 'POST',
                headers: {
                  'Authorization': `Bot ${token}`,
                  'Content-Type': 'application/json'
                },
              })
              tex = ""
              tex1 = ""
          }else{
            tex += text_line[i]
          }
          if(text_line[i] == undefined){
            break
          }
        }
      }else{
        await fetch(`https://discord.com/api/channels/1101115986670780519/messages`, {
                body: JSON.stringify({
                  content: "`{" + tex + "}`"
                }),
                method: 'POST',
                headers: {
                  'Authorization': `Bot ${token}`,
                  'Content-Type': 'application/json'
                },
              }).then((response) => response.json())
      }
      console.log("test")
    }
    if (interaction.data.name.toLowerCase() === 'help') {
      const exampleEmbed = [{
        "fields": [
          { "name": 'HELP!!!', "value": 'this is this bot help' },
          { "name": 'ping', "value": 'pong!と返します' },
          { "name": 'help', "value": 'このbotのヘルプを表示します(これ)' },
          { "name": 'shop', "value": '登録してあるitemを買うことができます。' },
          { "name": 'add-shop', "value": 'それぞれのshopの在庫管理をすることができます。\n<@&1100283776057233408>のロールをもってる人が行うかパスワードの入力が必要です。' },
        ]
      }]
      // await interaction.editReply({ embeds: [returnembed] })
      console.log(exampleEmbed)
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: exampleEmbed
        },
      });
    }
    if (interaction.data.name.toLowerCase() === 'shop') {
    }
    return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    switch (interaction.data.name.toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase(): {
        const cuteUrl = await getCuteUrl();
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: cuteUrl,
          },
        });
      }
      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = "1162176713904640010";
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case TEST_COMMAND.name.toLowerCase(): {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "pong!",
          },
        });
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }
  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    verifyKey(body, signature, timestamp, "bcd999fbfcd4fe0a05207017bb71c13844c165d3f7bd4d32137a28141a3449c1");
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest: verifyDiscordRequest,
  fetch: async function (request, env) {
    return router.handle(request, env);
  },
};

export default server;
