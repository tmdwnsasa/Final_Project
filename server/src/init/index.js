import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
import { findCharacterData } from '../db/game/game.db.js';
import Character from '../classes/models/character.class.js';
import { characterAssets } from '../assets/character.asset.js';

const initServer = async () => {
  try {
    await loadProtos();
    createLobbySession();

    const characters = await findCharacterData();
    characters.forEach((character) => {
      const characterValues = Object.values(character);
      const characterAsset = new Character(...characterValues);

      characterAssets.push(characterAsset);
    });
    console.log('Character Assets loaded success');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
