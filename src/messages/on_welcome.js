export function onWelcome(message, messageText) {
  if (messageText === "!verify") {
    return respondToAuthor(
      message,
      "Svara med din KTH-mejladress för att få en registreringskod!",
    );
  }
  return sendMessage(
    message,
    "Använd kommandot '!verify' för att påbörja verifikationsprocessen och få tillgång till övriga kanaler!",
  );
}

function respondToAuthor(message, successText) {
  message.author
    .createDM()
    .then((channel) => channel.send(successText))
    .catch((err) => console.error(err));
}

function sendMessage(message, text) {
  message.channel
    .send(process.env.MESSAGE_PREFIX + text)
    .catch((err) => console.error(err));
}
