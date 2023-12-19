# DATA.POOL

DATA.POOL is a discord bot for Cyberpunk RED. Source code can be found [here](https://github.com/jollista/DATA.POOL/)

## How to use

Simply [invite](https://discord.com/api/oauth2/authorize?client_id=1179341761991159908&permissions=2147485696&scope=bot)
it to one of your servers, authorize it, and have fun. Or don't. I'm not your mom.

## Features

It rolls dice, it looks up items, and pulls up rules for you.
What else could you possibly need?

### Roll

Roll some dice.

> /roll {type} {modifier} {label}

- `type` - required; type of die to roll, either d10 or d6
- `modifier` - optional; bonus to be added to a d10 roll, or the number of d6s to roll. Default 0 for d10, default 1 for d6
- `label` - optional; message output before roll in bold. Default "Roll"

![rolls](img/datapool-rolls.gif)

### Item

Pull up an item.

> /item {category} {name}

- `category` - required; category of the item you want to pull up
- `name` - required; name of the item within the specified category

![items](img/datapool-items.gif)

### Rule

Pull up a rule.

> /rule {name}

- `name` - required; name of the rule to pull up

![rules](img/datapool-rules.gif)

### Verify

Without first verifying your access to the Cyberpunk RED core rulebook, you are not permitted to access the full ruleset with this bot. You will only be shown summaries of information when using the item and rule commands.

> /verify {password}

- `password` - required; password found in the Cyberpunk RED core rulebook to enable full access to ruleset information

![verify](img/datapool-verify.gif)

## Disclaimer

DATA.POOL is unofficial content provided under the [Homebrew Content Policy of R. Talsorian Games](https://rtalsoriangames.com/homebrew-content-policy/) and is not approved or endorsed by RTG. This content references materials that are the property of R. Talsorian Games and its licensees.

## Resources

- [Discord Interactions API](https://discord.com/developers/docs/interactions/receiving-and-responding)
- [Cloudflare workers](https://workers.cloudflare.com) for hosting
- [Supabase](https://supabase.com/) for database
- First version of nightmarket data thanks to [renegadejade](https://github.com/renegadejade/glitch).
- Discord API tutorial [Getting Started](https://github.com/discord/discord-example-apphttps://github.com/discord/discord-example-app)
- [Cloudflare worker example](https://github.com/discord/cloudflare-sample-app)

## Support

If you want to support me and the work I do, I have a [ko-fi](https://ko-fi.com/jollista).

<br>
<br>
<br>

### SO WHAT ARE YOU WAITING FOR?
# [ENTER THE NET](https://discord.com/api/oauth2/authorize?client_id=1179341761991159908&permissions=2147485696&scope=bot)