import apiRequest from "../../db/apiRequest.js";
import ENDPOINTS from "../../db/endPoint.js";

class Map {
  constructor(mapId, mapName, isDisputedArea, ownedBy, countBlueWin, countGreenWin, count) {
    this.mapId = mapId;
    this.mapName = mapName;
    this.isDisputedArea = isDisputedArea;
    this.ownedBy = ownedBy;
    this.countGreenWin = countGreenWin;
    this.countBlueWin = countBlueWin;
    this.count = count;
  }

  async setCount() {
    const countOfUsers = await apiRequest(ENDPOINTS.user.countOfUsers, {});
    let count = countOfUsers.count1;
    if (count % 10 === 0) {
      count = Math.floor(count / 10) + 1;
    } else {
      count = Math.floor(count / 10);
    }
    this.count = count;
  }
}

export default Map;
