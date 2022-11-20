

const Generator={
    line: {
        min: (x, m, y, width) => x * m + y,
        max: (x, m, y, width) => x * m + y + width
    },
    dot: {
        min: (x, leftRigth, upDown, size) => (x - leftRigth) * (x - leftRigth) + upDown,
        max: (x, leftRigth, upDown, size) => -(x - leftRigth) * (x - leftRigth) + upDown + size
    }
};


class MapObject {
    constructor(type, args, order, generator,amount) {
      this.type = type;
      this.args = args;
      this.order = order;
      this.generator = generator;
      this.amount = amount;
    }

    /**
     *
     *
     * @param {Position} position
     * @return {boolean} 
     * @memberof MapObject
     */
    isInPos(position) {
        if(this.amount <= 0){
            return false
        }
      return (position.y >=  Generator[this.generator].min(position.x,...this.args) && position.y <= Generator[this.generator].max(position.x,...this.args))
    }
  }
  
    class MapObjectBound extends MapObject {
        constructor(type, args, order, generator,amount, minX, maxX) {
            super(type, args, 100 + order, generator,amount);
            this.minX = minX;
            this.maxX = maxX;
        }

        /**
         *
         *
         * @param {Position} position
         * @return {boolean} 
         * @memberof MapObject
         */
        isInPos(position) {
            if(this.amount <= 0){
                delete this
            }
          return ( this.minX <= position.x && this.maxX >= position.x && position.y >=  Generator[this.generator].min(position.x,...this.args) && position.y <= Generator[this.generator].max(position.x,...this.args))
        }
    }


class Position {
    constructor(x,y){
        this.x = x
        this.y = y
    }
}


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
} 