import { config } from '../../config/config.js';
import { gameEnd } from '../../utils/gameEnd.js';
import {
  createAttackedSuccessPacket,
  createChattingPacket,
  createGameSkillPacket,
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../manager/interval.manager.js';

const MAX_PLAYERS = 4;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.startTime = Date.now();
    this.intervalManager = new IntervalManager();

    this.intervalManager.addInterval(this.id, this.sendAllLocation.bind(this), config.server.frame * 1000, 'location');
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addInterval(user.id, user.ping.bind(user), 1000, 'ping');
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(playerId) {
    return this.users.find((user) => user.playerId === playerId);
  }

  getAllUsers() {
    return this.users;
  }

  removeUser(playerId) {
    this.users = this.users.filter((user) => user.playerId !== playerId);
    this.intervalManager.removeInterval(playerId, 'ping');
  }

  sendAttackedOpposingTeam(attackUser, startX, startY, endX, endY) {
    let team;
    if (attackUser.team.includes('red')) {
      team = 'red';
    } else {
      team = 'blue';
    }

    const attackedData = [];
    let deathCount = 0;

    // 우리 팀 유저 배열
    const ourTeam = this.users.filter((user) => user.team.includes(team));
    // 상대 팀 유저 배열
    const opposingTeam = this.users.filter((user) => !user.team.includes(team));
    opposingTeam.forEach((user) => {
      if (user.x > startX && user.y < startY && user.x < endX && user.y > endY && user.hp > 0) {
        // 상대방 히트
        user.hp -= attackUser.power;
        attackUser.damage += attackUser.power;
        attackedData.push({ playerId: user.name, hp: user.hp });

        if (user.hp <= 0) {
          attackUser.kill += 1;
          user.death += 1;
        }
      }

      // 상대팀이 모두 죽었는지 체크
      if (user.hp <= 0) {
        deathCount += 1;
      }
    });

    if (attackedData.length) {
      const packet = createAttackedSuccessPacket(attackedData);

      this.users.forEach((user) => {
        user.socket.write(packet);
      });
    }

    // deathCount === opposingTeam.length
    if (deathCount === opposingTeam.length) {
      gameEnd(this.id, ourTeam, opposingTeam, team, this.startTime);
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.startTime = Date.now();
    const battleStartData = [
      { playerId: this.users[0]?.playerId, team: 'red1', x: 73, y: 2 },
      { playerId: this.users[1]?.playerId, team: 'red2', x: 73, y: -2 },
      { playerId: this.users[2]?.playerId, team: 'blue1', x: 87, y: 2 },
      { playerId: this.users[3]?.playerId, team: 'blue2', x: 87, y: -2 },
    ];
    this.users.forEach((user, index) => {
      user.updatePosition(battleStartData[index].x, battleStartData[index].y);
    });
    const battleStartPacket = gameStartNotification(battleStartData);
    console.log(battleStartData);
    this.users.forEach((user) => {
      user.socket.write(battleStartPacket);
    });
  }

  sendAllLocation() {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { playerId: user.name, characterId: user.characterId - 1, x, y };
    });

    const packet = createLocationPacket(locationData);

    this.users.forEach((user) => {
      user.socket.write(packet);
    });
  }

  sendAllChatting(userId, message, type) {
    const packet = createChattingPacket(userId, message, type);
    this.users.forEach((user) => {
      user.socket.write(packet);
    });
  }

  removeGameInterval() {
    this.intervalManager.removeInterval(this.id, 'location');
  }

  updateAttack(userId, x, y, rangeX, rangeY) {
    const packet = createGameSkillPacket(userId, x, y, rangeX, rangeY);
    this.users.forEach((user) => {
      user.socket.write(packet);
    });
  }
}

export default Game;
