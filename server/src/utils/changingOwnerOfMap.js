import { mapAssets } from '../assets/map.asset.js';

const checkAroundMap = (mapId, team) => {
  let changedMapRow = 0;
  let changedMapColumn = 0;
  mapAssets.find((row, rowIndex) => {
    row.find((map, index) => {
      if (map.mapId === mapId) {
        changedMapRow = rowIndex;
        changedMapColumn = index;
      }
    });
  });
  changeDisputedArea(changedMapRow, changedMapColumn - 1, team);
  changeDisputedArea(changedMapRow, changedMapColumn + 1, team);
  changeDisputedArea(changedMapRow - 1, changedMapColumn, team);
  changeDisputedArea(changedMapRow + 1, changedMapColumn, team);
};

const changeDisputedArea = (row, column, team) => {
  const map = mapAssets[row][column];
  if (map.isDisputedArea === 0 && map.ownedBy !== team) {
    map.isDisputedArea = 1;
    map.ownedBy = null;
    map.countBlueWin = 0;
    map.countGreenWin = 0;
  }
};

export const changingOwnerOfMap = (map) => {
  // green 승리가 많을 경우
  if (map.countGreenWin - map.countBlueWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'green';
    map.countBlueWin = 0;
    map.countGreenWin = 0;
    checkAroundMap(map.mapId, 'green');
  }

  // blue 승리가 많을 경우
  if (map.countBlueWin - map.countGreenWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'blue';
    map.countBlueWin = 0;
    map.countGreenWin = 0;
    checkAroundMap(map.mapId, 'blue');
  }
};
