export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  character: {
    GiveCharacterPayload: 'character.GiveCharacterPayload',
    PurchaseCharacterPayload: 'character.PurchaseCharacterPayload',
  },
  user: {
    RegisterPayload: 'user.RegisterPayload',
    LoginPayload: 'user.LoginPayload',
    InventoryPayload: 'user.InventoryPayload',
  },
  game: {
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    JoinLobbyPayload: 'game.JoinLobbyPayload',
    LocationUpdatePayload: 'game.LocationUpdatePayload',
    ReturnLobbyPayload: 'game.ReturnLobbyPayload',
    MatchingPayload: 'game.MatchingPayload',
    ExitGamePayload: 'game.ExitGamePayload',
    EquipItemPayload: 'game.EquipItemPayload',
    UnequipItemPayload: 'game.UnequipItemPayload',
  },
  ui: {
    ChattingPayload: 'ui.ChattingPayload',
    StorePayload: 'ui.StorePayload',
  },
  skill: {
    nearAttackPayload: 'skill.nearAttackPayload',
  },
  response: {
    Response: 'response.Response',
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
    BattleStart: 'gameNotification.BattleStart',
    MatchMakingComplete: 'gameNotification.MatchMakingComplete',
    MatchResultPayload: 'gameNotification.MatchResultPayload',
    AttackedSuccess: 'gameNotification.AttackedSuccess',
  },
  uiNotification: {
    ChattingUpdate: 'uiNotification.ChattingUpdate',
  },
  skillNotification: {
    SkillUpdate: 'skillNotification.SkillUpdate',
  },
};
