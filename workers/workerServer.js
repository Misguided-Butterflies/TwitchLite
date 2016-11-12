// This file will import the worker master, and use it and its methods, and also
// have the whole thing set up on a server

/*
  this module should have a connection with the db

  keep count of how many bots there are

  every interval:
    get new twitch list
    remove the old ones not in this current twitch list, start as many new ones in their place
      for every item in currently active
        if not in the new, disconnect it
      for every item in the new
        if not active, add it

      need to supply what to do with highlight data when that is determined to be done

      when making a bot, need to supply it a function that will be run when highlight is found
      this function expects some highlight data as an arg; basically just channelname, start time, and endtime
      master will, using that data, go out and get the vod id/url. then it constructs a db entry and saves it


*/

/*
  actually this might be a more minimal module than I thought

  every interval:
    master.getTopStreams()
    .then(remove old, add new)

  in the tests for that ^^, there will be a func like removeOldAddNew that does that stuff
  that func will call the methods inside master
  so the tests for that func might need to be spied on?
*/
setInterval(() => {
  console.log('sup dawg');
}, 1000);
