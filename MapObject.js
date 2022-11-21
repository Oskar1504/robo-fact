class MapObject {
    /**
     * Creates an instance of MapObject.
     * @param {string} texture
     * @param {Position} position
     * @param {LootTable} lootTable
     * @memberof MapObject
     */
    constructor(texture, position, lootTable){
        this.texture = texture
        this.position = position
        this.lootTable = lootTable
        this.amount = 1000
        this.restockTimer = 20
        this.restockTimerCount = 1
    }

    isInPos(pos){
        return this.position.x == pos.x && this.position.y == pos.y
    }

    
    isInArea(position, size){

        //I LOVE MATH
        //german guide for equation https://de.serlo.org/mathe/1783/abstand-zweier-punkte-berechnen
        return Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2)) <= size
    }

    inspect(){
        return JSON.stringify({
            texture: this.texture,
            amount: this.amount
        })
    }

    tick(){
        //chance gets higher with each try
        let chance = this.restockTimerCount / this.restockTimer
        if(Math.random() <= chance || chance >= 1){
            this.restockTimerCount = 1
            this.amount += 1
        }else{
            this.restockTimerCount ++
        }
    }

    

    //TODO
    harvest(){
        
    }
}

class Plant extends MapObject{
    constructor(texture, position, lootTable, maxGrowState){
        super(texture, position, lootTable)
        this.growState = 1
        this.maxGrowState = maxGrowState
        this.harvestable = false

        this.amount = 1

    }


    tick(){
        if(this.growState <= this.maxGrowState){
            this.growState ++
        }else if(!this.harvestable){
            this.harvestable = true
            this.texture = this.texture + "_harvestable"
            window.dispatchEvent(window.customEvents.renderMap)
        }
    }

    //TODO
    harvest(){

    }
}