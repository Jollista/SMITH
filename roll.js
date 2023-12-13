export { getRoll };

function getRoll(modifier)
{
	var roll = randInt(10);
	console.log('Roll is ' + roll);

	//check for crit
	if (roll == 10)
	{
		//explode
		roll += randInt(10);
	}
	else if (roll == 1)
	{
		//implode
		roll -= randInt(10);
	}

	return roll + modifier;
}

//returns a random integer between 1 and max, inclusive
function randInt(max)
{
	return Math.floor(Math.random() * max)+1;
}