var assert = require('assert');

var BBQ = require('../');

describe('Create a queue', function() {

  it('as FIFO', function(done) {
    var list = ['a', 'b', 'c'];
    var idx = 0;

    var q = new BBQ(function(object) {
      assert.equal(list[idx++], object);

      if (q.queue.length === 0) {
        // q.stop();
        done();
      }
    });

    q.add(list[0], list[1], list[2]);
  });

  it('as LIFO', function(done) {
    var list = ['a', 'b', 'c'];
    var idx = 2;

    var q = new BBQ(function(object) {
      assert.equal(list[idx--], object);

      if (q.queue.length === 0) {
        done();
      }
    }, { lifo: true });

    q.add(list[0], list[1], list[2]);
  });

  it('with a custom interval', function(done) {
    var startMs = Date.now();
    var intervalMs = 1000;

    var q = new BBQ(function(object) {
      var variance = Math.abs(intervalMs - (Date.now() - startMs));
      assert(variance < 5);
      done();
    }, { interval: intervalMs });

    q.add('just one');
  });

  it('bound to a different context', function(done) {
    var context = { message: 'this is the context' };

    var q = new BBQ(function(object) {
      assert.strictEqual(this, context);
      done();
    }, null, context);

    q.add('a');
  });

  it('with asynchronous processing', function(done) {
    var idx = 0;
    var functionOneDone = false;

    var q = new BBQ(function(object) {
      object();
    });

    q.add(
      function() {
        setTimeout(function() {
          functionOneDone = true;
        }, 900);
      },
      function() {
        setTimeout(function() {
          assert.notEqual(functionOneDone, true);
          done();
        }, 100);
      });
  });

  it('with synchronous processing', function(done) {
    var idx = 0;
    var functionOneDone = false;

    var q = new BBQ(function(object, next) {
      object(next);

      // If we're on the second function, verify
      // previous function is complete
      if (idx++ == 1) {
        assert(functionOneDone);
        done();
      }
    });

    q.add(
      function(next) {
        setTimeout(function() {
          functionOneDone = true;
          next();
        }, 900);
      },
      function(next) {
        setTimeout(function() {
          next();
        }, 100);
      });
  });
});

describe('Add to queue', function() {
  var q = null;

  before(function() {
    q = new BBQ(function(object) {});
    q.stop();
  });

  it('just one item', function() {
    q.add('just one');
    assert.equal(q.queue.length, 1);
  });

  it('multiple items', function() {
    q.add('more', 'than', 'one');
    assert(q.queue.length > 1);
  });

  afterEach(function() {
    q.clear();
  });
});

describe('Clearing queue', function() {

  it('removes all objects', function() {
    var q = new BBQ(function(object) {});
    q.stop();

    q.add('a', 'b', 'c');
    assert(q.queue.length > 0);

    q.clear();
    assert(q.queue.length === 0);
  });
});

describe('Control queue', function() {
  var q = null;

  before(function() {
      q = new BBQ(function() {});
  });

  it('using stop()', function () {
    assert(q.interval._repeat);
    q.stop();
    assert(!q.interval._repeat);
  });

  it('using resume()', function() {
    q.resume();
    assert(q.interval._repeat);
  });
});
