/**
 * Find a given entry in JSON where name matches entry.
 *
 * @param {String} entry
 * @param {JSON} json
 * @returns item if found, else -1
 */
export function findEntryInJSON(entry, json) {
  //for each item in json of format
  //[{"name":"blah", "cost":"ever"}, ...]
  for (let item of json) {
    if (item['name'].toUpperCase() == entry.toUpperCase()) {
      return item;
    }
  }

  return -1;
}

/**
 * Find all entries in a JSON where the partialString is a substring of the entry's name
 *
 * @param {String} partialString
 * @param {JSON} json
 * @returns a list of choices, at most 25 items long
 */
export function autocomplete(partialString, json) {
  var choices = [];
  console.log(`partialString is "${partialString}"`);

  for (let item of json) {
    if (
      choices.length < 25 &&
      item['name'].toUpperCase().includes(partialString.toUpperCase())
    ) {
      choices.push({
        name: item['name'],
        value: item['name'],
      });
    }
  }

  return choices;
}
