'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('tree', {
    url: '/',
    template: '<tree></tree>'
  });
}
