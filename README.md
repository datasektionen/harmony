# Harmony

> When you're tired of discord on Discord.

Harmony is a bot that maintains peace and harmony on our servers by ensuring that users have to verify themselves using a KTH email address (e.g. turetek@kth.se) can read and write messages. The bot also provides various other features which are practical for managing a student Discord server, e.g. commands for joining and leaving course discussion channels.

The bot is written in TypeScript and uses the [Discord.js](https://discord.js.org/) package to interact with the Discord API.

## Overview of Features

- Verify users via their KTH email, which is validated against [KTH's LDAP database](https://github.com/datasektionen/ldap-proxy) and the Chapter's member list ([SSO](https://github.com/datasektionen/sso)) to assign various roles. (`@verified`, `@Datasektionen`, `@Extern`, `@D-XX`, etc.)
- Allow users to join and leave course channels using the `/join` and `/leave` commands, as well as join and leave year and MSc programme community categories using the `/community` command.
- Provide more user-friendly interfaces for various commands (e.g. `/verify` and `/join`) via the `/buttons` command.
- Deal with nØllan during the reception.
    - `/verify` only allows nØllan to verify on the main server with a special code during the reception. This is done by checking if [Darkmode](https://github.com/datasektionen/darkmode) is `true`.
    - `/nollegrupp` allows setting roles and codes for all nØllegrupper.
    - `/mottagningen` provides various subcommands that automate starting and ending "reception mode" on the server.
- Allow users to translate messages from Swedish to English using custom translations of chapter-related vocabulary.
- Allow moderators to create and manage notices using the `/notice` command.
- Message all users with a certain roles using `/message`. (Do not attempt this with `>600` users, otherwise Discord gets angry.)

## Environment Variables

To run Harmony, you need to get a Discord bot token from [Discord's Developer Portal](https://discord.com/developers/applications). You should then create a `.env` file where you set one of the following environment variables depending on the version of Harmony you want to test.

> [!CAUTION]
> Do not under any circumstances add secrets such as your Discord bot token to `compose.yaml` or any files committed to the repository. Secrets should be set in `.env`, which is not tracked by source control.

| Name                         | Version                               | Notes                                                                                |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| `DISCORD_BOT_TOKEN`          | Harmony ("Main" Harmony)              | Has access to all commands except certain light-only commands like `/unverify-light` |
| `DISCORD_LIGHT_BOT_TOKEN`    | Harmony Light                         | Has a more limited set of commands, used on all committee and MSc community servers. |

For a complete list of all commands provided by Harmony, see [`src/commands/commands.ts`](src/commands/commands.ts).

### Other Environment Variables.

Aside from the environment variables set in `.env`, Harmony may be configured using the following environment variables. The default values are used in [`src/shared/env.ts`](src/shared/env.ts) and when running locally with `docker compose`. 

> [!TIP]
> `DARKMODE_URL` is not set in `compose.yaml`, so you can override its default value by setting it in your `.env` file.

| Name                         | Default value                                    | Notes                                                                                |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `NODE_ENV`                   | `development`                                    | Set to `production` in production, affects Harmony's database configuration.         |
| `SPAM_API_TOKEN`             | `spam-secret`                                    | Hive token with the `send` permission.                                               |
| `DEEPL_API_KEY`              | Not set                                          | Set to enable message translation.                                                   |
| `DARKMODE_URL`               | `https://darkmode.datasektionen.se`              | URL to the Darkmode system. Set to `true` to enable Darkmode, `false` to disable it. |
| `SPAM_URL`                   | `http://spam:3000`                               | URL to the [Spam email system](https://github.com/datasektionen/spam-rs).            |
| `DATABASE_URL`               | `postgres://harmony:harmony@db/harmony`          | URL to the Postgres database.                                                        |
| `LDAP_PROXY_URL`             | `http://nyckeln:7005/user?kthid=`                | URL used to fetch users from the LDAP proxy system.                                  |
| `SSO_URL`                    | `http://nyckeln:7003/api/users?format=single&u=` | URL used to fetch users from the SSO system.                                         |

## Build and Run

>[!IMPORTANT]
> To use Docker, you must be a member of the `docker` group. Otherwise, all commands in this section must be run with superuser privileges.

After setting one of the Discord bot environment variables and any environment variables necessary for the functionality you want to test, run the following command

```
docker compose up --build
```

Hot reload may be enabled using the `--watch` flag, i.e. by running

```
docker compose up --build --watch
```

You can interact with Harmony's database using `npm run db`, perform linting using `npm run lint`, and format your code using `npm run format`, which will run `prettier` on the [`src/`](src/) directory.

> [!WARNING]
> Any code with linting or formatting errors cannot be merged, so make sure to resolve them before opening a pull request.

## Development

### Adding a New Slash-command

### The Verification System

## Testing

### Mock Testing

### The `/test` command

### Testing in Production

> [!CAUTION]
> Testing in production is not recommended since it can lead to unforeseen consequences, especially when dealing with commands that perform database operations such as `/verify` and `/mottagningen`. This may, however, be the only way to test certain changes such as patches and bug fixes, since errors may not be reproducible locally.

If you want to test a new feature in production, contact the Head of Communications (Swe: Kommunikatör) via info@datasektionen.se. They have access to Harmony's logs, which are of great use when you want to identify or debug errors in the production environment. 

Remember to thoroughly test any feature you review or implement yourself. Subtle bugs have lead to the production database being cleared in the past and recovering from that was **not** fun at all.

## Testing

Testing in this application relies on the usage of the `test` command defined in the `src/tests` directory. Inside this directory there is a single file `test.ts`. This file defines the `test` command and functions for initializing and handling it when called by the user. The command is only visible and usable when some subcommands are added to it as specified in [README.md](https://github.com/datasektionen/harmony/blob/addtest/src/tests/README.md). Be sure to read that file carefully to learn how to set up the framework locally and how to use it.

## Testing the verification system
When running the application using `docker compose`, an instance of the Spam system and an SMTP (email) server are started which you can use to go through the verification process without interacting with the _real_ Spam system. You can access the SMTP server where all messages with verification codes are sent at `http://localhost:8080`.
