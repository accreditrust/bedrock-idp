/*!
 * Login Modal.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($http, $timeout, brAlertService, brRefreshService, config) {
  return {
    restrict: 'A',
    scope: {},
    require: '^stackable',
    templateUrl: requirejs.toUrl(
      'bedrock-idp/components/login/login-modal.html'),
    link: Link
  };

  function Link(scope, element, attrs, stackable) {
    // clear existing feedback when showing this modal
    $timeout(function() {
      brAlertService.clearFeedback();
    });

    var model = scope.model = {};
    model.sysIdentifier = config.data.identity.id;
    model.password = '';
    model.loading = false;

    model.login = function() {
      scope.loading = true;
      brAlertService.clearFeedback();
      Promise.resolve($http.post('/session/login', {
        sysIdentifier: model.sysIdentifier,
        password: model.password
      })).then(function(response) {
        // success, close modal
        stackable.close(null);
        brRefreshService.refresh();
        scope.$apply();
      }).catch(function(err) {
        model.loading = false;
        if(err.type === 'bedrock.validation.ValidationError') {
          brAlertService.add(
            'error',
            'The password you entered was incorrect. Please try again.',
            {scope: scope});
        } else {
          brAlertService.add('error', err, {scope: scope});
        }
        scope.$apply();
      });
    };
  }
}

return {brLoginModal: factory};

});
