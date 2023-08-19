# Cognito カスタム認証サンプル

Cognitoのチャレンジ認証を用いて、独自の認証をするサンプル。

## デプロイ

AWS環境へのデプロイ  
サンプルなので、Cognito、Lambda、SESのみ、フロントはローカル)

1. backend/auth-challenge の直下で、以下のコマンドを実行する
   ```
   sam deploy --stack-name cognito-auth-challenge \
       --capabilities CAPABILITY_IAM \
       --s3-prefix cognito-auth-challenge \
       --region ap-northeast-1 \
       --resolve-s3 true \
       --parameter-overrides SenderEmailAddress=xxx@xxx.xx
    ```
    1. パラメータの説明
        - SenderEmailAddress: 認証チャレンジで利用する送信元メールアドレス
2. infra の直下で、以下のコマンドを実行する
    ```
    aws cloudformation deploy --stack-name cognito-custom-auth --template-file cf-template.yml --capabilities CAPABILITY_NAMED_IAM --parameter-overrides \
       ProjectName=cognito-custom-auth \
       CreateAuthChallengeFunctionArn=xxx \
       DefineAuthChallengeFunctionArn=xxx \
       VerifyAuthChallengeFunctionArn=xxx \
       AuthChallengeSenderEmailAddress=xxx@xxx.xxx
    ```
    1. パラメータの説明
        - ProjectName: プロジェクト名。S3のバケット名になる。ユニークな値を指定すること。
        - CreateAuthChallengeFunctionArn: backend/auth-challenge のデプロイで出力される関数のARN
        - DefineAuthChallengeFunctionArn: backend/auth-challenge のデプロイで出力される関数のARN
        - VerifyAuthChallengeFunctionArn: backend/auth-challenge のデプロイで出力される関数のARN
        - AuthChallengeEmailIdentity: 認証チャレンジで利用する送信元メールアドレス、sam deployの際に指定したメールアドレスと同じものを指定すること
3. 送信元メールアドレスに指定したメールアドレス宛にSESより検証のメールが来るので、リンクをクリックして検証を完了させる
4. src/environments.environments.tsをコピーして、src/environments/environment.dev.tsを作成する
5. environment.dev.tsの`identityPoolId`, `userPoolId`, `userPoolWebClientId`をCognitoの各種値に変更する
6. プロジェクトのルートディレクトリで`npm run start`を実行し起動する
7. ブラウザで http://localhost:4200 にアクセスする
8. 画面が表示されたら、Create Accountタブで、ユーザー名、パスワード、メールアドレス（sam deployの際に指定したメールアドレスと同じもの）でユーザーを作成する
9. メールが届くので承認コードを入力する（リロードがうまく行かないので手動でする）
10. ログインタブで、ユーザー名とパスワードを入力してログインする
11. 承認コードの入力ダイアログが開くので、届いたメールに記載されている番号を入力する

## リソース削除

AWS環境にデプロイしたリソースの削除

1. 以下のコマンドを実行する
    ```
    aws cloudformation delete-stack --stack-name cognito-custom-auth
    ```
2. backend/auth-challenge の直下で、以下のコマンドを実行する  
   `sam delete --stack-name cognito-auth-challenge --region ap-northeast-1`
