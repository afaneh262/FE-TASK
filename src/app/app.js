'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';

import storage from './services/storage.service';
import payment from './services/payment.service';
import tree from './tree/tree.component';

import {
  routeConfig
} from './app.config';

//Import the styles :D
import './app.css';

angular.module('feTaskApp', [
  uiRouter,
  storage,
  payment,
  tree
])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['feTaskApp'], {
      strictDi: true
    });
  });
