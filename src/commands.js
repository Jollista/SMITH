/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import * as fs from 'fs';

function getCategoryChoices(directory) 
{
  var choices = [];
  var files = fs.readdirSync(directory)
  
  //for each file in directory
  for (let file of files) {
    console.log("file name : " + file.split(".")[0]);

    choices.push({
      name: file.split(".")[0],
      value: file,
    });
  }
  return choices;
}

//dice rolling command
export const ROLL_COMMAND = {
  name: 'roll',
  description: 'Roll a d10',
  options: [
    {
      type: 3,
      name: 'type',
      description: 'Type of dice to roll',
      required: true,
      choices: [{name:"d10", value:"d10"}, {name:"d6", value:"d6"}]
    },
    {
      type: 4,
      name: 'modifier',
      description: 'Modifier to a d10 roll, or the number of d6s to roll',
      required: false,
    },
    {
      type: 3,
      name: 'label',
      description: 'Label of the roll',
      required: false,
    },
  ],
  type: 1,
};

export const RULE_COMMAND = {
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

export const ITEM_COMMAND = {
  name: 'item',
  description: 'Look up an item',
  options: [
    {
      type: 3,
      name: 'category',
      description: 'The type of item you want to look up',
      required: true,
      choices: getCategoryChoices('./src/datapool/items'),
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
