import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { findMapData } from '../../db/map/map.db.js';
import { createResponse } from '../../utils/response/createResponse.js';

const openMapHandler = async ({ socket, userId, payload }) => {
  const maps = await findMapData();
  const mapData = [];
  maps.forEach((map) => {
    const data = { mapName: map.mapName, isDisputedArea: map.isDisputedArea, ownedBy: map.ownedBy };
    mapData.push(data);
  });

  const packet = createResponse(HANDLER_IDS.OPEN_MAP, RESPONSE_SUCCESS_CODE, { mapData }, userId);
  socket.write(packet);
};

export default openMapHandler;
