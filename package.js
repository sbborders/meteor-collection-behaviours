Package.describe({
  git: 'https://github.com/sbborders/meteor-collection-behaviours.git',
  name: 'sbborders:collection-behaviours',
  summary: 'Define and attach behaviours to collections',
  version: '2.0.1'
});

Package.onUse(function (api) {
  api.versionsFrom('2.8.0');

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
