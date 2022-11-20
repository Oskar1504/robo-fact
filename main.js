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
        map: {
            //objects:{},
            objects:[],
            npcs:[],
            solidObjects:[],
            maxObjects: 2
        },
        code: {
            forceBreak: false
        }
    }

    constructor(size=10, mapObjects=6) {
        this.game.render.size = size
        this.game.map.maxObjects = mapObjects
        this["gameMap"] = new GameMap()

        //adjust size
        this.resizeRenderCanvas()

        this.generateObjects()
        this.generateSolidObjects()
        // at this point rendergame may not have all images //TODO find better way to load images
        this.renderGame()
        this.#renderStorage()

        this.#createEventListener()

    }

    #createEventListener(){
        addEventListener("resize", (ev) => {
            this.resizeRenderCanvas()
        })
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

    addNPC(npc){
        this.game.map.npcs.push(npc)
        this.renderGame()
    }

    // Game code
    renderGame(){
        //TODO IDEA ressource nodes could be respawnable
        //delete all empty mapObjects
        this.game.map.objects = this.game.map.objects.filter(elm => elm.amount > 0)



        //pass object to mapraender class
        this.gameMap.renderMap(this)
    }

    // Utils
    // messsages
    //TODO message qeue mit message objects from classes which allow async derender wenn 5 sec sho wtime over
    renderMessage(message){
        const root = document.getElementById("messages")
        root.innerHTML = ""

        let div = document.createElement("div")
        div.innerText = message.content
        div.classList.add("message")
        div.classList.add("message-" + message.content)
        
        root.appendChild(div)

        window.setTimeout(() => {
            root.innerHTML = ""
        }, message.duration * 1000);
    }

    //  Map stuff

        generateObjects(){

            const types = ["coal_ore","gold_ore","iron_ore"]
            const size = 8

            for(let i = 0; i < this.game.map.maxObjects; i++){
                
                this.#mapAddObject(
                    new MapObject(
                        types[getRandomInt(0,types.length-1)],
                        [
                            getRandomInt(-size,size),
                            getRandomInt(-size,size),
                            getRandomInt(1,3),
                        ],
                        2,
                        "dot",
                        getRandomInt(1,10)
                    )
                )
            }
        }

        generateSolidObjects(){
            //TODO config laoder load solid objects
            this.game.map.solidObjects.push(... new MapObjectSolidRect(
                new Position(-5,-7),
                5,
                4,
                "stone_bricks"
            ).getObjects())
        }

        #mapAddObject(mapObject){
            // const posKey = `${mapObject.posX}_${mapObject.posY}`
            // this.game.map.objects[posKey] = mapObject
            this.game.map.objects.push(mapObject)
        }

        #mapRemoveObject(pos_key){
            delete this.game.map.objects[pos_key]
            this.renderGame()
        }

        //key as attribute isnt that good (maybe trash da renderer mit key braucht)| could be reweorked using hardcoded player pos
        // #getObject(key){
        //     return this.game.map.objects[key]
        // }
        #getObject(){
            const pos = this.getPos()

            //get map object => resource nodes 20.11.2022
            let mapObject  = this.game.map.objects.sort((a,b) => a.order - b.order).filter(a => a.isInPos(pos))[0]

           
            return mapObject
            
        }

        checkSolidMapObjects(position){
            this.game.map.solidObjects.forEach(obj => {
                if(obj.isInPos(position)){
                    throw `Cant walk on: '${obj.type}'.`
                }
            })
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
         if( o == undefined){
            this.game.map.npcs.forEach(npc => {
                if(npc.isInPos(pos)){
                    npc.character.dialog.open()
                    foundNpc = true
                }
            })
        }
        if(o == undefined && !foundNpc){
            new GameMessage(o + "=> No specific type","warning",2)
        }else if(!foundNpc){
            new GameMessage("Inspect: " + JSON.stringify(o))
        }
        return o
    }

    harvestPos(){
        const pos = this.getPos()
        const pos_key = `${pos.x}_${pos.y}`
        let mapObject = this.#getObject()
        if(mapObject){
            this.#playerAddMapObject(mapObject)
            mapObject.amount -= 1
            
            //TODO validate if harvestable | right upgrade
            // this.#mapRemoveObject(pos_key)

            this.renderGame()
            
            new GameMessage("harvested: " + JSON.stringify(mapObject))
        }
    }

    #getPlayerStorage(){
        class Storage{
            add(object){
                if(this[object.type]){
                    // when loottable rework this amount replacen
                    this[object.type].value += object.value
                }else{
                    //TODO exoprt transform function
                    //transform mapObject to storageObject
                    //TODO IDEA use loottable mechanic for map objects
                        // IDEA maybe loottable before add => outside storage placen/usen
                    object["value"] = 1
                    this[object.type] = object
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
            div.innerText = `${item.value} x ${item.type}`
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
        this.#_player.storage.add({type:key,value:amount})
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

    game = new Game()
    new KeyboardController(game)

    // dialogs = new DialogHelper()
    // dialogs.addDialog("first", new DialogNpc(".dialogs #dialog_1"))


    //TODO auslagern in config loader
    game.addNPC(new NPC(
        new Position(-3,-5),
        new NPCCharacter("gray_wool","NPC 1",new DialogNpc("dialog_1","Default dialog content on dialognpc creation"), "miner"),
        [
            new Quest("quest 1", ["iron_ore"],["gold_ore"],10)
        ],
        []
    ))
}
main()

// delayer rerender due to npc not rendiering first time dont care why
setTimeout(() => {
    game.renderGame()
}, 400)

