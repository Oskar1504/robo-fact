class ImageLoader{
    images = {}
    debug = false
    constructor(){
    }

    async loadImages(){
        //TODO REwork maybe due  ES2018  requirement
        for await (const imageName of imageNames) {
            
            this.images[imageName.split("/").reverse()[0].split(".")[0]] = await loadImage(imageName)
            this.debug ? console.log("load image: ", imageName) : null
        }

        this.debug ? console.log("Loaded all images") : null
    }

    get(imageName){
        if(this.images[imageName]){
            return this.images[imageName]
        }else{
            console.error("No image with key: '" +imageName+"' found")
            return undefined
        }
    }

    add(key, img){
        this.images[key] = img
    }
}