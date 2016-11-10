var tmi = require('tmi.js');

var client = new tmi.client({
  identity: {
    username: 'samdsherman',
    password: 'oauth:f1z4bw2b1xiw5denvatcphox63prp6'
  },
  channels: ['tsm_doublelift']
});

client.addListener('message', (from, to, message) => {
  console.log('from: ', from);
  console.log('to: ', to);
  console.log('message: ', message);
});


client.connect();