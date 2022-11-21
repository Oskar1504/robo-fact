class Player{
    //could be used to exclude player logic from game class
}


class Game{
    #privateAttribute = "private"
    #_player = {
        posX:0,
        posY:0,
        state: "default",
        storage:this.#getPlayerStorage()
    };
    
    publicAttribute = "public"

    game = {
        debugMode:true,
        render: {
            root: document.getElementById("mainFrame"),
            sizeX:10,
            sizeY:10,
            frameSizeX: 600,
            frameSizeY: 600,
            fieldSize:50
        },
        code: {
            forceBreak: false
        }
    }


    constructor(size=10) {
        this.game.render.size = size
        /** @type GameMap */
        this.gameMap = new GameMap()

        //adjust size
        this.resizeRenderCanvas()

        // this.generateObjects()
        // this.generateSolidObjects()
        this.#renderStorage()

        this.#createEventListener()

        this.dataLoader = []
    }

    async afterInit(){
        this.dataLoader = await fetch("./data/include.json").then(r => r.json()).then(d => {
            return d
        })

        await this.loadGameDataFiles()

        
        this.#createGameLoop()
    }

    async loadGameDataFiles(){
       this.dataLoader.forEach(async folder => {
            let buildings = await fetch(`./data/${folder}/Buildings.json`).then(r => r.json()).then(d => {
                return d
            })

            //TODO mulitple object allowance
            buildings.forEach(building => {
                this.gameMap.addSolidBuilding(new MapObjectSolidRect(
                    new Position(building.position.x,building.position.y),
                    building.sizeX,
                    building.sizeY,
                    building.type
                ))
            })


            let npcs = await fetch(`./data/${folder}/Npcs.json`).then(r => r.json()).then(d => {
                return d
            })
            npcs.forEach(npc => {
                this.gameMap.addNPC(new NPC(
                    new Position(npc.position.x,npc.position.y),
                    new NPCCharacter(
                        npc.character.type,
                        npc.character.name,
                        new DialogNpc(
                            npc.character.dialog.elementId,
                            npc.character.dialog.content
                        ),
                        npc.character.profession
                    ),
                    npc.quests.map(q => new Quest(q.name, q.requirements, q.rewards, q.xp)),
                    npc.trades.map(t => new Trade())
                ))
            })

            let nodes = await fetch(`./data/${folder}/Objects.json`).then(r => r.json()).then(d => {
                return d
            })
            nodes.forEach(node => {
                let o = undefined
                if(node.class == "node"){
                    o = new MapObject(
                        node.texture,
                        new Position(node.position.x, node.position.y),
                        new LootTable(node.lootTable)
                    )
                }else if(node.class =="plant"){

                    o = new Plant(
                        node.texture,
                        new Position(node.position.x, node.position.y),
                        new LootTable(node.lootTable),
                        node.maxGrowState
                    )
                }
                
                if(o != undefined){
                    this.gameMap.addNode(o)
                }
            })


       })
    }

    #createEventListener(){
        addEventListener("resize", (ev) => {
            this.resizeRenderCanvas()
        })

        window["customEvents"] = {}
        window.customEvents["renderMap"] = new Event('renderMap');

        // Listen for the event.
        window.addEventListener('renderMap', (e) => { 
            this.renderGame()
         }, false);

    }

    #createGameLoop(){
        this.loop = window.setInterval(()=>{
            console.debug("Game tick")
            const pos = this.getPos()
            const mapObjects = this.gameMap.getMapObjects(pos,["objects"])["objects"]


            //TODO loottable/respawn table and prohabilites for different ores
            mapObjects.forEach(node => {
                node.tick()
            })



        },1000)
    }

    getWinSize(){
        var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
        return [x,y]
    }

    resizeRenderCanvas(){
        //adjust size
        const parentRoot = this.game.render.root.parentElement
        let width = parentRoot.offsetWidth
        let height = parentRoot.offsetHeight
        const tileSize = this.game.render.fieldSize
        const winSize = this.getWinSize()

        //dont width over win width size
        width > winSize[0] ? width = winSize[0] : null
        // always set max height
        height = winSize[1] - 25

        this.game.render.sizeX = Math.floor(width/tileSize)
        this.game.render.sizeY = Math.floor(height/tileSize)

        this.game.render.root.width = width
        this.game.render.root.height = height
        this.renderGame()
    }

    #privateFunctiondebug() {
        console.log(this.#_player)
        console.log(this.lol)
    }

    debug(){
        this.#privateFunctiondebug()
    }

    // Game code
    renderGame(){
        //pass object to mapraender class
        this.gameMap.renderMap(this)
    }

    // Map stuff
    #getObject(){
        const pos = this.getPos()
        let objects = this.gameMap.getMapObjects(new Position(pos.x, pos.y),["objects"])["objects"]
        
        let mapObject = undefined

        if(objects != undefined){
            mapObject  = objects.sort((a,b) => a.order - b.order).filter(a => a.isInPos(pos))[0]
        }
        
        return mapObject
        
    }

    checkSolidMapObjects(position){
        //IMPORTANT need to create new postion otherwise calc in function would mess up player pos
        let mapObjectsObject = this.gameMap.getMapObjects(new Position(position.x, position.y),["solidObjects"])
        if(Object.keys(mapObjectsObject).length > 0){
            console.debug(`Processing ${Object.values(mapObjectsObject["solidObjects"]).length} solid objects`)
            Object.values(mapObjectsObject["solidObjects"]).forEach(solidObject => {
                if(solidObject.mapObjects == undefined){
                    if(solidObject.isInPos(position)){
                        throw `Cant walk on: '${solidObject.type}'.`
                    }
                }else{
                    solidObject.mapObjects.forEach(obj2 => {
                        if(obj2.isInPos(position)){
                            throw `Cant walk on: '${obj2.type}'.`
                        }
                    })
                }
            })
        }else{
            console.debug("no solid obejct loaded so nothing gets processed")
        }
        
    }


    // Player code
    /**
     * sets player chords intern checks for solid mapobejcts
     *
     * @param {Position} position
     * @memberof Game
     */
    #setPos(position){
        //TODO important check if pos is valid | depending -x -y and max size

        this.checkSolidMapObjects(position)
        
        this.#_player.posX = position.x
        this.#_player.posY = position.y

        this.renderGame()
    }

    getPos(){
        return new Position(
            this.#_player.posX,
            this.#_player.posY
        )
    }

    moveX(steps){
        let pos = this.getPos()
        pos.x += steps
        try {
            this.#setPos(pos)
        } catch (error) {
            console.warn(error)
        }
    }

    moveY(steps){
        let pos = this.getPos()
        pos.y += steps
        try {
            this.#setPos(pos)
        } catch (error) {
            console.warn(error)
        }
    }

    renderPlayer(){
        const ctx = this.game.render.root.getContext("2d")
        const fieldSize = this.game.render.fieldSize
        const buffer = fieldSize / 5

        ctx.fillStyle = "#0000FF";
        ctx.fillRect(fieldSize * this.#_player.posX  + buffer , fieldSize * this.#_player.posY + buffer, fieldSize - 2 * buffer, fieldSize - 2 * buffer);
    }

    inspectPos(){
        const pos = this.getPos()
        const o = this.#getObject(`${pos.x}_${pos.y}`)
        this.game.debugMode ? console.log(o) : null 
        let foundNpc = false


         //if no mapObject found check if npc in position and if then open dialog
         //TODO npc area filter
         if( o == undefined){
            this.gameMap.mapObjects.npcs.forEach(npc => {
                if(npc.isInPos(pos)){
                    npc.character.dialog.open()
                    foundNpc = true
                }
            })
        }
        if(o == undefined && !foundNpc){
            new GameMessage(o + "=> No specific type","warning",2)
        }else if(!foundNpc){
            new GameMessage("Inspect: " + o.inspect())
        }
        return o
    }

    harvestPos(){
        const pos = this.getPos()
        const pos_key = `${pos.x}_${pos.y}`
        let mapObject = this.#getObject()
        if(mapObject){

            /**@type MapObject */
            let items = mapObject.lootTable.roll()
            console.log(items)

            items.forEach(item => {
                this.addToStorage(item, 1)
                mapObject.amount -= 1
            })

            this.renderGame()
            
            new GameMessage("harvested: " + mapObject.inspect())
        }
    }

    #getPlayerStorage(){
        class Storage{
            add(object){
                if(this[object.item]){
                    // when loottable rework this amount replacen
                    this[object.item].value += object.value
                }else{
                    this[object.item] = object
                }
                
            }
            remove(objectString, amount){
                this[objectString].value -= amount
                if(this[objectString].value <= 0){
                    delete this[objectString]
                }
            }
        }

        return new Storage()
    }

    #playerAddMapObject(mapObject){
        const deepCopy = JSON.parse(JSON.stringify(mapObject))
        //TODO check if enough storage available
        //TODO value with loottable
        this.#_player.storage.add({type:deepCopy.type,value:1})

        this.#renderStorage()
    }

    //  Storage renderer

    #renderStorage(){
        const root = document.getElementById("storage")
        root.innerHTML = ""

        let div = document.createElement("div")
        div.classList.add("headline")
        div.innerText = "Storage"
        root.appendChild(div)

        Object.values(this.#_player.storage).forEach(item => {
            div = document.createElement("div")
            div.classList.add("item")
            div.innerText = `${item.value} x ${item.item}`
            root.appendChild(div)
        })

    }

    getStorage(){
        const o = this.#_player.storage
        // this.game.debugMode ? console.log(o) : null 
        return o
    }

    //TODO rework duobled code with sotrage.add() function
    addToStorage(key, amount){
        this.#_player.storage.add({item:key,value:amount})
        this.#renderStorage()
    }

    removeFromStorage(key, amount){
        this.#_player.storage.remove(key,amount)
        this.#renderStorage()
    }

    
}


//TODO rework
let images = new ImageLoader()
let game = ""

// let dialogs = ""

async function main(){
    await images.loadImages()
    /**@type Game */
    game = new Game()

    //load all objects like npcs and mapobjects
    await game.afterInit()
    new KeyboardController(game)

    // dialogs = new DialogHelper()
    // dialogs.addDialog("first", new DialogNpc(".dialogs #dialog_1"))

}
main()

// delayer rerender due to npc not rendiering first time dont care why
setTimeout(() => {
    game.renderGame()
}, 400)

