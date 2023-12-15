/**
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
