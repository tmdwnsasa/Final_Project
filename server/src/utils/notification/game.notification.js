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

export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = Start.create(payload);
  const startPacket = Start.encode(message).finish();
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
  const skill = protoMessages.skillNotification.skillUpdate;

  const payload = { playerId, x, y, rangeX, rangeY };
  const message = skill.create(payload);
  const skillPacket = skill.encode(message).finish();
  return makeNotification(skillPacket, PACKET_TYPE.SKILL);
};

export const createGameEndPacket = (data) => {
  const protoMessages = getProtoMessages();
  const gameEnd = protoMessages; //.추가;

  const payload = { data };
  const message = gameEnd.create(payload);
  const gameEndPacket = gameEnd.encode(message).finish();
  return makeNotification(gameEndPacket, PACKET_TYPE.GAME_END);
};
