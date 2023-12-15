/**
 * The core server that runs on a Cloudflare worker.
 */

import { Router } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { ROLL_COMMAND, RULE_COMMAND, ITEM_COMMAND } from './commands.js';
import { InteractionResponseFlags } from 'discord-interactions';
import { getRoll } from './roll.js';
import { findEntryInJSON } from './lookup.js';
import { createClient } from '@supabase/supabase-js'

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

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
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

  // Create a single supabase client for interacting with your database
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      /**
       * ROLL COMMAND
       */
      case ROLL_COMMAND.name.toLowerCase(): {
        // Send a message into the channel where command was triggered from
        const userId = interaction["member"]["user"]["id"];
        var modifier = (interaction.data["options"].hasOwnProperty(1) && interaction.data["options"][1]["name"] == "modifier") ? interaction.data["options"][1]["value"] : 0;
        var dietype = interaction.data["options"][0]["value"];
        var roll;
        var message = `<@${userId}>\n`;
        var label = interaction.data["options"].hasOwnProperty(2) ? interaction.data["options"][2]["value"] : "Roll";
        message += `**${label}:** `;

        if (dietype == "d10")
        {
          console.log('modifier is ' + modifier);
          roll = getRoll(10, modifier, true);
          console.log('modified roll is ' + roll);
          message += '1d10 (';

          //format output
          if (roll - modifier >= 10)
          {
            message += '**10**) + 1d10 (' + (roll - modifier - 10);
          }
          else if (roll - modifier <= 0)
          {
            message += '1) - 1d10 (' + Math.abs(roll - modifier - 1);
          }
          else
          {
            message += (roll - modifier);
          }
          message += ') + ' + modifier;
          message += '\n**Result:** ' + roll;
        }
        else //d6 roll
        {
          //number of dice rolled must be at least 1 
          modifier = Math.max(modifier, 1);
          var total = 0;
          message += `${modifier}d6 (`

          //for each roll to make
          for (var i = 0; i < modifier; i++)
          {
            roll = getRoll(6);
            total += roll;

            //bold sixes
            if (roll == 6)
              message += '**6**';
            else
              message += roll;

            //not last roll
            if (i+1 != modifier)
              message  += ', ';
          }
          message += ')';
          message += `\n**Result:** ${total}`;
        }

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      /**
       * RULE COMMAND
       */
      case RULE_COMMAND.name.toLowerCase(): {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `I'm gonna be real, <@${interaction["member"]["user"]["id"]}>,\nThere's a lotta rules and I ain't got the data yet. I might add this later. Who knows.`,
          },
        });
      }

      /**
       * ITEM COMMAND
       */
      case ITEM_COMMAND.name.toLowerCase(): {
        var category = interaction["data"]["options"][0]["value"];
        const { data, error } = await supabase
          .from('items')
          .select()
          .eq('type', category)
        
        //retrieve item entry from data
        const entry = findEntryInJSON(interaction["data"]["options"][1]["value"], data[0]["contents"]);
        var message;
        if (error != null)
          message = `Error retrieving data`;
        else
          message = JSON.stringify(entry);
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
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
    verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
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
