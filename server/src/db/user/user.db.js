import { toCamelCase } from "../../utils/transformCase.js"
import pools from "../database.js"
import { SQL_QUERIES } from "./user.queries.js"

export const findUserByPlayerId = async (player_id) => {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [player_id])
    return toCamelCase(rows[0]);
}

export const createUser = async (player_id, pw, name) => {
    await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [player_id, pw, name])
    return {player_id, pw, name};
}

export const updateUserLogin = async (player_id) => {
    await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [player_id])
}

export const findMoneyByPlayerId = async (player_id) => {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_MONEY_BY_PLAYER_ID, [player_id])
    return toCamelCase(rows[0]);
}
