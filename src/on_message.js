import { hasRoleVerified, generateToken, verified_users } from "./utils";
import { token_discord, token_email, setRoleVerified } from "./database_config";
import fetch from "node-fetch";

/**
 * Listens to  message events emitted to the Client, and responds according to
 * context.
 *
 * Generally, there are 4 cases that we handle here:
 * - A user sends a message in the specified Welcome Channel
 * - A user sends the !verify command in the specified Welcome Channel
 * - A user sends Harmony a DM with a KTH address
 * - A user sends Harmony a DM with a Token-like string
 * Any other case is disregarded.
 *
 * The process is the following for any new, unverified user:
 * 1. They join the Welcome Channel when they join the Server ('Guild' as per Discord terms).
 * 2. They get a prompt from Harmony to use the !verify command.
 * 3. Upon using !verify, they are sent a DM by Harmony, requesting their KTH-address.
 * 4. The user sends their address to Harmony in the DM channel.
 * 5. Harmony generates a verification token, and sends an email containing the token via Spam,
 * 	  while also saving the token->email and token->discord_id association in their respective
 * 	  key-value stores.
 * 6. The user responds with the token in the DM channel.
 * 7. Harmony checks that the token is valid for that user.
 * 7.a If it is, the user is assigned the Verified role.
 * 7.b If it is not, Harmony responds with an error message.
 *
 * TODO: Should probably break this up into smaller functions, and I am not
 * 		100% certain on how correct the async behavior is...
 */
export function onMessage(msg) {
  if (msg.author.bot) {
    return;
  }
  if (hasRoleVerified(msg.author)) {
    return;
  }
  const text = msg.content.trim();
  if (msg.channel.id === process.env.DISCORD_WELCOME_CHANNEL_ID) {
    if (text === "!verify") {
      msg.author
        .createDM()
        .then((channel) => {
          channel.send(
            "Svara med din KTH-mejladress för att få en registreringskod!",
          );
        })
        .catch((err) => console.error(err));
    } else {
      msg.channel
        .send(
          process.env.MESSAGE_PREFIX +
            "Använd kommandot '!verify' för att påbörja verifikationsprocessen och få tillgång till övriga kanaler!",
        )
        .catch((err) => console.error(err));
    }
  } else if (msg.channel.type === "dm") {
    if (new RegExp(/^.*@kth.se$/).test(text)) {
      const token = generateToken(process.env.TOKEN_SIZE);
      token_discord.set(token, msg.author.id, process.env.TOKEN_TIMEOUT);
      token_email.set(token, text, process.env.TOKEN_TIMEOUT);
      // TODO: Abstract away email dispatch, maybe write a better template.
      fetch(`${process.env.SPAM_URL}/api/sendmail`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "no-reply@datasektionen.se",
          to: text,
          subject: "Discord Verifikation",
          html: `<p>Verifikationskod: ${token}</p>`,
          key: process.env.SPAM_API_TOKEN,
        }),
      })
        .then((res) =>
          console.log(`Email sent, received response: ${JSON.stringify(res)}`),
        )
        .then(
          msg.channel
            .send("Verifikationskod skickad. Kolla dina mejl!")
            .catch((err) => console.error(err)),
        );
    } else if (text.match(/^[a-zA-Z0-9_-]+$/)) {
      Promise.all([token_email.get(text), token_discord.get(text)])
        .then(([email_address, discord_id]) => {
          if (email_address && discord_id && discord_id === msg.author.id) {
            verified_users.set(discord_id, email_address);
            setRoleVerified(msg.author).then(
              msg.channel
                .send(
                  `Du är nu verifierad. Dubbelkolla att du har blivit tilldelad ${process.env.DISCORD_VERIFIED_ROLE} rollen!`,
                )
                .catch((err) => console.error(err)),
            );
          } else {
            msg.channel
              .send("Felaktig kod.")
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    } else {
      msg.channel
        .send(
          "Något har blivit fel. Du ska antingen svara med en @kth.se adress, eller en giltig kod.",
        )
        .catch((err) => console.error(err));
    }
  }
}
