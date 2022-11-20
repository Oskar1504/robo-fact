class GameMap{
    

    renderMap(game){
        const ctx = game.game.render.root.getContext("2d")
        const sizeX = game.game.render.sizeX
        const sizeY = game.game.render.sizeY
        const fieldSize = game.game.render.fieldSize
        const buffer = fieldSize / 5

        
 
        //reset mainFrame
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, game.game.render.frameSizeX, game.game.render.frameSizeY);

        let playerPos = game.getPos()
        let xStart = playerPos.x - Math.floor((sizeX/2))
        let yStart = playerPos.y - Math.floor((sizeY/2))

        let mapObjects = game.game.map.objects
        let solidMapObjects = game.game.map.solidObjects
        let npcs = game.game.map.npcs
        let objects = [mapObjects, solidMapObjects, npcs]

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

                //get mapObjects
                // sort so high prio ressources spawn on top
                objects.forEach(mapObjects => {
                    mapObjects.sort((a,b) => a.order - b.order).forEach(obj => {
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
                })



                // draw player 
                if(i == Math.floor(sizeX/2) && j == Math.floor(sizeY/2)){

                    ctx.fillStyle = "#0F0"
                    ctx.fillRect(fieldSize * i + buffer, fieldSize * j + buffer, fieldSize - buffer * 2, fieldSize - buffer * 2);
                }
                
            }
        }
    }
}