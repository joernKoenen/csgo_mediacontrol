const http = require('http');
var robot = require('robotjs');

var playing = true;
//robot.keyTap("audio_play");

const port = 3337;
const host = 'localhost';

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  req.on('data', (data) => {
    try {
      processPayload(JSON.parse(data.toString()));
    } catch (e) {
      console.error(`Error retrieving data from API`)
    }
  });

  req.on('end', () => {
    res.end('');
  });
});

/**
 * Processes payloads to parse game events
 *
 * @param {object} data - Payload as JSON object
 */
function processPayload(data) {
  if (!data.previously && !data.player) return;

  if ((data.player.state.health === 0 || data.player.steamid !== data.provider.steamid) || (data.round && data.round.phase !== "live")) {
    if (!playing) {
      console.log('Play music');
      robot.keyTap("audio_play");
      playing = true;
    }
  } else {
    if (playing) {
      console.log('Stop music');
      robot.keyTap("audio_pause");
      playing = false;
    }
  }
}

server.listen(port, host);

console.log('Monitoring CS:GO rounds');
