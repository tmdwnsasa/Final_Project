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
    UpdateLocationPayload: 'game.UpdateLocationPayload',
    ReturnLobbyPayload: 'game.ReturnLobbyPayload',
    MatchingPayload: 'game.MatchingPayload',
    ExitGamePayload: 'game.ExitGamePayload',
    EquipItemPayload: 'game.EquipItemPayload',
    UnequipItemPayload: 'game.UnequipItemPayload',
    PurchaseEquipmentPayload: 'game.PurchaseEquipmentPayload',
  },
  ui: {
    ChattingPayload: 'ui.ChattingPayload',
    StorePayload: 'ui.StorePayload',
    MapPayload: 'ui.MapPayload',
  },
  skill: {
    SkillPayload: 'skill.SkillPayload',
    RemoveSkillPayload: 'skill.RemoveSkillPayload',
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
    CreateUser: 'gameNotification.CreateUser',
    RemoveUser: 'gameNotification.RemoveUser',
  },
  uiNotification: {
    ChattingUpdate: 'uiNotification.ChattingUpdate',
  },
  skillNotification: {
    SkillUpdate: 'skillNotification.SkillUpdate',
  },
};
