export const lambdaHandler = async (event, context, callback) => {
  try {
    if (event.request.session.length === 1 && event.request.session[0].challengeName === 'SRP_A') {
      console.log('========= start password authentication =========');
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = 'PASSWORD_VERIFIER';
    } else if (event.request.session.length === 2 && event.request.session[1].challengeName === 'PASSWORD_VERIFIER' && event.request.session[1].challengeResult === true) {
      console.log('========= start auth challenge =========');
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = 'CUSTOM_CHALLENGE';
    } else if (event.request.session.length === 3 && event.request.session[2].challengeName === 'CUSTOM_CHALLENGE' && event.request.session[2].challengeResult === true) {
      console.log('========= success auth challenge =========');
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      console.log('========= fail auth challenge =========');
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    }

    return event;
  } catch (err) {
    console.log(err);
    return event;
  }
};
