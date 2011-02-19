Impact Socket.IO Plugin
==========

#### Socket.IO Plugin for the Impact Game Engine ####

This plugin provides basic realtime multiplayer interaction within games made with the [Impact Game Engine](http://impactjs.com/).

### Requirements ###

You'll need NodeJS. A NodeJS based Socket.IO server, and a Javascript Socket.IO client are included in the example app.

You'll also need to accept that this isn't a one-size-fits-all solution. If it works out of the box, that's fantastic!

### Example App ###

Included in this repo is a basic sample app. To get it running, opening a terminal:
  
  %> cd path/to/this/repo/example
  
  %> node server.js
  
Now open up a browser and go to http://localhost:3000

You'll see a dude.

Open up anothe browser and go to http://localhost:3000

In the first browser you'll see a pale looking dude.
In the second browser you'll still only see one dude. There's a bug there.

In the first browser, press W, S, A, or D. The second browser will now have two dudes, one of them is the dude you're controlling from the first browser.

### Usage ###

1. Study the example app. The various methods in `example/lib/main.js` are pretty crucial.
2. Copy the impsock.js file into your `lib/plugins/` directory.
3. Add it to the list of required modules as `plugins.impsock` in your main game file.

