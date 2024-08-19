import { mapAssets } from '../assets/map.asset.js';
import { changingOwner } from '../db/map/map.db.js';

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

const changeDisputedArea = async (row, column, team) => {
  const map = mapAssets[row][column];
  if (map.isDisputedArea === 0 && map.ownedBy !== team) {
    map.isDisputedArea = 1;
    map.ownedBy = null;
    map.countBlueWin = 0;
    map.countRedWin = 0;
    await changingOwner(true, null, map.mapId);
  }
};

export const changingOwnerOfMap = async (map) => {
  // red 승리가 많을 경우
  if (map.countRedWin - map.countBlueWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'blue';
    map.countBlueWin = 0;
    map.countRedWin = 0;
    await changingOwner(false, 'blue', map.mapId);
    checkAroundMap(map.mapId, 'blue');
  }
  
  // blue 승리가 많을 경우
  if (map.countBlueWin - map.countRedWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'green';
    map.countBlueWin = 0;
    map.countRedWin = 0;
    await changingOwner(false, 'green', map.mapId);
    checkAroundMap(map.mapId, 'green');
  }
};
