import aws from 'aws-sdk';

const {config, SES} = aws;

export const lambdaHandler = async (event, context, callback) => {
  try {
    if (event.request.challengeName === 'CUSTOM_CHALLENGE') {
      const authCode = createAuthCode();

      event.response.privateChallengeParameters = {};
      event.response.privateChallengeParameters.answer = authCode;
      event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';

      event.response.publicChallengeParameters = {};
      await sendMail(event, authCode);
    }

    return event;
  } catch (err) {
    console.log(err);
    return event;
  }
};

const createAuthCode = () => {
  return Math.floor(Math.random() * 900000) + 100000;
}

const sendMail = async (event, authCode) => {
  console.log('========= start send mail =========');

  config.update({'region': 'ap-northeast-1'});

  const message = `認証コードは「${authCode}」です。`;
  const params = {
    Destination: {
      ToAddresses: [event.request.userAttributes.email]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message
        },
        Text: {
          Charset: 'UTF-8',
          Data: message
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: '認証コードのお知らせ'
      },
    },
    Source: process.env.SENDER_EMAIL_ADDRESS,
  }

  try {
    const result = await new SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    console.log(result);
    console.log('========= success send mail =========');
  } catch (err) {
    console.error(err, err.stack);
    console.log('========= fail send mail =========');
  }
  ;
}
