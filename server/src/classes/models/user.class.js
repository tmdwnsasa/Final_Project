import { characterAssets } from '../../assets/character.asset.js';
import { characterSkillAssets } from '../../assets/characterskill.asset.js';
import { config } from '../../config/config.js';
import { createPingPacket } from '../../utils/notification/game.notification.js';
import Inventory from './inventory.class.js';
import apiRequest from '../../db/apiRequest.js';
import ENDPOINTS from '../../db/endPoint.js';
import { itemAssets } from '../../assets/itemStat.asset.js';

class User {
  constructor(playerId, name, guild, socket, sessionId) {
    this.playerId = playerId;
    this.name = name;
    this.sessionId = sessionId;
    this.latency = 0;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.corrPos = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.lastUpdateTime = Date.now();

    this.money = null;
    this.sequence = 0;
    this.status = 'waiting'; // 'waiting','matching', 'playing'
    this.inParty = false; // 파티 중인지
    this.animationStatus = 'stand'; // 'stand', 'walk' 등등
    this.team = 'none';

    //마지막으로 쓴 스킬 시간을 저장
    this.lastSkillZ = 0;
    this.lastSkillX = 0;

    this.characterId = 0;
    this.hp = 0;
    this.speed = 0;
    this.power = 0;
    this.defense = 0;
    this.critical = 0;
    this.guild = guild;

    this.kill = 0;
    this.death = 0;
    this.damage = 0;

    this.inventory = new Inventory();
    this.state = 0;
    this.stateDuration = 0;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  updateDirection(x, y, latency) {
    const timeDiff = latency / 1000;
    this.corrPos = this.speed * timeDiff;

    this.x = this.x - this.corrPos * this.directionX;
    this.y = this.y - this.corrPos * this.directionY;

    this.x = this.x + this.corrPos * x;
    this.y = this.y + this.corrPos * y;

    this.directionX = x;
    this.directionY = y;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  changeCharacter(characterId) {
    this.characterId = characterAssets[characterId].characterId;
    this.hp = characterAssets[characterId].hp;
    this.speed = characterAssets[characterId].speed;
    this.power = characterAssets[characterId].power;
    this.defense = characterAssets[characterId].defense;
    this.critical = characterAssets[characterId].critical;
    return characterAssets[characterId];
  }

  async getAllInventoryItems() {
    this.inventory.inventoryItems = await apiRequest(ENDPOINTS.user.findUserInventory, { player_id: this.playerId });

    return this.inventory.inventoryItems;
  }

  async getEquippedItemStats() {
    let itemStats = [];
    itemStats = itemAssets;
    const inventoryItems = await this.getAllInventoryItems();
    const equippedItems = inventoryItems.filter((inventoryItem) => {
      if (inventoryItem.equippedItems === 1) return inventoryItem;
    });
    const equippedItemIds = equippedItems.map((item) => item.itemId);
    const equippedItemStats = itemStats.filter((itemStat) => equippedItemIds.includes(itemStat.itemId));

    return equippedItemStats;
  }

  async getCombinedStats() {
    const characterStats = characterAssets[this.characterId - 1];

    const combinedStats = {
      hp: characterStats.hp,
      speed: characterStats.speed,
      power: characterStats.power,
      defense: characterStats.defense,
      critical: characterStats.critical,
    };
    const equippedItemStats = await this.getEquippedItemStats();

    equippedItemStats.forEach((itemStat) => {
      combinedStats.hp += itemStat.itemHp || 0;
      combinedStats.speed += itemStat.itemSpeed || 0;
      combinedStats.power += itemStat.itemAttack || 0;
    });

    this.hp = combinedStats.hp;
    this.speed = combinedStats.speed;
    this.power = combinedStats.power;

    this.maxHp = this.hp;

    return combinedStats;
  }

  changeCharacterSkill(characterId) {
    this.zSkill = characterSkillAssets[characterId * 2];
    this.xSkill = characterSkillAssets[characterId * 2 + 1];

    return { zSkill: this.zSkill, xSkill: this.xSkill };
  }

  changeTeam(teamColor) {
    this.team = teamColor;
  }

  changeStateByBuffSkill(speedFactor = 1, powerFactor = 1, defenseFactor = 1, criticalFactor = 1, duration) {
    const beforeState = { speed: this.speed, power: this.power, defense: this.defense, critical: this.critical };
    this.speed *= speedFactor;
    this.power *= powerFactor;
    this.defense *= defenseFactor;
    this.critical *= criticalFactor;
    setTimeout(() => {
      this.clearBuffSkill(beforeState);
    }, duration * 1000);
  }

  clearBuffSkill(beforeState) {
    const { speed, power, defense, critical } = beforeState;
    this.speed = speed;
    this.power = power;
    this.defense = defense;
    this.critical = critical;
  }

  ping() {
    const now = Date.now();

    //console.log(`[${this.playerId}] ping: ${now}`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    //console.log(`Received pong from user ${this.playerId} at ${now} with latency ${this.latency}ms`);
  }

  calculatePosition(latency) {
    if (this.state !== 0) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    const timeDiff = latency / 1000;

    const distance = this.speed * config.server.frame;

    this.corrPos = this.speed * timeDiff;

    if (this.directionX !== 0 && this.directionY !== 0) {
      this.x = this.x + distance * this.directionX * 0.71;
      this.y = this.y + distance * this.directionY * 0.71;
    } else {
      this.x = this.x + distance * this.directionX;
      this.y = this.y + distance * this.directionY;
    }

    if (this.directionX !== 0 && this.directionY !== 0) {
      return {
        x: this.x + this.corrPos * this.directionX * 0.71,
        y: this.y + this.corrPos * this.directionY * 0.71,
      };
    } else {
      return {
        x: this.x + this.corrPos * this.directionX,
        y: this.y + this.corrPos * this.directionY,
      };
    }
  }
}

export default User;
