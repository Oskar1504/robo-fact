class NPC {
    /**
     * Creates an instance of NPC.
     * @param {Position} position
     * @param {NPCCharacter} character
     * @param {Array<Quest>} quests
     * @param {Array<Trade>} trades
     * @memberof NPC
     */
    constructor(position, character, quests, trades ){
        this.position = position
        this.character = character
        this.quests = quests
        this.trades = trades
        this.texture = this.character.getTexture()

        this.character.dialog.createQuestsElements(this.quests)
    }

    isInPos(position){
        return (
            position.x == this.position.x && 
            position.y == this.position.y
        )
    }

    isInArea(position, size){
        return true
    }
}

class NPCCharacter{
    /**
     * Creates an instance of NPCCharacter.
     * @param {string} type // TODO npc type class
     * @param {string} name
     * @param {DialogNpc} dialog
     * @param {string} profession // TODO IDEA type an proifession mixture texture
     * @memberof NPCCharacter
     */
    constructor(type, name,dialog, profession){
        this.type = type
        this.name = name
        this.dialog = dialog
        this.profession = profession
    }

    getTexture(){
        let typeImg = images.get(this.type)
        let professionImg = images.get(this.profession)
        let root = document.getElementById("tempCanvas")
        root.width = typeImg.width
        root.height = typeImg.height
        let ctx = root.getContext("2d")
        ctx.drawImage(typeImg,0,0)
        ctx.drawImage(professionImg,0,0)

        let img = document.createElement("img")
        img.src = root.toDataURL('image/png')
        img.crossOrigin = 'Anonymous'

        let textureKey = `${this.type}_${this.profession}`
        images.add(textureKey, img)

        return textureKey
    }

  
}

class Quest{
    /**
     * Creates an instance of Quest.
     * @param {string} name
     * @param {Array<string>} requirements
     * @param {Array<string>} rewards
     * @param {int} xp
     * @memberof Quest
     */
    constructor(name, requirements, rewards, xp){
        this.name = name
        this.requirements = requirements
        this.rewards = rewards
        this.xp = xp
        this.finished = false
    }

    addRequirement(object){
        //TODO total reqowk remove requiremetns
        let notFoundReqs = []
        this.requirements.forEach(req => {
            try {
                if(object[req].value >= 1){
                    game.removeFromStorage(req,1)
                }else{
                    notFoundReqs.push(req)
                }
            } catch (error) {
                new GameMessage(`Quest "${req}" not fullfilled. Missing ressorces in storage`,"warning")
                console.warn(`Quest "${req}" not fullfilled. Missing ressorces in storage`)
                notFoundReqs.push(req)
            }
        })
        this.requirements = notFoundReqs

        if(this.requirements.length == 0){

            this.finished = true
        }

        this.checkStatus()
    }

    checkStatus(){
        if(this.finished){

            this.rewards.forEach(rew => {
                game.addToStorage(rew, 1)
            })

            console.log("quest finished")
            console.log(this)

            let questElement = document.querySelector(`#quest_${this.name.replace(" ","_")}`)
            questElement.innerHTML = ""
            questElement.innerText = `Quest:  "${this.name}" finished`
        }
    }


}

//TODO WIP IDEA
class Trade{
    constructor(){

    }
}
