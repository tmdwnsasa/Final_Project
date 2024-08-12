import { findMoneyByPlayerId, findEquippedItemsByPlayerId, equipItem, unequipItem } from '../../db/user/user.db.js';
import { characterAssets } from '../../assets/character.asset.js'; 

class Inventory {
    constructor(user) {
        this.user = user;
        this.playerId = user.playerId;
        this.characterId = user.characterId;
        this.money = 0;
        this.items = []; 
        this.equippedItems = {};
    }

    async loadItems() {
        this.items = await findItemsByPlayerId(this.playerId);
        return this.items;
    }

    async loadEquippedItems() {
        const equippedItems = await findEquippedItemsByPlayerId(this.playerId);
        if (equippedItems) {
            equippedItems.forEach(item => {
                this.equippedItems[item.slot] = item;
            });
        }
        return this.equippedItems;
    }

    async getAllItems() {
        if (this.items === null) {
            await this.loadItems();
        }
        return this.items;
    }

    async getEquippedItems() {
        if (Object.keys(this.equippedItems).length === 0) {
            await this.loadEquippedItems();
        }
        return this.equippedItems;
    }

    getCharacterStats() {
        const character = characterAssets[this.characterId];
        const characterStats = {
            hp: character.hp,
            speed: character.speed,
            power: character.power,
            defense: character.defense,
            critical: character.critical,
        };
        return characterStats;
    }

    async getCombinedStats() {
        const characterStats = this.getCharacterStats();
        const equippedItems = await this.getEquippedItems();
        const combinedStats = { ...characterStats };

        Object.values(equippedItems).forEach(item => {
            if (item.type === 'equipment') {
                combinedStats.hp += item.hpBoost || 0;
                combinedStats.speed += item.speedBoost || 0;
                combinedStats.power += item.powerBoost || 0;
                combinedStats.defense += item.defenseBoost || 0;
                combinedStats.critical += item.criticalBoost || 0;
            }
        });

        return combinedStats;
    }

    async equipItem(itemId) {
        const item = this.items.find(item => item.item_id === itemId);
        if (item && item.type === 'equipment') {
            const slot = item.slot;
            await equipItem(this.playerId, itemId, slot);
            this.equippedItems[slot] = item;
        }
    }

    async unequipItem(slot) {
        if (this.equippedItems[slot]) {
            await unequipItem(this.playerId, slot);
            delete this.equippedItems[slot];
        }
    }

    async getPlayersMoney() {
        const moneyData = await findMoneyByPlayerId(this.playerId);
        this.money = moneyData ? moneyData.money : 0;
        return this.money;
    }
}

export default Inventory;
