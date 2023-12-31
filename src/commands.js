/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

function getCategoryChoices() {
  var choices = [];
  var table = [
    'Ammunition',
    'Armor',
    'Cyberdeck Hardware',
    'Cyberware',
    'Exotic Weapons',
    'Gear',
    'Melee Weapons',
    'Programs',
    'Ranged Weapons',
    'Street Drugs',
    'Weapon Attachments',
  ];

  //for each table in database
  for (let row of table) {
    //value is name of row in database
    var value = row.replace(' ', '') + '.json';
    value = value.toLowerCase();

    //debug output
    console.log(row);
    console.log(value);

    choices.push({
      name: row,
      value: value,
    });
  }
  console.log(choices.toString());
  return choices;
}

//dice rolling command
export const ROLL_COMMAND = {
  name: 'roll',
  description: 'Roll a d10',
  options: [
    {
      type: 4, //int
      name: 'd',
      description: 'Type of dice to roll (d10, d6, d100, etc.)',
      required: true,
    },
    {
      type: 4, //int
      name: 'modifier',
      description: 'Modifier to add or subtract from a roll',
      required: false,
    },
    {
      type: 4, //int
      name: 'number',
      description: 'Number of dice to roll',
      required: false,
    },
    {
      type: 3, //string
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
      autocomplete: true,
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
      choices: getCategoryChoices(),
    },
    {
      type: 3,
      name: 'name',
      description: 'The name of the item',
      required: true,
      autocomplete: true,
    },
  ],
  type: 1,
};

export const VERIFY_COMMAND = {
  name: 'verify',
  description: 'Unlock full text descriptions',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'Who says the quote on page 196 of the Core Rulebook?',
      required: true,
    }
  ],
  type: 1,
};
