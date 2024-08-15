import { config } from '../../config/config.js';
import { gameEnd } from '../../utils/gameEnd.js';
import {
  createAttackedSuccessPacket,
  createChattingPacket,
  createCoolTimeSuccessPacket,
  createGameSkillPacket,
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../manager/interval.manager.js';
import { v4 as uuidv4 } from 'uuid';
import Bullet from './bullet.class.js';
import { createBullQueue } from '../../utils/bullQueue.js';

const MAX_PLAYERS = 4;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.startTime = Date.now();
    this.intervalManager = new IntervalManager();

    this.intervalManager.addInterval(this.id, this.sendAllLocation.bind(this), config.server.frame * 1000, 'location');
    this.dbSaveRequest = false;

    this.bullQueue = createBullQueue(this.id);
    this.skillArr = [];
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addInterval(user.id, user.ping.bind(user), 1000, 'ping');
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

    // 상대 팀 유저 배열
    const opposingTeam = this.users.filter((user) => !user.team.includes(team));
    opposingTeam.forEach((user) => {
      if (user.x > startX && user.y < startY && user.x < endX && user.y > endY) {
        // 상대방 히트
        // 불큐 작업 추가
        this.bullQueue.add({
          gameSessionId: this.id,
          attackUserId: attackUser.playerId,
          attackedUserId: user.playerId,
          team,
        });
      }
    });
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
      { playerId: this.users[0]?.name, hp: this.users[0]?.hp, team: 'red1', x: 73, y: 2 },
      { playerId: this.users[1]?.name, hp: this.users[1]?.hp, team: 'red2', x: 73, y: -2 },
      { playerId: this.users[2]?.name, hp: this.users[2]?.hp, team: 'blue1', x: 87, y: 2 },
      { playerId: this.users[3]?.name, hp: this.users[3]?.hp, team: 'blue2', x: 87, y: -2 },
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
      return { playerId: user.name, characterId: user.characterId - 1, x, y, direction: user.directionX };
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

  updateAttack(userId, x, y, rangeX, rangeY, skillType) {
    const packet = createGameSkillPacket(userId, x, y, rangeX, rangeY, skillType);
    this.users.forEach((user) => {
      user.socket.write(packet);
    });
  }

  setBullet(attackUser, x, y, rangeX, rangeY) {
    const startPosX = attackUser.x + x;
    const startPosY = attackUser.y + y;

    const bulletNumber = uuidv4();
    let direction; // 오른쪽 = 1 , 왼쪽 = 2, 아래 = 3, 위 = 4
    if (x > 0) {
      direction = 1;
    } else if (x < 0) {
      direction = 2;
    } else if (y < 0) {
      direction = 3;
    } else {
      direction = 4;
    }

    const bullet = new Bullet(bulletNumber, startPosX, startPosY, direction);

    this.intervalManager.addInterval(
      bulletNumber,
      this.updateBullet.bind(this, bullet, attackUser, rangeX, rangeY),
      config.client.frame * 1000,
      'bullet',
    );
  }

  updateBullet(bullet, attackUser, rangeX, rangeY) {
    switch (bullet.direction) {
      case 1:
        bullet.x += 10 * config.client.frame;
        break;
      case 2:
        bullet.x -= 10 * config.client.frame;
        break;
      case 3:
        bullet.y -= 10 * config.client.frame;
        break;
      case 4:
        bullet.y += 10 * config.client.frame;
        break;
      default:
        break;
    }

    const startX = bullet.x - rangeX / 2;
    const startY = bullet.y + rangeY / 2;
    const endX = startX + rangeX;
    const endY = startY - rangeY;

    this.sendAttackedOpposingTeam(attackUser, startX, startY, endX, endY);
  }

  updateCoolTime(playerName, skillName) {
    const packet = createCoolTimeSuccessPacket(skillName);
    this.users.forEach((user) => {
      if (user.name == playerName) {
        user.socket.write(packet);
      }
    });
  }
  sendAllAttackedSuccess(playerId, hp, team) {
    const packet = createAttackedSuccessPacket(playerId, hp);

    this.users.forEach((user) => {
      user.socket.write(packet);
    });

    // 상대방 모두 죽었는지 체크
    let deathCount = 0;
    // 우리 팀 유저 배열
    const ourTeam = this.users.filter((user) => user.team.includes(team));
    // 상대 팀 유저 배열
    const opposingTeam = this.users.filter((user) => !user.team.includes(team));
    opposingTeam.forEach((user) => {
      if (user.hp <= 0) {
        deathCount += 1;
      }
    });

    if (deathCount === opposingTeam.length && this.dbSaveRequest === false) {
      gameEnd(this.id, ourTeam, opposingTeam, team, this.startTime);
      this.dbSaveRequest = true;
    }
  }
}
export default Game;
