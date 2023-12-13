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
      var modifier = data.hasOwnProperty("options") ? data["options"][0]["value"] : 0;
      console.log('modifier is ' + modifier);
      var roll = getRoll(modifier);
      console.log('modified roll is ' + roll);
      var message = `<@${userId}>` + '\n**Roll:** 1d10 (';

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
