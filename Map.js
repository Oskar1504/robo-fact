class GameMap{
    
    mapObjects = {
        objects:[],
        npcs:[],
        solidObjects:[]
    }

    config = {
        mapObjectLoadSize: 15
    }

    renderMap(game){
        if(game != undefined){
            this.game = game
        }

        const ctx = this.game.game.render.root.getContext("2d")
        const sizeX = this.game.game.render.sizeX
        const sizeY = this.game.game.render.sizeY
        const fieldSize = this.game.game.render.fieldSize
        const buffer = fieldSize / 5

        //TODO IDEA ressource nodes could be respawnable
        //delete all empty mapObjects
        this.mapObjects.objects = this.mapObjects.objects.filter(elm => elm.amount > 0)
        
 
        //reset mainFrame
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.game.game.render.frameSizeX, this.game.game.render.frameSizeY);

        const playerPos = this.game.getPos()
        let xStart = playerPos.x - Math.floor((sizeX/2))
        let yStart = playerPos.y - Math.floor((sizeY/2))
        
        let objects = Object.values(this.getMapObjects(playerPos))
        
        //draw game grid
        for(let i = 0; i < sizeX; i++){
            for(let j = 0; j < sizeY; j++){
                
                let x = i + xStart
                let y = j + yStart

                // draw grid
                ctx.fillStyle = "#000000"
                ctx.strokeRect(fieldSize * i, fieldSize * j, fieldSize, fieldSize);
                let img = images.get("grass_block_top")
                ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)

                // ctx.font = "15px Arial";
                // ctx.fillText(`${i}_${j}`, fieldSize * i, fieldSize * j - 20)
                // ctx.fillText(`${x}_${y}`, fieldSize * i, fieldSize * j)

                //get mapObjects
                // sort so high prio ressources spawn on top
                objects.forEach(mapObjects => {
                    mapObjects.sort((a,b) => a.order - b.order).forEach(obj => {
                        if(obj.mapObjects == undefined){

                            if(obj.isInPos(new Position(x,y))){
                                if(obj.texture){
                                    let img = images.get(obj.texture)
                                    ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)
                                }else{
                                    let img = images.get(obj.type)
                                    ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)
                                }
                            }
                        }else{
                            obj.mapObjects.forEach(obj => {
                                if(obj.isInPos(new Position(x,y))){
                                    if(obj.texture){
                                        let img = images.get(obj.texture)
                                        ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)
                                    }else{
                                        let img = images.get(obj.type)
                                        ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)
                                    }
                                }
                            })
                            
                        }
                    })
                })



                // draw player 
                // if(i == Math.floor(sizeX/2) && j == Math.floor(sizeY/2)){

                //     ctx.fillStyle = "#0F0"
                //     ctx.fillRect(fieldSize * i + buffer, fieldSize * j + buffer, fieldSize - buffer * 2, fieldSize - buffer * 2);
                // }
                if(x == playerPos.x && y == playerPos.y){

                    ctx.fillStyle = "#0F0"
                    ctx.fillRect(fieldSize * i + buffer, fieldSize * j + buffer, fieldSize - buffer * 2, fieldSize - buffer * 2);
                }
                
            }
        }
    }

    /**
     * input position and get all mapobjects in an area around player
     *
     * 
     * @param {Position} position
     * @param {Array<string>} objectType
     * @memberof GameMap
     */
    getMapObjects(position, objectType = []){
        position = new Position(position.x, position.y)

        if(objectType.length == 0){
            objectType = Object.keys(this.mapObjects)
        }

        let o = {}

        objectType.forEach(key => {
            o[key] = []
            this.mapObjects[key].forEach(mapObject => {
                if(mapObject.isInArea(position, this.config.mapObjectLoadSize)){
                    o[key].push(mapObject)
                }
            })
        })

        Object.keys(o).forEach(key => {
            if(o[key].length == 0){
                delete o[key]
            }
        })

        return o

    }

    
    addNPC(npc){
        this.mapObjects.npcs.push(npc)
        this.renderMap()
    }

    /**
     *
     *
     * @param {MapObjectSolidRect} object
     * @memberof GameMap
     */
    addSolidBuilding(object){
        this.mapObjects.solidObjects.push(object)
    }
}