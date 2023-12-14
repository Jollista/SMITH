import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import * as fs from 'fs';

function getCategoryChoices(directory) 
{
  var choices = [];
  var files = fs.readdirSync(directory)
  
  //for each file in directory
  for (let file of files) {
    console.log("file name : " + file.split(".")[0]);

    //for each entry in file
    var json = JSON.parse(fs.readFileSync(directory + file))
    console.log(json);

    for (let entry of json)
    {
      console.log(entry);
      choices.push({
        name: capitalize(file.split(".")[0] + ': ' + entry["name"]),
        value: entry["name"],
      });
    }
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
      name: 'name',
      description: 'The category of rule you want to look up',
      required: true,
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
      name: 'category',
      description: 'The type of item you want to look up',
      required: false,
    },
    {
      type: 3,
      name: 'name',
      description: 'The name of the item',
      required: true,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, ROLL_COMMAND, RULE_COMMAND, ITEM_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);