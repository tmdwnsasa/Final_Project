import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
import { findCharacterData, findCharacterSkillData } from '../db/game/game.db.js';
import Character from '../classes/models/character.class.js';
import { characterAssets } from '../assets/character.asset.js';
import { characterSkillAssets } from '../assets/characterskill.asset.js';
import CharacterSkill from '../classes/models/characterskill.class.js';
import { findMapData } from '../db/map/map.db.js';
import Map from '../classes/models/map.class.js';
import { mapAssets } from '../assets/map.asset.js';
import Item from '../classes/models/item.class.js';
import { itemAssets } from '../assets/itemStat.asset.js';
import { findAllItems } from '../db/game/game.db.js';

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

    const characterSkills = await findCharacterSkillData();
    characterSkills.forEach((character_skills) => {
      const characterValues = Object.values(character_skills);
      const characterSkillAsset = new CharacterSkill(...characterValues);

      characterSkillAssets.push(characterSkillAsset);
    });
    console.log('Character Assets loaded success');

    const items = await findAllItems();
    items.forEach((item) => {
      const itemValues = Object.values(item);
      const itemAsset = new Item(...itemValues);

      itemAssets.push(itemAsset);
    });
    
    console.log('Item Stats loaded success');

    const maps = await findMapData();
    let row = 0;
    let column = 0;
    maps.forEach((map) => {
      const mapValues = Object.values(map);
      const mapAsset = new Map(...mapValues);
      mapAssets[row][column] = mapAsset;
      if (column !== 4) {
        column++;
      } else {
        row++;
        column = 0;
      }
    });
    console.log('Map Data loaded success');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
