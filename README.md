[![License]](https://github.com/sbborders/meteor-collection-behaviours/blob/master/LICENSE.md)

# Behaviours for collections

Define and attach behaviours to collections.

__This package is a fork from [zimme:collection-behaviours](https://github.com/zimme/meteor-collection-behaviours) Meteor package that convert the old code in CoffeeScript to JavaScript to support new Meteor API's.__

## Installation

```sh
meteor add sbborders:collection-behaviours
```

## Available behaviours

The behaviours are split into separate packages, which depend on this package.

* `sbborders:collection-softremovable`

  This behaviour adds `.softRemove()` and `.restore()` to collections, which
  make it possible to mark documents as removed. It also tracks the time and
  user for the last soft remove and restore.

  https://atmospherejs.com/sbborders/collection-softremovable


*  (STILL NOT UPDATED) `zimme:collection-timestampable`

  This behaviour timestamps documents on insert and update. It also tracks the
  user who made the last insert or update.

  https://atmospherejs.com/zimme/collection-timestampable

## Usage

### Define a behaviour

```js
CollectionBehaviours.define('behaviourName', function(options) {
  var collection = this.collection;

  // Setup some default options for the behaviour
  var defaultOptions = {
    exampleOption: "I'm a default value"
  };

  // Make the behaviour configurable both globally and locally and uses the
  // defaults if not configured.
  options = _.defaults(options, this.options, defaultOptions);

  // Behaviour logic goes here
});
```

### Attach behaviours

```js
// Attach a behavour using the collection identifier
Meteor.users.attachBehaviour('timestampable');

// Attach a behaviour to a colleciton using CollectionBehaviours
CollectionBehaviours.attach(Meteor.users, 'timestampable');

// Attach multiple behaviours to a collection with default options
CollectionBehaviours.attach(Meteor.users, ['timestampable', 'softremovable']);

// Attach multiple behaviours to a collcetion with custom options
CollectionBehaviours.attach(Meteor.users, {
  timestampable: {
    createdAt: 'insertedAt',
  },
  softremovable: {
    removedBy: 'deletedBy',
  },
});

// Attach a behaviour to multiple collections
CollectionBehaviours.attach([Meteor.users, Posts], 'timestampable');

// Attach multiple behaviours to multiple collections
CollectionBehaviours.attach(
  [Meteor.users, Posts],
  ['timestampable', 'softremovable']
);
```

### Configuration

```js
// Configure behaviour globally i.e. set you own defaults
CollectionBehaviours.configure('behaviourName', {
  exampleOption: "I'm a global value"
});

// Attach behaviour with custom options
Meteor.users.attachBehaviour('behaviourName', {
  exampleOption: "I'm a local value"
});

// Attach behaviour with custom options, using CollectionBehaviours
CollectionBehaviours.attach(Meteor.users, 'behaviourName', {
  exampleOption: "I'm a local value"
});
```

## API

### CollectionBehaviours.define

Used to defined a new behaviour or overwrite an already defined behaviour.

```js
CollectionBehaviours.define('behaviourName', behaviourFunciton, options);
```

* `'behaviourName'`: Required. The name of the behaviour.
* `behaviourFunction`: Required. A `Function` that takes `options` as an
  argument. This function is the behaviour.
* `options`: Optional. `Object` with the options for the behaviour.

#### Options

* `replace`: Optional. Set to `true` to replace a previously defined behaviour.

### CollectionBehaviours.configure

Used to confgure behaviours globally.

```js
// Configure single behaviour
ColectionBehaviours.configure('behavioursName', options);

// Configure multiple behaviours
CollectionBehaviours.configure({
  timestampable: {
    createdAt: 'insertedAt',
    updatedBy: 'modifiedBy'
  },
  softremovable: {
    removed: 'deleted'
  }
});
```

* `'behaviourName'`: Required.  
  If set to a `String`, 'behaviourName', will configure the named behaviour.  
  If set to an `Object`, where the keys are named behaviours and the values are  
  the options for the behaviours, will configure those named behaviours.

* `options`: Optional if `behaviourName` is an `Object`.  
  See specific behaviour for available options.

### &lt;CollectionIdentifier&gt;.attachBehaviour

Used to attach behaviour(s) to the collection.

```js
Meteor.users.attachBehaviour(behaviourNameOrFunction, options);
```

* `behaviourNameOrFunction`: Required.  
  If set to a `String`, `'behaviourName'`, will attach the named behaviour.  
  If set to a `Function`, will attach that function as an anonymous behaviour.  
  If set to an `Array` of `String`/`Function`, will attach those named or  
  anonymous behaviours.  
  If set to an `Object`, where the keys are named behaviours and the values are  
  the behaviours' options, will attach those named behaviours with the provided  
  options.
* `options`: Optional. See specific behaviour for available options.

### CollectionBehaviours.attach

Used to attach behaviour(s) to collection(s).

```js
CollectionBehaviours.attach(ColletionIdentifier, behaviourNameOrFunction, options);
```

* `CollectionIdentifier`: Required. The collection or `Array` of collections  
  you want to attach the behaviour(s) to.
* `behaviourNameOrFunction`: Required.  
  If set to a `String`, `'behaviourName'`, will attach the named behaviour.  
  If set to a `Function`, will attach that function as an anonymous behaviour.  
  If set to an `Array` of `String`/`Function`, will attach those named or  
  anonymous behaviours.  
  If set to an `Object`, where the keys are named behaviours and the values are  
  the behaviours' options, will attach those named behaviours with the provided  
  options.
* `options`: Optional. See specific behaviour for available options.

## Notes

* `CollectionBehaviours.config` is an alias for `CollectionBehaviours.configure`
* The inspiration for this package came from
[`sewdn:collection-behaviours`][sewdn]

[Atmosphere]: https://atmospherejs.com
