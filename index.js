var sd = require("suddendeath");
var SLACK_TOKEN='YOUR_VALIDATION_TOKEN'

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.suddenDeath = (req, res) => {
  return Promise.resolve()
    .then(() => {
      if (req.method !== "POST") {
        const error = new Error("Only POST requests are accepted");
        error.code = 405;
        throw error;
      }

      verifyWebhook(req.body);

      return sendSuddenDeath(req.body.text);
    })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.error(err);
      res.status(err.code || 500).send(err);
      return Promise.reject(err);
    });
};

function sendSuddenDeath(message) {
  var sdMes = sd(message).replace(/\r?\n/g, "\n");

  // See https://api.slack.com/docs/message-formatting
  const slackMessage = {
    response_type: "in_channel",
    text: `${sdMes}`,
    mrkdwn: false
  };

  return slackMessage;
}

function verifyWebhook(body) {
  if (!body || body.token !== SLACK_TOKEN) {
    const error = new Error("Invalid credentials");
    error.code = 401;
    throw error;
  }
}
