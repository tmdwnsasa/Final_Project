import { createLocationPacket } from '../../utils/notification/game.notification.js';
import IntervalManager from '../manager/interval.manager.js';

class Lobby {
  constructor() {
    this.users = [];
    this.startTime = Date.now();
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    this.intervalManager.addPlayer(user.playerId, user.ping.bind(user), 1000);
    this.users.push(user);
  }

  getUser(playerId) {
    return this.users.find((user) => user.playerId === playerId);
  }

  getAllUsers() {
    return this.users;
  }

  removeUser(playerId) {
    this.users = this.users.filter((user) => user.playerId !== playerId);
    this.intervalManager.removePlayer(playerId);
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.playerId, x, y };
    });

    return createLocationPacket(locationData);
  }
}

export default Lobby;
