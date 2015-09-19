module.exports = Queue;

function Queue(cb, options, context) {
  if (cb) {
    this.cb = cb;
  }
  else {
    throw new Error('You forgot the queue processing callback');
  }

  if (options) {
    this.lifo = options.lifo || false;
    this.intervalMs = options.interval || 500;
  }

  if (context) {
    this.cb = cb.bind(context);
  }

  this.queue = [];
  this.interval = setInterval(watchQueue(this), this.intervalMs);
}

Queue.prototype.add = function() {
  // Using arguments object rather than params. Adding to temp array
  // so that the objects are added to the array in a chunk
  var temp = [];

  for (var i = 0; i < arguments.length; i++) {
    temp.push(arguments[i]);
  }
  this.queue = this.queue.concat(temp);
};

Queue.prototype.clear = function() {
  this.queue.splice(0, this.queue.length);
};

Queue.prototype.stop = function() {
  clearInterval(this.interval);
};

Queue.prototype.resume = function() {
  this.interval = setInterval(watchQueue(this), this.intervalMs);
};

function watchQueue(instance) {

  return function() {

    if (instance.queue.length > 0) {
      clearInterval(instance.interval);

      processQueue(instance);

      instance.interval = setInterval(watchQueue(instance), instance.intervalMs);
    }
  };
}

function processQueue(instance) {
  var object = null;

  while(instance.queue.length > 0) {

    if (instance.lifo === true) {
      object = instance.queue.pop();
    }
    else {
      object = instance.queue.shift();
    }
    instance.cb(object);
  }
}
