// import pools from '../db/database.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { createLobbySession } from '../sessions/lobby.session.js';
// import { addUserinQueue } from '../sessions/matchQueue.session.js'; 
// import { v4 as uuid } from 'uuid'; 
// import { addUser } from '../sessions/user.session.js'; 

// class MockSocket {
//   constructor(id) {
//     this.id = id;
//   }
  
//   write(data) {
//     console.log(`Data sent to socket ${this.id}:`, data);
//   }
  
// }

const initServer = async () => {
  try {
    // await loadGameAssets();
    await loadProtos();
    // await testAllConnections(pools);
    createLobbySession(); 
    

    // //매칭큐 들어가는지 testing
    // for (let i = 0; i < 7; i++) {
    //   const socket = new MockSocket(uuid()); 
    //   const user = addUser(socket.id, 'characterId', 'frame', socket); // user testing
    //   addUserinQueue(socket, { data: 'testing' });
    // }

    // console.log("Finished adding users to the queue.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
