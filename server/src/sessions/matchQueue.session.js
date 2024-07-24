import createGameHandler from "../handlers/game/createGame.handler";
import { matchQueueSession } from "./session";
import { getUserBySocket } from "./user.session";

export const addUserinQueue = (socket,data)=>{
    const user = getUserBySocket(socket);
    matchQueueSession.push(user);

    if(matchQueueSession.length>=4){
        const players = matchQueueSession.splice(0,4);

        players.forEach((player)=>{
            createGameHandler({socket:player.socket,userId:player.id,payload:data});
        })
    }
    return user;
};

export const removeUserfromQueue = ()=>{
    const index = matchQueueSession.findIndex((user)=>user.socket ===socket);
    if (index !==-1){
        return matchQueueSession.splice(index,1)[0];
    }
    return null;
};