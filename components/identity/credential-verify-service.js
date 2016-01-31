/*!
 * Credential Verification Service.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([
  'forge/js/md', 'forge/js/pki', 'forge/js/util', 'jsonld', 'lodash',
  'opencred-verifier'],
function(md, pki, util, jsonld, _, verifierFactory) {

'use strict';

/* @ngInject */
function factory($rootScope, config) {
  var service = {};

  /**
   * Creates a new credential verifier API.
   *
   * @param options the options to use:
   *          [documentLoader] a custom JSON-LD document loader to use.
   *          [disableLocalFraming] true to disable framing of local
   *            documents (default: false).
   *
   * @return the credential verifier API.
   */
  service.createVerifier = function(options) {
    return createVerifier(config, options);
  };

  // expose service to scope
  $rootScope.app.services.credentialVerify = service;

  return service;
}

function createVerifier(config, options) {
  // prepare forge
  var forge = {md: md(), pki: pki(), util: util()};

  // configure local copy of jsonld
  jsonld = jsonld();
  if(options.documentLoader) {
    jsonld.documentLoader = options.documentLoader;
  } else {
    // use secure document loader
    jsonld.useDocumentLoader('xhr', {secure: true});
  }

  return verifierFactory({
    inject: {
      forge: forge,
      jsonld: jsonld,
      _: _
    },
    disableLocalFraming: options.disableLocalFraming,
    localBaseUri: config.data.baseUri
  });
}

return {brCredentialVerifyService: factory};

});
