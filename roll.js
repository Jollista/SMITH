export { getRoll };

function getRoll(max, modifier=0, explodes=false)
{
	var roll = randInt(max);
	console.log('Roll is ' + roll);

	//check for crit
	if (explodes && roll == max)
	{
		//explode
		roll += randInt(max);
	}
	else if (explodes && roll == 1)
	{
		//implode
		roll -= randInt(max);
	}

	return roll + modifier;
}

//returns a random integer between 1 and max, inclusive
function randInt(max)
{
	return Math.floor(Math.random() * max)+1;
}