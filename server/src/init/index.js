// import pools from '../db/database.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';

const initServer = async () => {
  try {
    // await loadGameAssets();
    await loadProtos();
    // await testAllConnections(pools);
    createLobbySession();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
