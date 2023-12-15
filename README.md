# DATA.POOL

DATA.POOL is a discord bot for Cyberpunk RED. 

## How to use

Simply [invite](https://discord.com/api/oauth2/authorize?client_id=1179341761991159908&permissions=2147485696&scope=bot)
it to one of your servers, authorize it, and have fun. Or don't. I'm not your mom.

## Features

It rolls dice, it looks up items, and pulls up rules* for you.
What else could you possibly need?
> ! rule command currently non-functional. I'm just one person and it's a lot of rules.

### Roll

> /roll {type} {modifier} {label}
- `type` - required; type of die to roll, either d10 or d6
- `modifier` - optional; bonus to be added to a d10 roll, or the number of d6s to roll. Default 0 for d10, default 1 for d6
- `label` - optional; message output before roll in bold. Default "Roll"

### Item

> /item {category} {name}
- `category` - required; category of the item you want to pull up
- `name` - required; name of the item within the specified category

### Rule

Currently lacks data required to work. I might fix this eventually. If it is fixed, it will function similar to item.

## Disclaimer

This is a fan project. Cyberpunk, Cyberpunk RED and all related copyrights and trademarks are owned by R.Talsorian Games. This project is no way related to or endorsed by R.Talsorian Games. 
>! Don't sue me

## Resources

- [Discord Interactions API](https://discord.com/developers/docs/interactions/receiving-and-responding)
- [Cloudflare workers](https://workers.cloudflare.com) for hosting
- [Supabase](https://supabase.com/) for database
- First version of nightmarket data thanks to [renegadejade](https://github.com/renegadejade/glitch).
- Discord API tutorial [Getting Started](https://github.com/discord/discord-example-apphttps://github.com/discord/discord-example-app)
- [Cloudflare worker example](https://github.com/discord/cloudflare-sample-app)
