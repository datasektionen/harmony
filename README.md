# Harmony

> For when you are tired of Discord.

Harmony is a Bot developed for maintaining some semblence of order on otherwise unruly Discord servers. Its main purpose is to keep the peace on servers, by making sure that only users with verified (i.e. @kth.se) addresses can join and interact with other users.

## Current Capabilities

Harmony is pretty basic at the moment, only being able to verify users' access to valid @kth.se addresses, and assigning them the proper role once they have been verified.

Discord interaction is facilitated by [Discord.js](https://discord.js.org/), while e-mails are sent via [Spam](https://github.com/datasektionen/spam).

## Goals

Ideally, Harmony should be able to do the following (in no particular order of precedence):
- [x] Verify new users' access to some valid @kth.se address
- [ ] Kick unverified users after some time
- [ ] Make sure that newcomers, even if verified, only have limited access during their first hours/days on the server (this is to make sure that people who join are there to stay, not to parttake in a 10-minute argument and the leave)
- [ ] Enforce certain naming conventions on the server (i.e. disallow users to have inappropriate, confusing, or outright deceptive display names)
- [ ] Censor certain words and phrases
- [ ] Penalize users that violate server rules
- [ ] Manage multiple servers at once
