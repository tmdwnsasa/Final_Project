import pools from "../database.js"
import { MAP_SQL_QUERIES } from "./map.queries.js"

export const insertMap = async (map_name, is_disputed_area, owned_by) => {
    await pools.MAP_DB.query(MAP_SQL_QUERIES.INSERT_MAP, [map_name, is_disputed_area, owned_by])
}