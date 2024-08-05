import { HANDLER_IDS } from '../constants/handlerIds.js';
import { packetNames } from '../protobuf/packetNames.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import giveCharacterHandler from './game/character.handler.js';
import createGame from '../utils/createGame.js';
import joinGameHandler from './game/joinGame.handler.js';
import joinLobbyHandler from './game/joinLobby.handler.js';
import updateSkillHandler from './game/updateAttack.handler.js';
import { returnLobbyHandler } from './game/returnLobby.handler.js';
import matchMakingHandler from './game/matchMaking.handler.js';
import updateSkillHandler from './game/updateAttack.handler.js';
import updateChattingHandler from './game/updateChatting.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import loginHandler from './user/login.handler.js';
import registerHandler from './user/register.handler.js';

const handlers = {
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: packetNames.user.RegisterPayload,
  },
  [HANDLER_IDS.LOGIN]: {
    handler: loginHandler,
    protoType: packetNames.user.LoginPayload,
  },
  [HANDLER_IDS.CREATE_GAME]: {
    handler: createGame,
    protoType: packetNames.game.CreateGamePayload,
  },
  [HANDLER_IDS.JOIN_GAME]: {
    handler: joinGameHandler,
    protoType: packetNames.game.JoinGamePayload,
  },
  [HANDLER_IDS.JOIN_LOBBY]: {
    handler: joinLobbyHandler,
    protoType: packetNames.game.JoinLobbyPayload,
  },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,
    protoType: packetNames.game.LocationUpdatePayload,
  },
  [HANDLER_IDS.EARN_CHARACTER]: {
    handler: giveCharacterHandler,
    protoType: packetNames.character.GiveCharacterPayload,
  },
  [HANDLER_IDS.CHATTING]: {
    handler: updateChattingHandler,
    protoType: 'ui.ChattingPayload',
  },
  [HANDLER_IDS.RETURN_LOBBY]: {
    handler: returnLobbyHandler,
    protoType: packetNames.game.ReturnLobbyPayload,
  },

  [HANDLER_IDS.MATCHMAKING]: {
    handler: matchMakingHandler,
    protoType: packetNames.game.MatchingPayload,
  },

  [HANDLER_IDS.SKILL]: {
    handler: updateSkillHandler,
    protoType: packetNames.skill.nearAttackPayload,
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `프로토타입을 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].protoType;
};
