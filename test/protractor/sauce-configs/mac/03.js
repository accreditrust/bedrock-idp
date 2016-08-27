module.exports = function(bedrock) {
  bedrock.config.protractor.config.multiCapabilities.push({
    browserName: 'safari',
    version: '8.0',
    platform: 'OS X 10.10',
    build: bedrock.config.protractor.meta.build || null,
    name: bedrock.config.protractor.meta.name || null,
    tags: bedrock.config.protractor.meta.tags,
    shardTestFiles: false,
    maxInstances: 5,
    count: 5
  });
};
