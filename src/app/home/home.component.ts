import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  services = {
    async handleSignIn(formData: Record<string, any>) {
      const { username, password } = formData;
      const user = await Auth.signIn(username, password);
      if ('CUSTOM_CHALLENGE' === user.challengeName) {
        const answer = prompt(
          'メールを送信しました。メールにある６桁の数値を入力してください。'
        );
        const result = await Auth.sendCustomChallengeAnswer(user, answer!);
        console.log(result);
        window.location.reload();
      }
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
