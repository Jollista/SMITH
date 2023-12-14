import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getRoll } from './roll.js';
import { findEntryInDirectory, findEntryInJSON } from './lookup.js';


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  console.log("type : " + type);
  console.log("id : " + id);
  console.log("data : " + JSON.stringify(data));

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    // "roll" command
    if (name === 'roll') {
      // Send a message into the channel where command was triggered from
      const userId = req.body.member.user.id;
      var modifier = data["options"].hasOwnProperty(1) ? data["options"][1]["value"] : 0;
      var dietype = data["options"][0]["value"];
      var roll;
      var message = `<@${userId}>\n`;
      var label = data["options"].hasOwnProperty(2) ? data["options"][2]["value"] : "Roll";
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

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: message,
        },
      });
    }

    if (name == 'rule')
    {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `I'm gonna be real, <@${req.body.member.user.id}>,\nThere's a lotta rules and I ain't got the data yet. I might add this later. Who knows.`,
        },
      });
    }

    if (name == 'item')
    {
      var filepath = './datapool/items/';
      var entry;
      
      entry = findEntryInJSON(data["options"][1]["value"], filepath + data["options"][0]["value"]);

      var message = 
      (entry != -1) ? `>>> ## ${entry["name"]}\n${entry["desc"]}\n\n*${entry["cost"]} EB*` 
      : `item:${data["options"][1]["value"]} not found in category:${data["options"][0]["value"]}`;

      if (entry.hasOwnProperty("type"))
      {
        message += ` *| ${entry["type"]}*`
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: message,
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
