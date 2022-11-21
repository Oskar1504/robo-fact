

const Generator={
    line: {
        min: (x, m, y, width) => x * m + y,
        max: (x, m, y, width) => x * m + y + width
    },
    dot: {
        min: (x, leftRigth, upDown, size) => {
            let lol = 1
            if(size > 2){
                lol = (((size-2)/size)/((size/2)-1))
            }
            return lol * (x - leftRigth) * (x - leftRigth) + upDown
        },
        max: (x, leftRigth, upDown, size) => {
            let lol = 1
            if(size > 2){
                lol = (((size-2)/size)/((size/2)-1))
            }

            return -lol * (x - leftRigth) * (x - leftRigth) + upDown + size
        }
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

    isInArea(){
        return true
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

        isInArea(){
            return true
        }
    }


