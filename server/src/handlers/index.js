import { HANDLER_IDS } from '../constants/handlerIds.js';
import { packetNames } from '../protobuf/packetNames.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import giveCharacterHandler from './game/character.handler.js';
import createGame from '../utils/createGame.js';
import joinGameHandler from './game/joinGame.handler.js';
import joinLobbyHandler from './game/joinLobby.handler.js';
import returnLobbyHandler from './game/returnLobby.handler.js';
import matchMakingHandler from './game/matchMaking.handler.js';
import updateSkillHandler from './game/updateAttack.handler.js';
import updateChattingHandler from './game/updateChatting.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import loginHandler from './user/login.handler.js';
import registerHandler from './user/register.handler.js';
import exitGameHandler from './game/exitGame.handler.js';
import { storeHandler } from './game/store.handler.js';
import { purchaseCharacter, purchaseEquipment } from './game/buyObject.handler.js';
import removeSkillHandler from './game/removeSkill.handler.js';
import openMapHandler from './game/openMap.handler.js';
import inventoryHandler from './user/inventory.handler.js';
import equipItemHandler from './game/equipItem.handler.js';
import unequipItemHandler from './game/unequipItem.handler.js';
import matchingCancel from './game/matchingCancel.handler.js';

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
    protoType: packetNames.game.UpdateLocationPayload,
  },
  [HANDLER_IDS.EARN_CHARACTER]: {
    handler: giveCharacterHandler,
    protoType: packetNames.character.GiveCharacterPayload,
  },
  [HANDLER_IDS.CHATTING]: {
    handler: updateChattingHandler,
    protoType: packetNames.ui.ChattingPayload,
  },
  [HANDLER_IDS.RETURN_LOBBY]: {
    handler: returnLobbyHandler,
    protoType: packetNames.game.ReturnLobbyPayload,
  },
  [HANDLER_IDS.MATCHMAKING]: {
    handler: matchMakingHandler,
    protoType: packetNames.game.MatchingPayload,
  },
  [HANDLER_IDS.MATCHINGCANCEL]: {
    handler: matchingCancel,
    protoType: packetNames.game.MatchingPayload,
  },
  [HANDLER_IDS.SKILL]: {
    handler: updateSkillHandler,
    protoType: packetNames.skill.SkillPayload,
  },
  [HANDLER_IDS.SKILLREMOVE]: {
    handler: removeSkillHandler,
    protoType: packetNames.skill.RemoveSkillPayload,
  },
  [HANDLER_IDS.EXIT]: {
    handler: exitGameHandler,
    protoType: packetNames.game.ExitGamePayload,
  },
  [HANDLER_IDS.INVENTORY]: {
    handler: inventoryHandler,
    protoType: packetNames.user.InventoryPayload,
  },
  [HANDLER_IDS.EQUIP_ITEM]: {
    handler: equipItemHandler,
    protoType: packetNames.game.EquipItemPayload,
  },
  [HANDLER_IDS.UNEQUIP_ITEM]: {
    handler: unequipItemHandler,
    protoType: packetNames.game.UnequipItemPayload,
  },
  [HANDLER_IDS.STORE]: {
    handler: storeHandler,
    protoType: packetNames.ui.StorePayload,
  },
  [HANDLER_IDS.PURCHASE_CHARACTER]: {
    handler: purchaseCharacter,
    protoType: packetNames.character.PurchaseCharacterPayload,
  },
  [HANDLER_IDS.PURCHASE_EQUIPMENT]: {
    handler: purchaseEquipment,
    protoType: packetNames.game.PurchaseEquipmentPayload,
  },
  [HANDLER_IDS.OPEN_MAP]: {
    handler: openMapHandler,
    protoType: packetNames.ui.MapPayload,
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
