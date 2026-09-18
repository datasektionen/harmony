# Harmony

**When you're tired of discord on Discord.**

Harmony is a bot that maintains peace and harmony on our servers by ensuring that users have to verify themselves using a KTH email address (e.g. turetek@kth.se) can read and write messages. The bot also provides various other features which are practical for managing a student Discord server, e.g. commands for joining and leaving course discussion channels.

> [!NOTE]
> The bot is written in TypeScript and uses the [Discord.js](https://discord.js.org/) package to interact with the Discord API.

## Overview of Features

- Verify users via their KTH email, which is validated against [KTH's LDAP database](https://github.com/datasektionen/ldap-proxy) and the Chapter's member list ([SSO](https://github.com/datasektionen/sso)) to assign various roles. (`@verified`, `@Datasektionen`, `@Extern`, `@D-XX`, etc.)
- Allow users to join and leave course channels using the `/join` and `/leave` commands, as well as join and leave year and MSc programme community categories using the `/community` command.
- Provide more user-friendly interfaces for various commands (e.g. `/verify` and `/join`) via the `/buttons` command.
- Deal with nØllan during the reception.
    - `/verify` only allows nØllan to verify on the main server with a special code during the reception. This is done by checking if [Darkmode](https://github.com/datasektionen/darkmode) is `true`.
    - `/nollegrupp` allows setting roles and codes for all nØllegrupper.
    - `/mottagningen` provides various subcommands that automate starting and ending "reception mode" on the server.
- Allow users to translate messages from Swedish to English using custom translations of chapter-related vocabulary.
- Allow moderators to create and manage notices, e.g. for warnings, using the `/notice` command.
- Message all users with a certain roles using `/message`. (Do not attempt this with `>600` users, otherwise Discord gets angry.)

## Environment Variables

To run Harmony, you need to get a Discord bot token from [Discord's Developer Portal](https://discord.com/developers/applications). You should then create a `.env` file where you set one of the following environment variables depending on the version of Harmony you want to test.

> [!CAUTION]
> Do not under any circumstances add secrets such as your Discord bot token to [`compose.yaml`](/compose.yaml) or any files committed to the repository. Secrets should be set in `.env`, which is not tracked by source control.

| Name                         | Version                               | Notes                                                                                |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| `DISCORD_BOT_TOKEN`          | "Main" Harmony                        | Has access to all commands except certain light-only commands like `/unverify-light` |
| `DISCORD_LIGHT_BOT_TOKEN`    | Harmony Light                         | Has a more limited set of commands, used on all committee and MSc community servers. |

For a complete list of all commands provided by Harmony, see [`src/commands/commands.ts`](src/commands/commands.ts).

### Other Environment Variables.

Aside from the environment variables set in `.env`, Harmony may be configured using the following environment variables. The default values are used in [`src/shared/env.ts`](src/shared/env.ts) and when running locally with `docker compose`. 

> [!TIP]
> `DARKMODE_URL` is not set in [`compose.yaml`](/compose.yaml), so you can override its default value by setting it in your `.env` file.

| Name                         | Default value                                    | Notes                                                                                |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `NODE_ENV`                   | `development`                                    | Set to `production` in production, affects Harmony's database configuration.         |
| `SPAM_API_TOKEN`             | `spam-secret`                                    | Hive token with the `send` permission.                                               |
| `DEEPL_API_KEY`              | Not set                                          | Set to enable message translation.                                                   |
| `DARKMODE_URL`               | `https://darkmode.datasektionen.se`              | URL to the Darkmode system. Set to `true` to enable Darkmode, `false` to disable it. |
| `SPAM_URL`                   | `http://spam:3000`                               | URL to the [Spam](https://github.com/datasektionen/spam-rs) email system.            |
| `DATABASE_URL`               | `postgres://harmony:harmony@db/harmony`          | URL to the Postgres database.                                                        |
| `LDAP_PROXY_URL`             | `http://nyckeln:7005/user?kthid=`                | URL used to fetch users from the LDAP proxy system.                                  |
| `SSO_URL`                    | `http://nyckeln:7003/api/users?format=single&u=` | URL used to fetch users from the SSO system.                                         |

## Build and Run

> [!IMPORTANT]
> To use Docker in a Linux environment, you must be a member of the `docker` group. Otherwise, all commands in this section must be run with superuser privileges.

> [!IMPORTANT]
> It is recommended to use Docker Desktop on MacOS or Windows to avoid unnecessary trouble with setting up Docker.

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

### Adding a Command

To add a new command, say `/example`, with two subcommands `/example a <variable>` and `/example b`, you should create a new subdirectory in [`src/commands/`](src/commands/) named `example`. That subdirectory should have the following tree structure.

```
src/commands/example
├── subcommands
|   ├── a
|   |   ├── example-a.handler.ts
|   |   └── example-a.variables.ts
|   └── b
|       └── example-b.handler.ts
├── examples-subcommands.names.ts
├── example.command.ts
└── example.handler.ts 
```

Aside from minor differences, e.g. having a `example/subcommands/utils.ts` file containing shared functionality used by several subcommands, all commands follow this general tree structure. For representative examples, see the source code of [`/verify`](src/commands/verify/), [`/unverify`](src/commands/unverify/), and [`/buttons`](src/commands/buttons/).

> [!TIP]
> You can reuse large parts of other commands' `-subcommands.names.ts`, `.command.ts` and `.handler.ts` files when developing your own commands.

To make your new command available on the bot, follow the steps below.

1. Add your command's name, i.e. `example` in this case, to [`src/commands/commands.names.ts`](src/commands/commands.names.ts).
2. Add your command to [`src/commands/commands.ts`](src/commands/commands.ts).
    - Add your command to the return value of `getOfficialBotCommands()` to make it available on "Main" Harmony.
    - Add your command to the return value of `getLightBotCommands()` to make it available on Harmony Light.
3. Add logic for handling your command to [`src/commands/handle-commands.ts`](src/commands/handle-commands.ts).
    - Simply update the `switch` statement in `handleChatInputCommand()` to match your command's name.

### Adding Buttons and Modals

> [!IMPORTANT]
> Make sure that you do not use any `customId` values that are already in use by other buttons or modals.

For an example of how button and modal interactions are handled in Harmony's code, you may refer to the source code of [`/buttons`](src/commands/buttons/).
- To add new buttons, you must edit `handleButtonInteraction()` in [`src/commands/buttons/buttons.handler.ts`](src/commands/buttons/buttons.handler.ts) to account for your new buttons.
- To add new modals, you must edit `modalSubmitInteractionHandler()` in [`src/commands/handle-commands.ts`](src/commands/handle-commands.ts) to account for your new modals.

### The Verification System

> [!NOTE]
> Please read this section carefully before modifying any code related to the verification system to avoid the need for debugging mysterious errors in production.

> [!WARNING]
> The information in this section might be outdated if this README has not been updated for a while, therefore the only reliable way to gain an understanding of the verification system is by reading the source code.

Most of the code related to the verification system may be found in the following files and directories.
- [`src/db/db.ts`](src/db/db.ts): Low-level database code for managing the `users` table, among other things.
- [`src/shared/utils/auth.ts`](src/shared/utils/auth.ts): Functions that interact with the LDAP proxy and SSO systems to determine which roles users should get when they verify. Most low-level verification logic is implemented here.
- [`src/shared/utils/userJoined.ts`](src/shared/utils/userJoined.ts): The function `userJoined()` is executed whenever a user joins a server with Harmony and verifies users that already exist in Harmony's `users` table, e.g. because they are rejoining the server or have been verified on another server with Harmony. During the reception, nØllan who are rejoining the server also get turned into nØllan once more by checking if they exist in the `nollan` table.
- [`src/commands/buttons/`](src/commands/buttons/): Source code for the `/buttons` command. `/buttons verify` creates buttons corresponding to the commands `/verify begin`, `/verify submit`, and `/verify nollan` (during the reception when nØllan arrive to our server). This directory mostly contains high-level logic for creating buttons and modals, not any low-level verification logic.
- [`src/commands/verify/`](src/commands/verify/): Source code for the `/verify` command. The logic for `/verify` is reused in e.g. the verification modals generated by `/buttons verify`.
- [`src/commands/unverify/`](src/commands/unverify/): Source code for the `/unverify` and `/unverify-light` commands, which are used to remove a user from Harmony's `users` table.
- [`src/commands/mottagningen/`](src/commands/mottagningen/): Source code for the `/mottagningen` command. `/mottagningen end` automatically verifies all users in Harmony's `nollan` table.

The table below illustrates the expected behavior of the verification system for various users on servers with Harmony Light.

| User                              | Behavior                                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Not a KTH student                 | If a user tries to verify using e.g. a Gmail address (@gmail.com) or an invalid KTH email address, they should be rejected. |
| KTH student, not a Chapter member | KTH students who are not Chapter members are added to the `users` table and given the `@verified` role.                     |
| KTH student, Chapter member       | Same as non-members.                                                                                                        |
| Former Chapter members            | If they exist in the Chapter's member list, i.e. SSO, they are given the `@verified` role. Otherwise, they are rejected.    |

Note that **any** user, Chapter member or not, that already exists in Harmony's `users` table will be automatically verified when (re-)joining a server with Harmony. There are some differences in what roles are given to users on servers with Harmony Light and "Main" Harmony. These differences may be found in the table below.

| User                              | Additional roles given                                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Not a KTH student                 | N/A                                                                                                                         |
| KTH student, not a Chapter member | `@Extern` and various announcement roles.                                                                                   |
| KTH student, Chapter member       | `@Datasektionen`, `@D-XX` (fetched from SSO), and various announcement roles.                                               |
| Former Chapter members            | Same as members if they exist in SSO, otherwise same as non-members.                                                        |

The behavior of the verification system also depends on the current value of Darkmode, i.e. whether it is `true` or `false`. Specifically, if Darkmode is `true` all means of verification on "Main" Harmony, i.e. `/verify` and `/buttons verify`, are disabled while Harmony Light retains the ability to verify users using the modals created by `/buttons mscverify`. When Darkmode is `true`, "Main" Harmony also allows verifying as nØllan using the `/verify nollan` command and the nØllan verification modal. Darkmode being `false` has no effect on the verification system at all.

### Harmony's Production Environment

> [!WARNING]
> If you want to add a new secret, e.g. an API key or something else you would like to keep private, contact the Head of Systems (Swe: Systemansvarig) via dsys@datasektionen.se. Do **not** follow the steps in this section.

The values of Harmony's environment variables that are used in production are set in [`job.nomad.hcl`](/job.nomad.hcl). To set a new environment variable, e.g. `EXAMPLE`, add the line `EXAMPLE=<value>` to the file.

## Testing

### Mock Testing

[Nyckeln under dörrmattan](https://github.com/datasektionen/nyckeln-under-dorrmattan) provides mock versions of the Chapter systems [LDAP proxy](https://github.com/datasektionen/ldap-proxy), [SSO](https://github.com/datasektionen/sso) and [Hive](https://github.com/datasektionen/hive), which may be used to test e.g. verification and automatic assignment of Discord roles based on a user's membership in Hive groups. Nyckeln under dörrmattan's README contains more information about how to configure the mock system.

### What About Spam?

[Spam](https://github.com/datasektionen/spam-rs) is required to test verification, since `/verify begin` attempts to send an email to the user's KTH email address which is then submitted using `/verify submit`. Spam is not mocked by default since starting Spam and an SMTP (email) server significantly increases build times.

If you want to test the verification system, you may build with the overrides in [`compose.email.yaml`](/compose.email.yaml) using the command

```
docker compose -f compose.yaml -f compose.email.yaml up --build
```

You may then access the SMTP server via your browser of choice at `http://localhost:8080`.

### Testing in Production

> [!CAUTION]
> Testing in production is not recommended since it can lead to unforeseen consequences, especially when dealing with commands that perform database operations such as `/verify` and `/mottagningen`. This may, however, be the only way to test certain changes such as patches and bug fixes, since errors may not be reproducible locally.

If you want to test a new feature in production, contact the Head of Communications (Swe: Kommunikatör) via info@datasektionen.se. They have access to Harmony's logs, which are of great use when you want to identify or debug errors in the production environment. 

Remember to thoroughly test any feature you review or implement yourself. Subtle bugs have lead to the production database being cleared in the past and recovering from that was **not** fun at all.

### The `/test` Command

The `/test` command allows you to test new functionality without creating a new slash-command. The command is only visible and usable when some subcommands are added to it. For more information, read the [`src/tests/README.md`](src/tests/README.md).
