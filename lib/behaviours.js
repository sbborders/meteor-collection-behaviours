definedBehaviours = {};

messages = {
  attachAborted: (name, collectionName) => {
    return `Attach aborted, behaviour "${name}" already attached to ${collectionName} collection`;
  },
  attachFailed: (name) => {
    return `Attach failed, behaviour "${name}" not found`;
  }
};

share = {};

share.attach = attach = function (behaviours, ...options) {
  check(behaviours, Match.OneOf(Function, [Match.OneOf(Function, String)], Object, String));

  let name, behaviourObject, context;

  if (Match.test(behaviours, String)) {
    name = behaviours.toLowerCase();
    behaviourObject = definedBehaviours[name];

    if (!behaviourObject) {
      console.error(messages.attachFailed(name));
      return;
    }

    behaviourObject.collections = behaviourObject.collections || [];

    if (behaviourObject.collections.includes(this._name)) {
      console.warn(messages.attachAborted(name, this._name));
      return;
    }

    behaviours = behaviourObject.behaviour;
  }

  if (Match.test(behaviours, Function)) {
    context = {
      collection: this,
      options: behaviourObject ? behaviourObject.options : {}
    };

    behaviours.apply(context, options);

    behaviourObject.collections = behaviourObject.collections || [];
    behaviourObject.collections.push(this._name);

    return;
  }

  if (Match.test(behaviours, [Match.OneOf(Function, String)])) {
    context = {
      collection: this
    };

    for (let behaviour of behaviours) {
      if (Match.test(behaviour, String)) {
        name = behaviour.toLowerCase();
        behaviourObject = definedBehaviours[name];

        if (!behaviourObject) {
          console.error(messages.attachFailed(name));
          continue;
        }

        behaviourObject.collections = behaviourObject.collections || [];

        if (behaviourObject.collections.includes(this._name)) {
          console.warn(messages.attachAborted(name, this._name));
          continue;
        }

        behaviour = behaviourObject.behaviour;
        context.options = behaviourObject.options;
      }

      if (Match.test(behaviour, Function)) {
        context.options = context.options || {};

        behaviour.call(context, {});

        behaviourObject.collections = behaviourObject.collections || [];
        behaviourObject.collections.push(this._name);
      }
    }

    return;
  }

  if (Match.test(behaviours, Object)) {
    for (let name in behaviours) {
      check(name, String);

      name = name.toLowerCase();
      behaviourObject = definedBehaviours[name];

      if (!behaviourObject) {
        console.error(messages.attachFailed(name));
        continue;
      }

      behaviourObject.collections = behaviourObject.collections || [];

      if (behaviourObject.collections.includes(this._name)) {
        console.warn(messages.attachAborted(name, this._name));
        continue;
      }

      let behaviour = behaviourObject.behaviour;
      context = {
        collection: this,
        options: behaviourObject ? behaviourObject.options : {}
      };

      if (Match.test(behaviour, Function)) {
        behaviour.call(context, behaviours[name]);

        behaviourObject.collections.push(this._name);
      } else {
        console.error(messages.attachFailed(name));
      }
    }

    return;
  }

  console.error("Attach failed, unknown reason");
};

CollectionBehaviours = {
  attach: (collections, ...args) => {
    console.log('CollectionBehaviours', collections);
    check(collections, Match.OneOf(Mongo.Collection, [Mongo.Collection]));
    const objectOrString = Match.OneOf(Object, String);
    check(args[0], Match.OneOf(objectOrString, [objectOrString]));

    if (Match.test(collections, Mongo.Collection)) {
      collections = [collections];
    }

    if (Match.test(args[0], Match.OneOf(Array, Object))) {
      args = args.slice(0, 1);
    }

    collections.forEach(collection => {
      attach.apply(collection, args);
    });
  },

  config: function () {
    this.configure.apply(this, arguments);
  },

  configure: (nameOrObject, options) => {
    check(nameOrObject, Match.OneOf(Object, String));
    check(options, Match.Optional(Object));

    if (Match.test(nameOrObject, String)) {
      check(options, Object);
      const tmp = {};
      tmp[nameOrObject] = options;
      nameOrObject = tmp;
    }

    if (Match.test(nameOrObject, Object)) {
      for (let name in nameOrObject) {
        let behaviourOptions = nameOrObject[name];
        name = name.toLowerCase();

        let behaviourObject = definedBehaviours[name];

        if (behaviourObject) {
          behaviourObject.options = behaviourOptions;
        } else {
          console.error(`Configure failed, behaviour "${name}" not found`);
        }
      }
    } else {
      console.error("Configure failed, unknown reason");
    }
  },

  define: function (name, behaviour, options = {}) {
    check(name, String);
    check(behaviour, Function);
    check(options, Object);
    
    name = name.toLowerCase();
    let behaviourObject = definedBehaviours[name];

    if (behaviourObject && !options?.replace) {
      console.warn('Behaviour already defined, use {replace: true} to override');
    } else {
      definedBehaviours[name] = { behaviour: behaviour };
    }
  }
};
