import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';
import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(playerId, characterId, name, socket, sessionId) {
    this.playerId = playerId;
    this.name = name;
    this.sessionId = sessionId;
    this.latency = 0;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.lastUpdateTime = Date.now();

    this.sequence = 0;
    this.status = 'waiting'; // 'waiting','matching', 'playing'
    this.inParty = false; // 파티 중인지
    this.animationStatus = 'stand'; // 'stand', 'walk' 등등
    this.team = 'none';

    this.characterId = characterId;
    this.hp = 150;
    this.speed = 5;
    this.power = 10;
    this.defense = 0.1;
    this.critical = 0.05;
    this.gold = 0;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  updateDirection(x, y) {
    this.directionX = x;
    this.directionY = y;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  changeCharacter(characterId) {
    this.characterId = characterId;
    const { characters } = getGameAssets();
    const targetCharacter = characters.find((char) => char.id === characterId);
    this.hp = targetCharacter.hp;
    this.speed = targetCharacter.speed;
    this.power = targetCharacter.power;
    this.defense = targetCharacter.defense;
    this.critical = targetCharacter.critical;
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
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const distance = this.speed * config.server.frame + this.speed * config.server.frame * timeDiff;

    this.x = this.x + distance * this.directionX;
    this.y = this.y + distance * this.directionY;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x,
      y: this.y,
    };
  }
}

export default User;
