class Map {
  constructor(mapId, mapName, isDisputedArea, ownedBy) {
    this.mapId = mapId;
    this.mapName = mapName;
    this.isDisputedArea = isDisputedArea;
    this.ownedBy = ownedBy;
    this.countRedWin = 0;
    this.countBlueWin = 0;
  }
}

export default Map;
