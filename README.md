A simple, automated queue processor

###### How to install
    npm install bb-queue

###### How to use
    var BBQ = require('bb-queue');
    var bbq = new BBQ(callback, { options }, context);

<table>
  <thead>
    <tr>
      <th>Arguments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td>function(object)</td>
      <td>A function that takes one argument, this being the queue object
      to be processed. This function is called on each item of the queue</td>
    </tr>
    <tr>
      <td>options</td>
      <td>object [optional]</td>
      <td>
        <ul>
          <li>lifo      [default: false]: Processes queue from end to start</li>
          <li>interval  [ default: 500ms]: Sets the queue polling interval</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>context</td>
      <td>objecy [optional]</td>
      <td>The object that the callback will be bound to, making the object accessible through the *this* keyword</td>
    </tr>
  </body>
</table>

<table>
  <thead>
    <tr>
      <th>Methods</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>add(object)</td>
      <td>Adds an object to the queue, can be any type of object as long as you callback can handle it</td>
    </tr>
    <tr>
      <td>clear()</td>
      <td>Clears the queue</td>
    </tr>
    <tr>
      <td>stop()</td>
      <td>Stops/Pauses queue processing</td>
    </tr>
    <tr>
      <td>resume()</td>
      <td>Resumes queue processing</td>
    </tr>
  </tbody>
</table>

###### *Examples*
    /*
     * Queue is immediately monitored upon instantiation. Each object of the
     * queue is passed into the callback for processing one at a time.
     */     
    var BBQ = require('bb-queue');
    var bbq = new BBQ(function(ingredient) {
      console.log(ingredient);
    });

    bbq.add('bread');
    bbq.add('lettace');
    // You can pass multiple items in one call to add()
    bbq.add('mustard', 'onion', 'bacon');

    /*
     * Will print...
     * bread
     * lettace
     * mustard
     * onion
     * bacon
     */

    bbq.stop();     // Stop/Pause processing
    bbq.add('cat'); // oops
    bbq.clear();    // Clear queue

    bbq.add('turkey', 'ham');
    bbq.resume();   // Resume processing

    bbq.stop();     // Don't leave the queue processing if re-assigning
    bbq = new BBQ(function(color) {
      console.log(color);
    }, { lifo: true });

    bbq.add('red', 'green', 'purple');

    /*
     * Prints...
     * purple
     * green
     * red
     */

###### Change Log
**1.0.0**
- First release
