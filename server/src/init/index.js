// import pools from '../db/database.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import { v4 as uuidv4 } from 'uuid';
import { loadProtos } from './loadProtos.js';
import { addGameSession } from '../sessions/game.session.js';

const initServer = async () => {
  try {
    // await loadGameAssets();
    await loadProtos();
    // await testAllConnections(pools);
    const gameId = uuidv4();
    addGameSession(gameId);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
