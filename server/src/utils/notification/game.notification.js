import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

const makeNotification = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(message.length + config.packet.totalLength + config.packet.typeLength, 0);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  const message = Location.create(payload);
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

export const createChattingPacket = (playerId, message, type) => {
  const protoMessages = getProtoMessages();
  const chatting = protoMessages.uiNotification.ChattingUpdate;

  const payload = { playerId, message, type };
  const packetMessage = chatting.create(payload);
  const chattingPacket = chatting.encode(packetMessage).finish();
  return makeNotification(chattingPacket, PACKET_TYPE.CHATTING);
};

export const createMatchingCompleteNotification = (message) => {
  const protoMessages = getProtoMessages();
  const matchingComplete = protoMessages.gameNotification.MatchMakingComplete;

  const payload = { message };
  const packetMessage = matchingComplete.create(payload);
  const matchingCompletePacket = matchingComplete.encode(packetMessage).finish();

  return makeNotification(matchingCompletePacket, PACKET_TYPE.MATCHMAKING);
};

export const gameStartNotification = (users) => {
  const protoMessages = getProtoMessages();
  const BattleStart = protoMessages.gameNotification.BattleStart;

  const payload = { users };
  const packetMessage = BattleStart.create(payload);
  const startPacket = BattleStart.encode(packetMessage).finish();
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);
  const pingPacket = ping.encode(message).finish();
  return makeNotification(pingPacket, PACKET_TYPE.PING);
};

export const createGameSkillPacket = (playerId, x, y, rangeX, rangeY) => {
  const protoMessages = getProtoMessages();
  const skill = protoMessages.skillNotification.SkillUpdate;

  const payload = { playerId, x, y, rangeX, rangeY };
  const message = skill.create(payload);
  const skillPacket = skill.encode(message).finish();
  return makeNotification(skillPacket, PACKET_TYPE.SKILL);
};

export const createAttackedSuccessPacket = (users) => {
  const protoMessages = getProtoMessages();
  const attack = protoMessages.gameNotification.AttackedSuccess;

  const payload = { users };
  const message = attack.create(payload);
  const attackPacket = attack.encode(message).finish();
  return makeNotification(attackPacket, PACKET_TYPE.ATTACK);
};

export const createGameEndPacket = (payload) => {
  const protoMessages = getProtoMessages();
  const gameEnd = protoMessages.gameNotification.MatchResultPayload;

  const message = gameEnd.create(payload);
  const gameEndPacket = gameEnd.encode(message).finish();
  return makeNotification(gameEndPacket, PACKET_TYPE.GAME_END);
};

export const createCreateUserPacket = (payload) => {
  const protoMessages = getProtoMessages();
  const createUser = protoMessages.gameNotification.CreateUser;

  const message = createUser.create(payload);
  const createUserPacket = createUser.encode(message).finish();
  return makeNotification(createUserPacket, PACKET_TYPE.CREATE_USER);
};

export const createRemoveUserPacket = (payload) => {
  const protoMessages = getProtoMessages();
  const removeUser = protoMessages.gameNotification.RemoveUser;

  const message = removeUser.create(payload);
  const removeUserPacket = removeUser.encode(message).finish();
  return makeNotification(removeUserPacket, PACKET_TYPE.REMOVE_USER);
};
