import {
  findUserInventoryItemsByPlayerId,
    findMoneyByPlayerId,
    findEquippedItemsByPlayerId,
    equipItem,
    unequipItem,
  } from '../../db/user/user.db.js';
  import { findItemStats } from '../../db/game/game.db.js';
  
  class Inventory {
    constructor() {
      this.inventoryItems = [];  
      this.equippedItems = [];  
    }
  
    async getAllInventoryItems() {
      if (this.items.length === 0) {
        this.items = await findUserInventoryItemsByPlayerId(this.playerId);
      }
      console.log('Getting all items:', this.items);
      return this.items;
    }
  
    async getAllEquippedItems() {
      try {
        this.equippedItems = await findEquippedItemsByPlayerId(this.playerId);
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
    
    
    async getItemStats(){
      allItemStats= await findItemStats()
    }
    
    async getEquippedItemStats(){
        let itemStats = [];
        itemStats = await findItemStats();
        console.log('----------',itemStats);

        const equippedItems = await this.getEquippedItems();
        const equippedItemIds = equippedItems.map(item=> item.itemId);
        const equippedItemStats = itemStats.filter(itemStat => equippedItemIds.includes(itemStat.itemId));


        console.log('Equipped Item Stats:', equippedItemStats);

        return equippedItemStats;
    }
  

    async getCombinedStats() {
        const characterStats = this.getCharacterStats();
        const equippedItemStats = await this.getEquippedItemStats();
        const combinedStats = { ...characterStats };
      
          equippedItemStats.forEach(itemStat=> {
            combinedStats.hp += itemStat.itemHp || 0;
            combinedStats.speed += itemStat.itemSpeed || 0;
            combinedStats.power += itemStat.itemAttack || 0;
          })
  
        return combinedStats;
      }
  
      async equipItem(itemId, slotId) {
        const item = this.items.find((item) => item.itemId === itemId);
        if (item) {
            await equipItem(this.playerId, itemId, slotId);
            this.equippedItems.push({ ...item, slotId }); // Store the item with its slotId

            const updatedStats = await this.getCombinedStats();
            return updatedStats;
        }
    }

    async unequipItem(itemId) {
        const itemIndex = this.equippedItems.findIndex((item) => item.itemId === itemId);
        if (itemIndex !== -1) {
            const slotId = this.equippedItems[itemIndex].slotId;
            await unequipItem(this.playerId, itemId, slotId);
            this.equippedItems.splice(itemIndex, 1);

            const updatedStats = await this.getCombinedStats();
            return updatedStats;
        }
    }
  
    async getPlayersMoney() {
      const moneyData = await findMoneyByPlayerId(this.playerId);
      this.money = moneyData ? moneyData.money : 0;
      return this.money;
    }
  }
  
  export default Inventory;
  