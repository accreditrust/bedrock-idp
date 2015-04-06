/*!
 * Settings module.
 *
 * Copyright (c) 2012-2014 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([
  'angular',
  './settings-controller',
  './settings-routes'
], function(angular, settings, routes) {

'use strict';

var module = angular.module('bedrock.settings', []);

module.controller(settings);

/* @ngInject */
module.config(function($routeProvider) {
  angular.forEach(routes, function(route) {
    $routeProvider.when(route.path, route.options);
  });
});

return module.name;

});
