import { handlerError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSessionByPlayerId } from '../../sessions/game.session.js';
import { characterSkillAssets } from '../../assets/characterskill.asset.js';

const updateSkillHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y, isDirectionX, skill_Id, timestamp } = payload;
    const gameSession = getGameSessionByPlayerId(userId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }
    const skill = characterSkillAssets[skill_Id - 1];
    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다');
    }

    if (skill_Id % 2 == 0) {
      if (user.lastSkillX != 0 && user.lastSkillX.low + skill.cool_time * 1000 > timestamp.low) {
        throw new CustomError(ErrorCodes.MISMATCH_COOLTIME, '쿨타임이 아직 지나지 않았습니다.');
      }
      user.lastSkillX = timestamp;
    } else {
      if (user.lastSkillZ != 0 && user.lastSkillZ.low + skill.cool_time * 1000 > timestamp.low) {
        throw new CustomError(ErrorCodes.MISMATCH_COOLTIME, '쿨타임이 아직 지나지 않았습니다.');
      }
      user.lastSkillZ = timestamp;
    }
    const skillType = skill.skill_type;
    let rangeX;
    let rangeY;
    switch (skillType) {
      case 1:
        if (isDirectionX) {
          rangeX = skill.range_x;
          rangeY = skill.range_y;
        } else {
          rangeX = skill.range_y;
          rangeY = skill.range_x;
        }
        gameSession.updateAttack(user.name, x, y, rangeX, rangeY);

        const startX = user.x + x - rangeX / 2;
        const startY = user.y + y + rangeY / 2;
        const endX = startX + rangeX;
        const endY = startY - rangeY;

        //Latency를 이용한 스킬 판정에 핑 차이 적용
        const maxLatency = gameSession.getMaxLatency();
        setTimeout(() => {
          gameSession.sendAttackedOpposingTeam(user, startX, startY, endX, endY);
        }, maxLatency);
        break;
      case 2:
        break;

      default:
        break;
    }
  } catch (error) {
    handlerError(socket, error);
  }
};

export default updateSkillHandler;
