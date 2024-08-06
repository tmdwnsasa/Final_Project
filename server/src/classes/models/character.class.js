export const characterAsset = [];

class Character {
  constructor(characterId, characterName, hp, speed, power, defense, critical, price) {
    this.characterId = characterId;
    this.characterName = characterName;
    this.hp = hp;
    this.speed = speed;
    this.power = power;
    this.defense = defense;
    this.critical = critical;
    this.price = price;
  }
}

export default Character;
