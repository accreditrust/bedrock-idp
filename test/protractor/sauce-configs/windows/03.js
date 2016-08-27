module.exports = function(bedrock) {
  bedrock.config.protractor.config.multiCapabilities.push({
    browserName: 'chrome',
    version: '52.0',
    platform: 'Windows 10',
    build: bedrock.config.protractor.meta.build || null,
    name: bedrock.config.protractor.meta.name || null,
    tags: bedrock.config.protractor.meta.tags,
    shardTestFiles: false,
    maxInstances: 5,
    count: 5
  });
};
