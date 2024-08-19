import { characterAssets } from '../../assets/character.asset.js';
import { mapAssets } from '../../assets/map.asset.js';
import { config } from '../../config/config.js';
import { changingOwnerOfMap } from '../../utils/changingOwnerOfMap.js';
import { gameEnd } from '../../utils/gameEnd.js';
import {
  createAttackedSuccessPacket,
  createChattingPacket,
  createGameSkillPacket,
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../manager/interval.manager.js';
import Bullet from './bullet.class.js';
import { createBullQueue } from '../../utils/bullQueue.js';
import { updateBlueWinCount, updateGreenWinCount } from '../../db/map/map.db.js';

const MAX_PLAYERS = 4;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.startTime = Date.now();
    this.map = null;
    this.intervalManager = new IntervalManager();

    this.intervalManager.addInterval(this.id, this.sendAllLocation.bind(this), config.server.frame * 1000, 'location');
    this.dbSaveRequest = false;

    this.bullQueue = createBullQueue(this.id);
    this.skillArr = [];
  }

  addUser(user) {
    console.log(this.users);
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

  sendAttackedOpposingTeam(attackUser, startX, startY, endX, endY, bullet = null) {
    // 상대 팀 유저 배열
    const opposingTeam = this.users.filter((user) => user.team !== attackUser.team);
    opposingTeam.forEach((user) => {
      if (user.x > startX && user.y < startY && user.x < endX && user.y > endY) {
        // 상대방 히트
        // 불큐 작업 추가
        this.bullQueue.add({
          gameSessionId: this.id,
          attackUserId: attackUser.playerId,
          attackedUserId: user.playerId,
        });

        if (bullet) {
          this.intervalManager.removeInterval(bullet.bulletNumber, 'bullet');
        }
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

    // 전투할 지역 뽑기
    const disputedArea = [];
    mapAssets.filter((rows) =>
      rows.filter((map) => {
        if (map.isDisputedArea === 1) {
          disputedArea.push(map);
        }
      }),
    );
    const randomMapIndex = Math.floor(Math.random() * disputedArea.length);
    const randomMap = disputedArea[randomMapIndex];
    this.map = randomMap;
    console.log(`지역 이름: ${randomMap.mapName}`);

    const battleStartData = [
      { playerId: this.users[0]?.name, hp: this.users[0]?.hp, team: 'green1', x: 73, y: 2 },
      { playerId: this.users[1]?.name, hp: this.users[1]?.hp, team: 'green2', x: 73, y: -2 },
      { playerId: this.users[2]?.name, hp: this.users[2]?.hp, team: 'blue1', x: 87, y: 2 },
      { playerId: this.users[3]?.name, hp: this.users[3]?.hp, team: 'blue2', x: 87, y: -2 },
    ];
    this.users.forEach((user, index) => {
      user.updatePosition(battleStartData[index].x, battleStartData[index].y);
    });
    const battleStartPacket = gameStartNotification(battleStartData, this.map.mapName);
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

  updateAttack(userId, x, y, rangeX, rangeY, skillType, prefabNum = null) {
    const packet = createGameSkillPacket(userId, x, y, rangeX, rangeY, skillType, prefabNum);
    this.users.forEach((user) => {
      user.socket.write(packet);
    });
  }

  setBullet(attackUser, x, y, rangeX, rangeY, bulletNumber) {
    const startPosX = attackUser.x + x;
    const startPosY = attackUser.y + y;

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

    this.sendAttackedOpposingTeam(attackUser, startX, startY, endX, endY, bullet);
  }

  sendAllAttackedSuccess(attackUserId, attackedUserId, hp) {
    const attackUser = this.getUser(attackUserId);
    const attackedUser = this.getUser(attackedUserId);
    const packet = createAttackedSuccessPacket(attackedUser.name, hp);

    this.users.forEach((user) => {
      user.socket.write(packet);
    });

    // 상대방 모두 죽었는지 체크
    let deathCount = 0;
    // 우리 팀 유저 배열
    const ourTeam = this.users.filter((user) => user.team === attackUser.team);
    // 상대 팀 유저 배열
    const opposingTeam = this.users.filter((user) => user.team !== attackUser.team);
    opposingTeam.forEach((user) => {
      if (user.hp <= 0) {
        deathCount += 1;
      }
    });

    if (deathCount === opposingTeam.length && this.dbSaveRequest === false) {
      gameEnd(this.id, ourTeam, opposingTeam, attackUser.team, this.startTime, this.map.mapName);
      if (attackUser.team === 'green') {
        this.map.countGreenWin++;
        updateBlueWinCount(this.map.countRedWin, this.map.mapId);
      } else {
        this.map.countBlueWin++;
        updateGreenWinCount(this.map.countBlueWin, this.map.mapId);
      }
      changingOwnerOfMap(this.map);
      this.dbSaveRequest = true;
    }
  }
}
export default Game;
