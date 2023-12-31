export { getRoll };

function getRoll(max, number = 1, explodes = false) {
  var rolls = [];
  for (let i = 0; i < number; i++) 
  {
    //get roll
    var roll = randInt(max);
    rolls.push(roll);
    
    //crit check
    if (explodes)
    {
      if (roll == max) //explode
      {
        roll = randInt(max);
        rolls.push(roll);
      }
      else if (roll == 1) //implode
      {
        roll = -1*randInt(max);
        rolls.push(roll);
      }
    }
  }

  return rolls;
}

//returns a random integer between 1 and max, inclusive
function randInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
