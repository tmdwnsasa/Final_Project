// import pools from '../db/database.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
import { findCharacterData } from '../db/game/game.db.js';
import {Character} from '../classes/character.class.js';


const initServer = async () => {
  try {
    // await loadGameAssets();
    await loadProtos();
    // await testAllConnections(pools);
    createLobbySession(); 

    const characters = await findCharacterData();
    characters.forEach(character=>{
      const characterAsset = new Character();

      console.log("Character Assets loaded:", characterAsset.getCharacterName());
    });

    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
