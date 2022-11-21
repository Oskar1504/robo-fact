
class MapObjectSolid {
    /**
     * Creates an instance of MapObjectSolid.
     * @param {Position} position
     * @param {int} sizeX
     * @param {int} sizeY
     * @param {string} type
     * @param {int} order
     * @memberof MapObjectSolid
     */
    constructor( position, sizeX, sizeY, type, order=100){
        this.position = position
        this.sizeX = sizeX - 1  
        this.sizeY = sizeY - 1
        this.type = type
        this.order = order
    }

    
    /**
     *
     *
     * @param {Position} position
     * @return {boolean} 
     * @memberof MapObject
     */
    isInPos(position) {
        let minX = this.position.x
        let maxX = this.position.x + this.sizeX
        let minY = this.position.y
        let maxY = this.position.y + this.sizeY
        return (
            position.x >= minX &&
            position.x <= maxX &&
            position.y >= minY &&
            position.y <= maxY 
        )
    }

    isInArea(){
        return true
    }
}

class MapObjectSolidRect{
    /**
     * Creates an instance of MapObjectSolidRect.
     * @param {Position} position
     * @param {int} sizeX
     * @param {int} sizeY
     * @param {string} type
     * @memberof MapObjectSolidRect
     */
    constructor(position, sizeX, sizeY, type){
        this.position = position
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.type = type
        this.mapObjects = this.getObjects()
    }

    getObjects(){
        let mapObjects = []
        let x = this.position.x
        let y = this.position.y
        mapObjects.push(new MapObjectSolid(new Position(x, y), 1 , this.sizeY, this.type))
        mapObjects.push(new MapObjectSolid(new Position(x + this.sizeX, y), 1 , this.sizeY, this.type))

        mapObjects.push(new MapObjectSolid(new Position(x, y), this.sizeX , 1, this.type))
        mapObjects.push(new MapObjectSolid(new Position(x , y + this.sizeY),  this.sizeX/2 , 1, this.type))
        mapObjects.push(new MapObjectSolid(new Position(x + this.sizeX/2 + 1, y + this.sizeY),  (this.sizeX/2) , 1, this.type))

        return mapObjects
    }

    isInArea(position, size){

        //I LOVE MATH
        //german guide for equation https://de.serlo.org/mathe/1783/abstand-zweier-punkte-berechnen
        return Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2)) <= size
    }
} 