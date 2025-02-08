# Harmony

> For when you are tired of discord on Discord.

Harmony is a Bot developed for reducing discord on our Discord servers. Its main purpose is to maintain peace and harmony on the servers by making sure that only users with verified addresses (i.e. @kth.se) can join and interact with other users. The project has continually grown and now also manages things such as our official course channels.

## Current Capabilities

- Verify users' through valid @kth.se addresses, assign them proper roles once they have been verified (through a [Hodis](https://hodis.datasektionen.se/)-check).
- Allow people to join or leave course channels.

> The bot is written in TypeScript. Discord interaction is facilitated by [Discord.js](https://discord.js.org/), while e-mails are sent via [Spam](https://github.com/datasektionen/spam).

## Run locally

Set the environment variables for the functionality you want to test, with `.env.example` containing a template for this.

Run the following (as root unless you're in the `docker` group) (supports hot-reload):

```
docker compose up --build --watch
```

To interact with the database:

```
docker compose exec -it db psql -U harmony -d harmony
```
