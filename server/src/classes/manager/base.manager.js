class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances');
    }
  }

  addInterval(playerId, ...args) {
    throw new Error('Method not implemented');
  }

  removeInterval(playerId) {
    throw new Error('Method not implemented');
  }

  clearAll() {
    throw new Error('Method not implemented');
  }
}

export default BaseManager;
