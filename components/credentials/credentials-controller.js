/*!
 * Copyright (c) 2015-2016 Digital Bazaar, Inc. All rights reserved.
 *
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($scope, brSessionService) {
  var self = this;

  self.identity = null;

  $scope.$watch(function() {
    return brSessionService.session;
  }, function(newValue) {
    if(newValue) {
      init();
    }
  }, true);

  function init() {
    if(brSessionService.session.identity) {
      self.identity = brSessionService.session.identity;
    } else {
      self.identity = null;
    }
  }
}

return {brCredentialsController: factory};

});
