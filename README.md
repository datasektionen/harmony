# Harmony

> For when you are tired of discord on Discord.

Harmony is a Bot developed for reducing discord on our Discord servers. Its main purpose is to maintain peace and harmony on the servers by making sure that only users with verified addresses (i.e. @kth.se) can join and interact with other users. The project has continually grown and now also manages things such as our official course channels.

## Current Capabilities

- Verify users' through valid @kth.se addresses, assign them proper roles once they have been verified (through a [Hodis](https://hodis.datasektionen.se/)-check).
- Allow people to join or leave course channels.

> The bot is written in TypeScript. Discord interaction is facilitated by [Discord.js](https://discord.js.org/), while e-mails are sent via [Spam](https://github.com/datasektionen/spam).

## Goals

Ideally, Harmony should be able to do the following (in no particular order of precedence):
- [x] Verify new users' access to some valid @kth.se address
- [x] Mange course channels
- [ ] Kick unverified users after some time
- [ ] Make sure that newcomers, even if verified, only have limited access during their first hours/days on the server (this is to make sure that people who join are there to stay, not to parttake in a 10-minute argument and the leave)
- [ ] Implement a reputation system where users can gain rep from competitions, bug bounties, voice chat etc.
- [ ] Penalize users that violate server rules
- [ ] Manage multiple servers at once
- [ ] Manage dFunkt-roles through a check with [dfunkt.datasektionen.se](https://dfunkt.datasektionen.se/).
