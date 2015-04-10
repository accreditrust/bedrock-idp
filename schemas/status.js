/*
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

var schema = {
  required: true,
  title: 'Status',
  description: 'A status setting.',
  type: 'string',
  enum: ['active', 'disabled', 'deleted'],
  errors: {
    invalid: 'Only "active", "disabled", or "deleted" are permitted.',
    missing: 'Please enter a status.'
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
