var bedrock = GLOBAL.bedrock;

var api = {};
module.exports = api;

var by = GLOBAL.by;
var element = GLOBAL.element;
var expect = GLOBAL.expect;
var ptor = GLOBAL.protractor.getInstance();

api.get = function(slug) {
  var url = '/i/' + slug + '/settings';
  bedrock.get(url);
  expect(ptor.getCurrentUrl()).to.eventually.equal(bedrock.baseUrl + url);
  return api;
};

api.generateKey = function(options) {
  options = options || {};
  element(by.linkText('Keys')).click();
  element(by.brHeadlineMenu('Keys')).click();
  element(by.linkText('Generate Key Pair')).click();
  bedrock.waitForModalTransition();
  var modal = element(by.modal());
  modal.element(by.partialButtonText('Generate Key')).click();
  var save = modal.element(by.partialButtonText('Save'));
  bedrock.waitForElementToShow(save);
  if(options.label) {
    modal.element(by.brModel('model.key.label')).clear();
    modal.element(by.brModel('model.key.label')).sendKeys(options.label);
  }
  save.click();
  bedrock.waitForModalTransition();
};

api.revokeKey = function(query) {
  element(by.linkText('Keys')).click();
  api.getKeys().then(function(keys) {
    var key = bedrock.findOne(keys, query);
    expect(key).to.exist;
    return {key: key, index: keys.indexOf(key)};
  }).then(function(result) {
    expect(result.index).to.not.equal(-1);
    var i = result.index;
    var row = element(by.repeater('key in model.keys').row(i));
    row.element(by.trigger('menu')).click();
    element(by.linkText('Revoke')).click();
    var modal = element(by.modal());
    modal.element(by.partialButtonText('Revoke')).click();
    return api.getKey({id: result.key.id});
  }).then(function(key) {
    expect(key).to.exist;
    expect(key.revoked).to.exist;
  });
};

api.getKeys = function() {
  // FIXME: temporary hack to get keys -- figure out why commented line
  // is broken
  return element(by.repeater('key in model.keys')).evaluate('model.keys');
  //return element(by.controller('KeysController')).evaluate('model.keys');
};

api.getActiveKeys = function() {
  return api.getKeys().then(function(keys) {
    return keys.filter(function(key) {
      return !key.revoked;
    });
  });
};

api.getRevokedKeys = function() {
  return api.getKeys().then(function(keys) {
    return keys.filter(function(key) {
      return key.revoked;
    });
  });
};

api.getKey = function(query) {
  return api.getKeys().then(function(keys) {
    return bedrock.findOne(keys, query);
  });
};
