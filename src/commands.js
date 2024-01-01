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

export const CUSTOM_COMMAND = {
  name: 'custom',
  description: 'Add custom content',
  options: [
    {
      type: 2, //subcommand group
      name: 'item',
      description: 'Add, edit, or remove custom items',
      options: [
        {
          type: 1, //subcommand
          name: "add",
          description: "Add a custom item",
          options: [
            {
              type: 3,
              name: "name",
              description: "Name of the item to add",
              required: true
            },
            {
              type: 3,
              name: "description",
              description: "Description of the item",
              required: true
            },
            {
              type: 4,
              name: "cost",
              description: "Cost of the item",
              required: true
            },
          ]
        },
        {
          type: 1, //subcommand
          name: "edit",
          description: "Edit a custom item",
          options:[
            {
              type: 3,
              name: "name",
              description: "Name of the item to edit",
              required: true
            },
            {
              type: 3,
              name: "description",
              description: "New description",
            },
            {
              type: 4,
              name: "cost",
              description: "New cost",
            },
          ]
        },
        {
          type: 1, //subcommand
          name: "delete",
          description: "Delete a custom item",
          options:[
            {
              type: 3,
              name: "name",
              description: "Name of the item to delete",
              required: true
            },
          ]
        }
      ]
    },
    {
      type: 2, //subcommand group
      name: 'rule',
      description: 'Add, edit, or remove custom rules',
      options: [
        {
          type: 1, //subcommand
          name: "add",
          description: "Add a custom rule",
          options: [
            {
              type: 3,
              name: "name",
              description: "Name of the rule to add",
              required: true
            },
            {
              type: 3,
              name: "description",
              description: "Description of the rule",
              required: true
            },
          ]
        },
        {
          type: 1, //subcommand
          name: "edit",
          description: "Edit a custom rule",
          options:[
            {
              type: 3,
              name: "name",
              description: "Name of the rule to edit",
              required: true
            },
            {
              type: 3,
              name: "description",
              description: "New description",
            },
          ]
        },
        {
          type: 1, //subcommand
          name: "delete",
          description: "Delete a custom rule",
          options:[
            {
              type: 3,
              name: "name",
              description: "Name of the rule to delete",
              required: true
            },
          ]
        }
      ]
    },
  ],
};