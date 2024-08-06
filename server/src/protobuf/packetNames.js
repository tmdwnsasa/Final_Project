export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  character: {
    GiveCharacterPayload: 'character.GiveCharacterPayload',
    BuyCharacterPayload: 'character,BuyCharacterPayload',
  },
  user: {
    RegisterPayload: 'user.RegisterPayload',
    LoginPayload: 'user.LoginPayload',
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
  response: {
    Response: 'response.Response',
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
    BattleStart: 'gameNotification.BattleStart',
    MatchMakingComplete: 'gameNotification.MatchMakingComplete',
    MatchResultPayload: 'gameNotification.MatchResultPayload',
  },
  uiNotification: {
    ChattingUpdate: 'uiNotification.ChattingUpdate',
  },
};
