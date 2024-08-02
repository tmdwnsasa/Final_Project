// import pools from '../db/database.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
import { addUserToQueue,getQueueLength,getUsersForGame } from '../sessions/matchQueue.session.js'; 
import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../sessions/user.session.js'; 
import createGameHandler from '../handlers/game/createGame.handler.js';

// class MockSocket {
//   constructor(id) {
//     this.id = id;
//   }
  
//   write(data) {
//     // console.log(`Data sent to socket ${this.id}:`);
//   }
  
// }

const initServer = async () => {
  try {
    // await loadGameAssets();
    await loadProtos();
    // await testAllConnections(pools);
    createLobbySession(); 
    

    // // Add mock users to the queue
    // const mockSockets = [];
    // const sessionIds = []; // Track session IDs for validation

    // for (let i = 0; i < 4; i++) {
    //   const socket = new MockSocket(uuidv4());
    //   mockSockets.push(socket);
    //   const sessionId = uuidv4(); // Generate a unique session ID for each user
    //   sessionIds.push(sessionId);
    //   addUser(socket.id, null, `user${i}`, socket, sessionId);
    //   addUserToQueue(socket);
    // }

    // console.log("Finished adding users to the queue.");
    // console.log(`Queue length: ${getQueueLength()}`);

    // // Simulate matchmaking
    // if (getQueueLength() >= 4) {
    //   const players = getUsersForGame();
    //   console.log(`Matchmaking completed. Players: ${players.map(player => player.playerId).join(', ')}`);
      
    //   const redTeam = players.slice(0, 2);
    //   const blueTeam = players.slice(2, 4);

    //   createGameHandler({
    //     redTeam: redTeam.map(player => ({ socket: player.socket, id: player.playerId })),
    //     blueTeam: blueTeam.map(player => ({ socket: player.socket, id: player.playerId })),
    //     payload: { sessionId: sessionIds[0] }, // You might need to pass the session ID for the test case
    //   });
    // }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
