import { generateToken, setRoleVerified } from "../utils";
import { token_discord, token_email, verified_users } from "../database_config";
import { sendMail } from "../mail";

export async function onDM(message, messageText) {
  if (isKthEmail(messageText)) {
    const token = generateToken(process.env.TOKEN_SIZE);
    token_discord.set(token, message.author.id, process.env.TOKEN_TIMEOUT);
    token_email.set(token, messageText, process.env.TOKEN_TIMEOUT);

    let result;
    try {
      result = await sendMail(messageText, token);
    } catch (error) {
      console.error(error);
    }
    console.log(`Email sent, received response: ${JSON.stringify(result)}`);
    return message.channel
      .send("Verifikationskod skickad. Kolla dina mejl!")
      .catch((err) => console.error(err));
  }

  if (messageIsToken(messageText)) {
    const [email_address, discord_id] = await Promise.all([
      token_discord.get(messageText),
      token_email.get(messageText),
    ]);

    if (emailAndDiscordIdIsCorrect(message, email_address, discord_id)) {
      verified_users.set(discord_id, email_address);
      try {
        await setRoleVerified(message.author);
        message.channel.send(
          `Du är nu verifierad. Dubbelkolla att du har blivit tilldelad ${process.env.DISCORD_VERIFIED_ROLE} rollen!`,
        );
      } catch (error) {
        console.error(error);
      }
      return;
    }

    return message.channel.send("Felaktig kod.").catch((err) => console.error(err));
  }

  // If the message is not and email address or a token then it's a faulty input.
  message.channel
    .send(
      "Något har blivit fel. Du ska antingen svara med en @kth.se adress, eller en giltig kod.",
    )
    .catch((err) => console.error(err));
}

function isKthEmail(messageText) {
  return new RegExp(/^.*@kth.se$/).test(messageText);
}

function messageIsToken(messageText) {
  return messageText.match(/^[a-zA-Z0-9_-]+$/);
}

function emailAndDiscordIdIsCorrect(message, email_address, discord_id) {
  return email_address && discord_id && discord_id === message.author.id;
}
