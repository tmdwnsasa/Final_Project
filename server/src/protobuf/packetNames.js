export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  initial: {
    InitialPayload: 'initial.InitialPayload',
  },
  user: {
    RegisterPayload: 'user.RegisterPayload',
    LoginPayload: 'user.LoginPayload',
  },
  game: {
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    LocationUpdatePayload: 'game.LocationUpdatePayload',
  },
  ui: {
    ChattingPayload: 'ui.ChattingPayload',
  },
  response: {
    Response: 'response.Response',
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
    MatchResultPayload: 'gameNotification.MatchResultPayload',
  },
  uiNotification: {
    ChattingUpdate: 'uiNotification.ChattingUpdate',
  },
};
