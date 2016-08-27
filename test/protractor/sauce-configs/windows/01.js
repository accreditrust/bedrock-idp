module.exports = function(bedrock) {
  bedrock.config.protractor.config.multiCapabilities.push({
    browserName: 'internet explorer',
    version: '11.103',
    platform: 'Windows 10',
    build: bedrock.config.protractor.meta.build || null,
    name: bedrock.config.protractor.meta.name || null,
    tags: bedrock.config.protractor.meta.tags,
    shardTestFiles: false,
    maxInstances: 5,
    count: 5
  });
};
