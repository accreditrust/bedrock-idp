/*
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var fs = require('fs');
var path = require('path');

require('bedrock-express');
require('bedrock-requirejs');
require('bedrock-session-mongodb');
require('bedrock-views');
require('../lib/idp');

var config = bedrock.config;
var dir = path.join(__dirname, '..');
config.requirejs.bower.packages.push({
  path: dir,
  manifest: JSON.parse(fs.readFileSync(
    path.join(dir, 'bower.json'), {encoding: 'utf8'}))
});

var permissions = config.permission.permissions;
var roles = config.permission.roles;

roles['identity.admin'] = {
  id: 'identity.administrator',
  label: 'Identity Administrator',
  comment: 'Role for identity administrators.',
  sysPermission: [
    permissions.IDENTITY_ADMIN.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.IDENTITY_REMOVE.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_REMOVE.id
  ]
};
roles['identity.manager'] = {
  id: 'identity.manager',
  label: 'Identity Manager',
  comment: 'Role for identity managers.',
  sysPermission: [
    permissions.IDENTITY_ADMIN.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_REMOVE.id
  ]
};

// admin role contains all permissions
roles['admin'] = {
  id: 'admin',
  label: 'Administrator',
  comment: 'Role for System Administrator.',
  sysPermission: [].concat(roles['identity.admin'].sysPermission)
};

// default registered identity role (contains all permissions for a regular
// identity)
roles['identity.registered'] = {
  id: 'identity.registered',
  label: 'Registered Identity',
  comment: 'Role for registered identities.',
  sysPermission: [].concat(roles['identity.manager'].sysPermission)
};

// serve contexts and vocabs
config.express.static.push(path.join(__dirname, 'static'));

// setup to load vocabs
config.views.vars['bedrock-angular-credential'] =
  config.views.vars['bedrock-angular-credential'] || {};
config.views.vars['bedrock-angular-credential'].libraries =
  config.views.vars['bedrock-angular-credential'].libraries || {};
config.views.vars['bedrock-angular-credential'].libraries.default = {
  vocabs: [
    config.server.baseUri + '/vocabs/test-v1.jsonld'
  ]
};

var devId = 'https://bedrock.dev:18443/i/dev';
var devKey = devId + '/keys/1';
var context = [
  'https://w3id.org/credentials/v1',
  {
    "test": "urn:test:"
  }
];

config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-recipient-1',
  type: ['Credential', 'test:EmailCredential'],
  name: 'Test 1: email',
  issued: '2015-01-01T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: 'urn:recipient:test',
  claim: {
    id: 'urn:recipient:test',
    'schema:email': 'recipient-test@example.com'
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-01T01:02:03Z',
    creator: 'urn:issuer:test:key:1',
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-1',
  type: ['Credential', 'test:EmailCredential'],
  name: 'Test 1: .com email',
  issued: '2015-01-01T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'schema:email': 'dev@example.com'
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-01T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-2',
  type: ['Credential', 'test:EmailCredential'],
  name: 'Test 2: .org email',
  issued: '2015-01-02T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'schema:email': 'dev@example.org'
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-02T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-3',
  type: ['Credential', 'test:VerifiedAddressCredential'],
  name: 'Test 3: address',
  issued: '2015-01-03T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'schema:address': {
      type: 'PostalAddress',
      'schema:streetAddress': '123 Main St',
      'schema:addressLocality': 'Somewhere',
      'schema:addressRegion': 'XX',
      'schema:postalCode': '12345-1234'
    }
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-03T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-4',
  type: ['Credential', 'test:AgeOverCredential'],
  name: 'Test 4: age over 21',
  issued: '2015-01-04T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'test:ageOver': '21'
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-04T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-5',
  type: ['Credential', 'test:BirthDateCredential'],
  name: 'Test 5: birth date',
  issued: '2015-01-05T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'schema:birthDate': '2001-02-03',
    'schema:birthPlace': {
      type: 'schema:Place',
      address: {
        type: 'PostalAddress',
        'schema:streetAddress': '1000 Birthing Center Rd',
        'schema:addressLocality': 'Somewhere',
        'schema:addressRegion': 'XX',
        'schema:postalCode': '12345-1234'
      }
    }
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-05T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});
config['credentials-mongodb'].provider.credentials.push({
  '@context': context,
  id: 'urn:credential:test-dev-6',
  type: ['Credential', 'test:PhysicalExaminationCredential'],
  name: 'Test 6: physical',
  issued: '2015-01-06T01:02:03Z',
  issuer: 'urn:issuer:test',
  recipient: devId,
  claim: {
    id: devId,
    'schema:height': '182 cm',
    'schema:weight': '77 Kg'
  },
  signature: {
    type: 'GraphSignature2012',
    created: '2015-01-06T01:02:03Z',
    creator: devKey,
    signatureValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=='
  },
  sysState: 'claimed'
});

// idp config
config.idp.defaults.identity.address = [];
config.idp.defaults.identity.preferences = {
  type: 'IdentityPreferences'
};
config.idp.defaults.identity.sysPublic = [];
config.idp.defaults.identity.sysResourceRole = [{
  sysRole: 'identity.registered',
  generateResource: 'id'
}];

// identities
config.idp.identities.push({
  '@context': config.constants.IDENTITY_CONTEXT_V1_URL,
  type: 'Identity',
  sysSlug: 'bedrock',
  label: 'Bedrock',
  email: 'bedrock@bedrock.dev',
  sysPassword: 'password',
  sysResourceRole: [{
    sysRole: 'identity.registered',
    generateResource: 'id'
  }]
});
config.idp.identities.push({
  '@context': config.constants.IDENTITY_CONTEXT_V1_URL,
  type: 'Identity',
  sysSlug: 'dev',
  label: 'Dev',
  email: 'dev@bedrock.dev',
  sysPassword: 'password',
  sysResourceRole: [{
    sysRole: 'identity.registered',
    generateResource: 'id'
  }]
});

// identity service
config.idp.owner =
  config.server.baseUri + config.idp.identityBasePath + '/bedrock';

bedrock.start();
