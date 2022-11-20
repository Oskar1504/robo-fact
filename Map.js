class GameMap{
    

    renderMap(game){
        const ctx = game.game.render.root.getContext("2d")
        const size = game.game.render.size
        const fieldSize = game.game.render.fieldSize
        const buffer = fieldSize / 5

        

        //reset mainFrame
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, game.game.render.frameSizeX, game.game.render.frameSizeY);

        let playerPos = game.getPos()
        let xStart = playerPos.x - (size/2)
        let yStart = playerPos.y - (size/2)

        let mapObjects = game.game.map.objects

        //draw game grid
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                
                let x = i + xStart
                let y = j + yStart

                // draw grid
                ctx.fillStyle = "#000000"
                ctx.strokeRect(fieldSize * i, fieldSize * j, fieldSize, fieldSize);
                let img = document.getElementById("grass_block_top")
                ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)

                //get mapObject
                // sort so high prio ressources spawn on top
                mapObjects.sort((a,b) => a.order - b.order).forEach(obj => {
                    if(obj.isInPos(x,y)){
                        let img = document.getElementById(obj.type)
                        ctx.drawImage(img, fieldSize * i  , fieldSize * j, fieldSize, fieldSize)
                    }
                })
                // draw player 
                if(i == size/2 && j == size/2){

                    ctx.fillStyle = "#0F0"
                    ctx.fillRect(fieldSize * i, fieldSize * j, fieldSize, fieldSize);
                }
                
            }
        }
    }
}