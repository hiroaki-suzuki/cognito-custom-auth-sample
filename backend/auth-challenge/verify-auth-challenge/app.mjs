export const lambdaHandler = async (event, context, callback) => {
  try {
    if (event.request.privateChallengeParameters.answer === event.request.challengeAnswer) {
      console.log('========= success verify =========');
      event.response.answerCorrect = true;
    } else {
      console.log('========= fail verify =========');
      event.response.answerCorrect = false;
    }

    return event;
  } catch (err) {
    console.log(err);
    return event;
  }
};
