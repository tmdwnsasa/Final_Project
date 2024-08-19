class Map {
  constructor(mapId, mapName, isDisputedArea, ownedBy, countBlueWin, countGreenWin) {
    this.mapId = mapId;
    this.mapName = mapName;
    this.isDisputedArea = isDisputedArea;
    this.ownedBy = ownedBy;
    this.countGreenWin = countGreenWin;
    this.countBlueWin = countBlueWin;
  }
}

export default Map;
