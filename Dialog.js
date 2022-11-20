class DialogHelper {
    dialogs = {}
    constructor(){

    }

    addDialog(id, dialogObject){
        this.dialogs[id] = dialogObject
    }

    get(id){
        return this.dialogs[id]
    }
}

class Dialog {
    //TODO create dialog elm in dom
    constructor(elementId){
        
        let dialog = document.createElement("dialog")
        dialog.id = elementId
        document.querySelector(".dialogs").appendChild(dialog)

        this.root = dialog
        this.createDefaultControls()
    }

    createDefaultControls(){
        //TODO eigenes dom framework einbauen
        let div = document.createElement("div")
        div.id = "dialog-content-wrapper"
        let divContent = document.createElement("div")
        divContent.id = "dialog-content"
        let divControls = document.createElement("div")
        divControls.id = "dialog-controls"
        let button = document.createElement("button")
        button.innerText = "Close"
        button.addEventListener("click", () => {
            this.root.close()
        })

        divControls.appendChild(button)

        div.appendChild(divContent)        
        div.appendChild(divControls)        

        this.root.appendChild(div)
    }

    open(){
        this.root.showModal()
    }
}

class DialogNpc extends Dialog {
    constructor(elementId){
        super(elementId)
        this.createDefaultContent()
    }

    createDefaultContent(){
        let div = document.createElement("div")
        let p = document.createElement("p")
        p.innerText = "hallo ich war auch da"


        div.appendChild(p)

        this.root.querySelector("#dialog-content").appendChild(div)

    }

    /**
     *
     *
     * @param {Array<Quest>} quests
     * @memberof DialogNpc
     */
    createQuestsElements(quests){
        let div = document.createElement("div")
        div.innerText = "Quests"
        quests.forEach((quest) => {
            
            let divQuest = document.createElement("div")
            divQuest.innerText = `Quest: "${quest.name}"`
            divQuest.id = `quest_${quest.name.replace(" ","_")}`

            let divR = document.createElement("div")
            divR.innerText = `requirements`

            quest.requirements.forEach(req => {
                let divreq = document.createElement("div")

                let span = document.createElement("span")
                span.innerText = req
                let button = document.createElement("button")
                button.innerText = "Submit ressources"

                button.addEventListener("click", () => {
                    quest.addRequirement(game.getStorage())
                })

                divreq.appendChild(button)
                divreq.appendChild(span)
                divR.appendChild(divreq)
            })

            divQuest.appendChild(divR)

            div.appendChild(divQuest)
        })
        this.root.querySelector("#dialog-content").appendChild(div)
    }
}