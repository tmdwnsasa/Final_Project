const changeDisputedArea = (mapId) => {};

export const changingOwnerOfMap = (map) => {
  // red 승리가 많을 경우
  if (map.countRedWin - map.countBlueWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'red';
    map.countBlueWin = 0;
    map.countRedWin = 0;
  }

  // blue 승리가 많을 경우
  if (map.countBlueWin - map.countRedWin >= 2) {
    map.isDisputedArea = 0;
    map.ownedBy = 'blue';
    map.countBlueWin = 0;
    map.countRedWin = 0;
  }
};
