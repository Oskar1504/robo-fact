class LootTable{
    constructor(object){
        Object.assign(this, object);
    }

    roll(){
        let o = []
        this.rolls.forEach(entry => {
            if(Math.random() >= entry.chance || entry.chance == 1){
                for(let i = 0; i < entry.amount; i++){
                    o.push(entry.item)
                }
            }
        });
        return o
    }
}