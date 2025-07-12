Package.describe({
  git: 'https://github.com/sbborders/meteor-collection-behaviours.git',
  name: 'sbborders:collection-behaviours',
  summary: 'Define and attach behaviours to collections',
  version: '3.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('3.0');

  api.use([
    'check',
    'mongo'
  ]);

  api.addFiles([
    'lib/behaviours.js',
    'lib/mongo.js'
  ]);

  api.export('CollectionBehaviours');
});
