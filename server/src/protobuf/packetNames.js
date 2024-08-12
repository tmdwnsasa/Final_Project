export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  character: {
    GiveCharacterPayload: 'character.GiveCharacterPayload',
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
  },
  ui: {
    ChattingPayload: 'ui.ChattingPayload',
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
