import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Amplify} from "aws-amplify";

if (environment.production) {
  enableProdMode();
}

const conf = {
  identityPoolId: '',
  region: 'ap-northeast-1',
  userPoolId: '',
  userPoolWebClientId: '',
}

Amplify.configure(conf);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
