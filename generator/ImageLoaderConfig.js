const fs = require("fs")

let images = []

let folders = ["./images/map/", "./images/npc/type/", "./images/npc/profession/"]

folders.forEach(folder => {
    fs.readdirSync(folder).forEach(image => {
        images.push(folder + image)
    })
})

fs.writeFileSync("ImageLoaderConfig.js","let imageNames = " + JSON.stringify(images ,null, 2))