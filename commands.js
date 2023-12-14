import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import * as fs from 'fs';

function getCategoryChoices(directory) 
{
  var choices = [];
  var files = fs.readdirSync(directory)
  for (let file of files) {
    console.log("file name : " + file.split(".")[0]);
    choices.push({
      name: capitalize(file.split(".")[0]),
      value: file,
    });
  }
  return choices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const ROLL_COMMAND = {
  name: 'roll',
  description: 'Roll a d10',
  options: [
    {
      type: 4,
      name: 'modifier',
      description: 'Add a modifier to the roll',
      required: false,
    }
  ],
  type: 1,
};

const RULE_COMMAND = {
  name: 'rule',
  description: 'Look up a rule',
  options: [
    {
      type: 3,
      name: 'category',
      description: 'The category of rule you want to look up',
      required: true,
      choices: getCategoryChoices('./datapool/rules/'),
    },
  ],
  type: 1,
};

const ITEM_COMMAND = {
  name: 'item',
  description: 'Look up an item',
  options: [
    {
      type: 3,
      name: 'type',
      description: 'The type of item you want to look up',
      required: true,
      choices: getCategoryChoices('./datapool/items/'),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, ROLL_COMMAND, RULE_COMMAND, ITEM_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);