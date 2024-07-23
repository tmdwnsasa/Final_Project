import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.status = 'waiting'; // 'waiting', 'playing'
    this.animationStatus = 'stand'; // 'stand', 'walk' 등등
    this.characterId = 0; 
    this.gold = 0;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
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
    const timeDiff = latency / 1000;
    const speed = 1;
    const distance = speed * timeDiff;

    return {
      x: this.x + distance,
      y: this.y,
    };
  }
}

export default User;
