import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
import { findCharacterData, findCharacterSkillData } from '../db/game/game.db.js';
import Character from '../classes/models/character.class.js';
import { characterAssets } from '../assets/character.asset.js';
import { characterSkillAssets } from '../assets/characterskill.asset.js';
import CharacterSkill from '../classes/models/characterskill.class.js';

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
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
