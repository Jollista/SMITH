import * as fs from 'fs';

export function findEntryInDirectory(entry, directory) 
{
	var files = fs.readdirSync(directory)
	console.log("looking for " + entry + " in " + directory);

	//for each file in files in directory
	for (let file of files)
	{
		console.log("searching in " + file);
		var found = findEntryInJSON(entry, directory + file);
		if (found != -1)
		{
			return found;
		}
	}

	return -1;
}

export function findEntryInJSON(entry, filepath)
{
	var json = JSON.parse(fs.readFileSync(filepath));

	//for each item in json of format
	//[{"name":"blah", "cost":"ever"}, ...]
	for (let item of json)
	{
		if (item["name"].toUpperCase() == entry.toUpperCase())
		{
			return item;
		}
	}

	return -1;
}