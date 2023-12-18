/**
 * The core server that runs on a Cloudflare worker.
 */

import { Router } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { ROLL_COMMAND, RULE_COMMAND, ITEM_COMMAND, VERIFY_COMMAND } from './commands.js';
import { getRoll } from './roll.js';
import { autocomplete, findEntryInJSON } from './lookup.js';
import { createClient } from '@supabase/supabase-js';

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
  var message;

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
        //get user ID for pinging
        console.log(JSON.stringify(interaction));
        const userId = interaction['user']['id'];
        
        //get arguments
        //dietype
        var dietype = interaction.data['options'][0]['value'];
        //get modifier
        var modifier = Object.prototype.hasOwnProperty.call(interaction.data['options'], 1,) && interaction.data['options'][1]['name'] == 'modifier' ? interaction.data['options'][1]['value'] : 0;
        //get label
        var label = Object.prototype.hasOwnProperty.call(interaction.data['options'], 2,) ? interaction.data['options'][2]['value'] : 'Roll';
        label = (Object.prototype.hasOwnProperty.call(interaction.data['options'], 1,) && interaction.data['options'][1]['name'] == 'label') ? interaction.data['options'][1]['value'] : label;
        
        //output vars
        var roll;
        message = `<@${userId}>\n`;
        message += `**${label}:** `;

        if (dietype == 'd10') {
          console.log('modifier is ' + modifier);
          roll = getRoll(10, modifier, true);
          console.log('modified roll is ' + roll);
          message += '1d10 (';

          //format output
          if (roll - modifier >= 10) {
            message += '**10**) + 1d10 (' + (roll - modifier - 10);
          } else if (roll - modifier <= 0) {
            message += '1) - 1d10 (' + Math.abs(roll - modifier - 1);
          } else {
            message += roll - modifier;
          }
          message += ') + ' + modifier;
          message += '\n**Result:** ' + roll;
        } //d6 roll
        else {
          //number of dice rolled must be at least 1
          modifier = Math.max(modifier, 1);
          var total = 0;
          message += `${modifier}d6 (`;

          //for each roll to make
          for (var i = 0; i < modifier; i++) {
            roll = getRoll(6);
            total += roll;

            //bold sixes
            if (roll == 6) message += '**6**';
            else message += roll;

            //not last roll
            if (i + 1 != modifier) message += ', ';
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
        //get rule from database by name
        var rule = interaction['data']['options'][0]['value'];
        console.log(rule);
        const { data, error } = await supabase
          .from('rules')
          .select()
          .eq('name', rule);

        //logs to appease lint
        console.log(`data is ${data[0]}`);
        console.log(`error is ${error}`);

        //format output
        message = '>>> ';
        if (data[0] != undefined)
        {
          //if user is authorized for full text
          const auth_data = await supabase
            .from('authorized_users')
            .select()
            .eq('id', interaction['user']['id'])

          //if full text authorized
          if (auth_data['data'][0] != undefined)
          {
            message += `## ${rule}\n${data[0]['text']}\n\n*CPR ${data[0]['page']}*`;
            
            //if message is longer than discord max
            if (message.length >= 2000)
            {
              var overflow = message.length - 2000;
              message = `>>> ## ${rule}\n${data[0]['text'].substr(0, data[0]['text'].length-(overflow+4))}\n...\n\n*CPR ${data[0]['page']}*`
            }
          }
          else //user is not authorized for full text
          {
            message += `## ${rule}\n*In short*\n\n${data[0]['summary']}\n\n*CPR ${data[0]['page']}*`;
          }
        }
        else
        {
          message += 'Rule not found';
        }
        
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      /**
       * ITEM COMMAND
       */
      case ITEM_COMMAND.name.toLowerCase(): {
        //query database for category
        var category = interaction['data']['options'][0]['value'];
        const { data, error } = await supabase
          .from('items')
          .select()
          .eq('type', category);

        //retrieve item entry from data
        const entry = findEntryInJSON(interaction['data']['options'][1]['value'], data[0]['contents'],);

        if (error != null) 
          message = `Error retrieving data`;
        else 
        { 
          if (entry != -1) //item found
          {
            //if user is authorized for full text
            const auth_data = await supabase
              .from('authorized_users')
              .select()
              .eq('id', interaction['user']['id'])

            message = `>>> ## ${entry['name']}\n`
            //if full text authorized
            if (auth_data['data'][0] != undefined)
            {
              message += `${entry['desc']}\n\n`;
            }
            else
            {
              //if no summary, description is summary, output desc
              if (Object.prototype.hasOwnProperty.call(entry,'summary'))
                message += `${entry['summary']}\n\n`;
              else
                message += `${entry['desc']}\n\n`;
            }
            
            message += `*${entry['cost']} EB*`;

            if (Object.prototype.hasOwnProperty.call(entry, 'type')) 
            {
              message += ` *| ${entry['type']}*`;
            }
          }
          else //item not found
          {
            message = `>>> Unable to locate **${interaction['data']['options'][0]['value']}** in **${interaction['data']['options'][1]['value']}**\n\nHint: Maybe in a different category or spelled different.`;
          }
        }
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      /**
       * VERIFY COMMAND
       */
      case VERIFY_COMMAND.name.toLowerCase(): {
        //if password is correct
        if (interaction['data']['options'][0]['value'].toUpperCase() == 'PNEUMO')
        {
          //if user is authorized for full text
          const { error } = await supabase
            .from('authorized_users')
            .insert({ id: interaction['user']['id'], global_name: interaction['user']['global_name'] });
          
          console.log(JSON.stringify(error));

          if (error != null)
          {
            message = '>>> An error occurred while updating database.'
            if (error['code'] == 23505)
            {
              message += '\nAttempted verification failed because user is already in database.';
            }
          }
          else
          {
            message = '>>> Successfully added to database. You now have unfettered access to the Data Pool.';
          }
        }
        else
        {
          message = '>>> Password is incorrect.';
        }
        
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

  /**
   * AUTOCOMPLETE STUFF
   */
  if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    // initialize var to appease lint, even though it's stupid
    var choices;
    
    switch (interaction.data.name.toLowerCase()) {
      /**
       * ITEM COMMAND AUTOCOMPLETE
       */
      case ITEM_COMMAND.name.toLowerCase(): {
        console.log(`autocomplete for : ${interaction['data']['options'][1]['value']}`,);
        //get relevant json from supabase
        const { data, error } = await supabase
          .from('items')
          .select()
          .eq('type', interaction['data']['options'][0]['value']);

        choices = autocomplete(interaction['data']['options'][1]['value'], data[0]['contents'],);
        console.log(`${JSON.stringify(data[0]['contents'])}`);
        console.log('this is just to appease lint ' + error);
        console.log(choices);

        return new JsonResponse({
          type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
          data: {
            choices: choices,
          },
        });
      }
    
      /**
       * RULE COMMAND AUTOCOMPLETE
       */
      case RULE_COMMAND.name.toLowerCase(): {
        console.log(`autocomplete for : ${interaction['data']['options'][0]['value']}`,);
        const { data, error } = await supabase
          .from('rules')
          .select()

        //var choices = autocompleteRule(interaction['data']['options'][0]['value'], data[0]['contents'],);
        //console.log(`data for rule autocomplete is ${JSON.stringify(data)}`)
        console.log('this is just to appease lint ' + error);

        choices = autocomplete(interaction['data']['options'][0]['value'], data,);

        return new JsonResponse({
          type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
          data: {
            choices: choices,
          },
        });
      }
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
