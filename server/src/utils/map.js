import { mapAssets } from '../assets/map.asset.js';
import { changingOwner } from '../db/map/map.db.js';

const checkAroundMap = (mapId, team) => {
  const { changedMapRow, changedMapColumn } = returnRowAndColumn(mapId);
  changeDisputedArea(changedMapRow, changedMapColumn - 1, team);
  changeDisputedArea(changedMapRow, changedMapColumn + 1, team);
  changeDisputedArea(changedMapRow - 1, changedMapColumn, team);
  changeDisputedArea(changedMapRow + 1, changedMapColumn, team);
  checkAllDisputedArea();
};

const changeDisputedArea = async (row, column, team) => {
  const map = mapAssets[row][column];
  if (map && map.isDisputedArea === 0 && map.ownedBy !== team) {
    map.isDisputedArea = 1;
    map.ownedBy = null;
    map.countBlueWin = 0;
    map.countGreenWin = 0;
    await changingOwner(true, null, map.mapId);
    map.setCount();
  }
};

const returnRowAndColumn = (mapId) => {
  let changedMapRow = 0;
  let changedMapColumn = 0;
  mapAssets.find((row, rowIndex) => {
    row.find((map, index) => {
      if (map.mapId === mapId) {
        changedMapRow = rowIndex;
        changedMapColumn = index;
        return true;
      }
    });
  });
  return { changedMapRow, changedMapColumn };
};

const checkAllDisputedArea = async () => {
  const disputedArea = [];
  mapAssets.forEach((row) =>
    row.forEach((map) => {
      if (map.isDisputedArea === 1) {
        disputedArea.push(map.mapId);
      }
    }),
  );

  disputedArea.forEach(async (mapId) => {
    const { changedMapRow, changedMapColumn } = returnRowAndColumn(mapId);
    const guildCount = { green: 0, blue: 0, null: 0 };
    const map = mapAssets[changedMapRow][changedMapColumn];
    const upMap = mapAssets[changedMapRow - 1][changedMapColumn];
    const downMap = mapAssets[changedMapRow + 1][changedMapColumn];
    const leftMap = mapAssets[changedMapRow][changedMapColumn + 1];
    const rightMap = mapAssets[changedMapRow][changedMapColumn - 1];

    if (upMap) {
      guildCount[String(upMap.ownedBy)]++;
    }
    if (downMap) {
      guildCount[String(downMap.ownedBy)]++;
    }
    if (leftMap) {
      guildCount[String(leftMap.ownedBy)]++;
    }
    if (rightMap) {
      guildCount[String(rightMap.ownedBy)]++;
    }

    if (guildCount.green === 0) {
      map.team = 'blue';
      map.isDisputedArea = 0;
      map.countBlueWin = 0;
      map.countGreenWin = 0;
      await changingOwner(false, 'blue', mapId);
    } else if (guildCount.blue === 0) {
      map.team = 'green';
      map.isDisputedArea = 0;
      map.countBlueWin = 0;
      map.countGreenWin = 0;
      await changingOwner(false, 'green', mapId);
    }
  });
};

export const changingOwnerOfMap = async (map) => {
  if (map.countBlueWin === Math.ceil(map.count / 2)) {
    map.isDisputedArea = 0;
    map.countBlueWin = 0;
    map.countGreenWin = 0;
    map.ownedBy = 'blue';
    await changingOwner(false, 'blue', map.mapId);
    checkAroundMap(map.mapId, 'blue');
  }
  
  if (map.countGreenWin === Math.ceil(map.count / 2)) {
    map.isDisputedArea = 0;
    map.countBlueWin = 0;
    map.countGreenWin = 0;
    map.ownedBy = 'green';
    await changingOwner(false, 'green', map.mapId);
    checkAroundMap(map.mapId, 'green');
  }
};
