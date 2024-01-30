// Assuming that 'attach' and 'share' are defined in the same scope as in your CoffeeScript code
attach = share.attach;

Mongo.Collection.prototype.attachBehaviour = function (...args) {
  
  const objectOrString = Match.OneOf(Object, String);
  check(args[0], Match.OneOf(objectOrString, [objectOrString]));
  
  if (Match.test(args[0], Match.OneOf(Array, Object))) {
    args = args.slice(0, 1);
  }
  attach.apply(this, args);
};
