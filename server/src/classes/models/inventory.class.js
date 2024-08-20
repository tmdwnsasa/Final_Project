import {
  findUserInventoryItemsByPlayerId,
    findMoneyByPlayerId,
    findEquippedItemsByPlayerId,
    equipItemtoPlayerId,
    unequipItemfromPlayerId,
  } from '../../db/user/user.db.js';
  import { findItemStats } from '../../db/game/game.db.js';
  
  class Inventory {
    constructor() {
      this.inventoryItems = [];  
      this.equippedItems = [];  
    }
  
    async getAllInventoryItems() {
      {
      this.inventoryItems = await findUserInventoryItemsByPlayerId();
      }
      console.log('Getting all items:', this.inventoryItems);
      return this.inventoryItems;
    }
  
    async getAllEquippedItems() {
      try {
        this.equippedItems = await findEquippedItemsByPlayerId();
      } catch (error) {
        console.error('Failed to get equipped items:', error);
        this.equippedItems = []; 
      }
      console.log('Getting equipped items:', this.equippedItems);
      return this.equippedItems;
    }
  
    // Get character's base stats
    getCharacterStats() {
      const { hp, speed, power, defense, critical } = this.user;
      return {
        hp,
        speed,
        power,
        defense,
        critical,
      };
    }
  
  
  
    async getPlayersMoney() {
      const moneyData = await findMoneyByPlayerId(this.playerId);
      this.money = moneyData ? moneyData.money : 0;
      return this.money;
    }
  }
  
  export default Inventory;
  