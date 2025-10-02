# Harmony

> For when you are tired of discord on Discord.

Harmony is a Bot developed for reducing discord on our Discord servers. Its main purpose is to maintain peace and harmony on the servers by making sure that only users with verified addresses (i.e. @kth.se) can join and interact with other users. The project has continually grown and now also manages things such as our course channels.

## Current Capabilities

- Verify users' through valid @kth.se addresses, assign them proper roles once they have been verified (through a [Hodis](https://hodis.datasektionen.se/)-check).
- Allow people to join or leave course channels and year/master categories.
- Handle nØllan during the reception.
- Translate Swedish messages to English with student vocabulary.
- Message all users with a certain role (don't do this with >600 users or Discord gets angy! 😡).

> The bot is written in TypeScript. Discord interaction is facilitated by [Discord.js](https://discord.js.org/), while e-mails are sent via [Spam](https://github.com/datasektionen/spam).

## Run locally

Firstly, set the environment variables for the functionality you want to test. A token for a Discord bot is required to run at all. Either ask for someone else's token or create your own test bot through Discord Developer Portal.

Run the following (as root unless you're in the `docker` group) (supports hot-reload):

```
docker compose up --build --watch
```

To interact with the database: `npm run db`

Before each push you should run `npm run format` to format the code, since pull requests not accepted by Prettier cannot be merged.

## Environment variables

All necessary environment variables are set automatically when running with docker compose.

| Name                         | Note                                 | Default                               |
| ---------------------------- | ------------------------------------ | ------------------------------------- |
| DISCORD_BOT_TOKEN            | ---                                  | ---                                   |
| DISCORD_LIGHT_BOT_TOKEN      | Set to use light version             | ---                                   |
| SPAM_API_TOKEN               | ---                                  | ---                                   |
| DEEPL_API_KEY                | Translation disabled if unset        | ---                                   |
| DARKMODE_URL                 | URL to darkmode or `true` or `false` | https://darkmode.datasektionen.se     |
| SPAM_URL                     | Email system                         | https://spam.datasektionen.se         |
| DATABASE_URL                 | Postgres DB                          | postgres://harmony:harmony@db/harmony |
| NODE_ENV                     | `development` or `production`        | development                           |
