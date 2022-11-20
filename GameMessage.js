

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
            try {
                document.getElementById(this.id).remove()
                delete this
            } catch (error) {
                
            }
            
        }, duration * 1000);
    }
}
