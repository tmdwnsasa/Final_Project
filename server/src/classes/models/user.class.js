import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, playerId, latency, frame, socket) {
    this.id = id;
    this.playerId = playerId;
    this.latency = latency;
    this.frame = 1 / frame;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 3;
    this.lastUpdateTime = Date.now();

    this.sequence = 0;
    this.status = 'waiting'; // 'waiting','matching', 'playing'
    this.inParty = false; // 파티 중인지
    this.animationStatus = 'stand'; // 'stand', 'walk' 등등
    this.characterId = 0;
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

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  calculatePosition(latency) {
    const timeDiff = this.latency / 1000; // 레이턴시를 초 단위로 계산
    const distance = this.speed * this.frame + this.speed * this.frame * timeDiff;

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
