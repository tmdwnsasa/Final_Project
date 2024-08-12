import { characterAssets } from '../../assets/character.asset.js';
import { config } from '../../config/config.js';
import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(playerId, name, socket, sessionId) {
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

    this.money = 0;
    this.sequence = 0;
    this.status = 'waiting'; // 'waiting','matching', 'playing'
    this.inParty = false; // 파티 중인지
    this.animationStatus = 'stand'; // 'stand', 'walk' 등등
    this.team = 'none';

    this.characterId = 0;
    this.hp = 0;
    this.speed = 0;
    this.power = 0;
    this.defense = 0;
    this.critical = 0;

    this.kill = 0;
    this.death = 0;
    this.damage = 0;
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

  changeTeam(teamColor) {
    this.team = teamColor;
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
