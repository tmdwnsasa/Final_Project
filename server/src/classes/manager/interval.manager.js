import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addInterval(playerId, callback, interval, type) {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
