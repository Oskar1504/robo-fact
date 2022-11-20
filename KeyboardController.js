class KeyboardController{
    constructor(game){
        this.createEventListener(game)
    }

    hotkeys = {
        "w":"moveY,-1",
        "s":"moveY,1",
        "a":"moveX,-1",
        "d":"moveX,1",
        "q":"inspectPos,",
        "e":"harvestPos,",
    }

    createEventListener(game){
        document.onkeydown = (ev) => {
            let controllKeys = Object.keys(this.hotkeys)
            if(controllKeys.includes(ev.key)){
                let [func,arg] = this.hotkeys[ev.key].split(",")
                game[func](parseInt(arg))
            }
        }
    }




    
}