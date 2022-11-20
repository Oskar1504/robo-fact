class Player{
    //could be used to exclude player logic from game class
}


class Game{
    #privateAttribute = "private"
    #_player = {
        posX:1,
        posY:1,
        state: "default",
        storage:this.#getPlayerStorage()
    };
    
    publicAttribute = "public"

    game = {
        debugMode:true,
        render: {
            root: document.getElementById("mainFrame"),
            size:10,
            frameSizeX: 600,
            frameSizeY: 600,
            fieldSize:50
        },
        map: {
            //objects:{},
            objects:[],
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

        this.generateObjects()
        // at this point rendergame may not have all images //TODO find better way to load images
        this.renderGame()
        this.#renderStorage()
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
            const size = this.game.render.size / 2

            for(let i = 0; i < this.game.map.maxObjects; i++){
                // this.#mapAddObject({
                //     //TODO in functions auslagern
                //     // -1 due to render foreach starts with 0
                //     posX: getRandomInt(1, this.game.render.size - 1),
                //     posY: getRandomInt(1, this.game.render.size - 1),
                //     type: types[getRandomInt(0,types.length-1)]
                // })

                
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
            return this.game.map.objects.sort((a,b) => a.order - b.order).filter(a => a.isInPos(pos.x, pos.y))[0]
        }
    
    //  Code stuff
    async executeCode(){
        const root = document.getElementById("codeInput")
        const executionDelay = document.getElementById("executeDelay").value
        let noDelay = false
        let codeCommands = document.getElementById("codeInput").value.split("\n").map(codeCommand => codeCommand.split(":"))

        let codeVars = {}
        

        for(let stackIndex = 0; stackIndex < codeCommands.length; stackIndex++){
            let codeCommand = codeCommands[stackIndex]
            if(this[codeCommand[0]]){
                let value = codeCommand[1]
                if(codeVars[value]){
                    value = codeVars[value]
                }
                this[codeCommand[0]](parseInt(value))
                noDelay = false
            }else{
                // non rerenderigng tasks get executed without delay
                noDelay = true
            }

            codeCommand[2] = parseInt(codeCommand[2])

            if(codeCommand[0] == "let"){
                codeVars[codeCommand[1]] = codeCommand[2]
            }else if(codeCommand[0] == "+"){
                codeVars[codeCommand[1]] += codeCommand[2]
            }else if(codeCommand[0] == "-"){
                codeVars[codeCommand[1]] -= codeCommand[2]
            }else if(codeCommand[0] == "="){
                codeVars[codeCommand[1]] = codeCommand[2]
            }else if(codeCommand[0] == "do"){
                stackIndex = codeCommands.map(elm => elm.join(":")).indexOf("fnc:" + codeCommand[1])
            }else if(codeCommand[0] == "ifnot"){    //TODO total rework due to arry mutatuion wont rerun this for loop
                let value1 = codeCommand[1]
                if(codeVars[value1]){
                    value1 = codeVars[value1]
                }
                let value2 = codeCommand[2]
                if(codeVars[value2]){
                    value2 = codeVars[value2]
                }

                value1 = parseInt(value1)
                value2 = parseInt(value2)

                console.log(value1, value2)

                let newCommand = codeCommand.slice(3,codeCommand.length)
                if(value1 != value2){
                    //add next command if not already added
                    if(codeCommands[stackIndex+1].join(":") != newCommand.join(":")){
                        codeCommands.splice(stackIndex+1, 0, newCommand.join(":").split(":"))
                        console.log(codeCommands)
                    }
                }else{
                    //remove previous added command when if isnt ture
                    if(codeCommands[stackIndex+1].join(":") == newCommand.join(":")){
                        codeCommands.splice(stackIndex,1)
                    }
                }
                //  if:x:1:do:moveRight
            }

            this.game.code.forceBreak ? stackIndex = codeCommands.length : null
            noDelay ? null: await new Promise(resolve => setTimeout(resolve, executionDelay * 1000));
        }

        this.game.code.forceBreak = false
    }

    forceBreak(){
        this.game.code.forceBreak = true
    }



    // Player code
    #setPos(x, y){
        //TODO important check if pos is valid | depending -x -y and max size
        this.#_player.posX = x
        this.#_player.posY = y

        this.renderGame()
    }

    getPos(){
        return {
            x: this.#_player.posX,
            y: this.#_player.posY
        }
    }

    moveX(steps){
        const pos = this.getPos()
        this.#setPos(pos.x + steps, pos.y)
    }

    moveY(steps){
        const pos = this.getPos()
        this.#setPos(pos.x, pos.y + steps)
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

        if(o == undefined){
            new GameMessage(o + "=> No specific type","warning",2)
        }else{
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
                    this[object.type].value += 1
                }else{
                    //TODO exoprt transform function
                    //transform mapObject to storageObject
                    //TODO IDEA use loottable mechanic for map objects
                        // IDEA maybe loottable before add => outside storage placen/usen
                    object["value"] = 1
                    this[object.type] = object
                }
                
            }
            remove(objectString){
                this[objectString].value -= 0
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
        this.#_player.storage.add(deepCopy)

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
        this.game.debugMode ? console.log(o) : null 
        return o
    }
}

let game = new Game()

//TODO overthink mechain
let codeSnippets = {
    "first":"moveX:1",
    "second":"moveX:-1",
    "third":"let:x:2\nmoveX:x",
    "4":"let:x:4\n-:x:2\nmoveX:x",
    "5":"let:x:0\n+:x:2\nmoveX:x",
    "6":"let:x:0\n+:x:2\nmoveX:x",
    "7":"let:x:1\nfnc:moveRight\nmoveX:1\n+:x:1\ndo:moveRight"
}

document.querySelectorAll(".unselectable pre").forEach(elm => {
    elm.addEventListener("click", (e) => {
        if(e.target.id){
            document.getElementById("codeInput").value = codeSnippets[e.target.id]
        }
    })
})


//Util
//TODO auslagern

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//https://stackoverflow.com/a/1527820/14077167



// when using message as class i can remove each message by its own
class GameMessage{
    constructor(content, type="info", duration=5){
        const root = document.getElementById("messages")
        
        if(root.childElementCount >= 5){
            root.removeChild(root.firstChild)
        }
        let id = new Date().getTime()
        this["id"] = id

        let div = document.createElement("div")
        div.innerText = content
        div.classList.add("message")
        div.classList.add("message-" + type)
        div.id = id
        
        root.appendChild(div)

        window.setTimeout(() => {
            document.getElementById(this.id).remove()
            delete this
        }, duration * 1000);
    }
}
