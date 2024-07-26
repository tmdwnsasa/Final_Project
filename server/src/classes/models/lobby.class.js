import { createLocationPacket } from '../../utils/notification/game.notification.js';
import IntervalManager from '../manager/interval.manager.js';

class Lobby {
  constructor() {
    this.users = [];
    this.startTime = Date.now();
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    // this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    // if (this.users.length === MAX_PLAYERS) {
    //   setTimeout(() => {
    //     this.startGame();
    //   }, 3000);
    // }

    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getAllUsers(userId) {
    return this.users;
  }

  removeUser(userId) {
    // this.users = this.users.filter((user) => user.id !== userId);
    // this.intervalManager.removePlayer(userId);

    this.users = this.users.filter((user) => user.id !== userId);
  }

  // getMaxLatency() {
  //   let maxLatency = 0;
  //   this.users.forEach((user) => {
  //     maxLatency = Math.max(maxLatency, user.latency);
  //   });
  //   return maxLatency;
  // }

  getAllLocation() {
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition();
      return { id: user.id, x, y };
    });

    return createLocationPacket(locationData);
  }
}

export default Lobby;
