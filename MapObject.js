

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
    isInPos(x, y) {
        if(this.amount <= 0){
            return false
        }
      return (y >=  Generator[this.generator].min(x,...this.args) && y <= Generator[this.generator].max(x,...this.args))
    }
  }
  
    class MapObjectBound extends MapObject {
        constructor(type, args, order, generator,amount, minX, maxX) {
            super(type, args, order, generator,amount);
            this.minX = minX;
            this.maxX = maxX;
        }
        isInPos(x, y) {
            if(this.amount <= 0){
                delete this
            }
          return ( this.minX <= x && this.maxX >= x &&y >=  Generator[this.generator].min(x,...this.args) && y <= Generator[this.generator].max(x,...this.args))
        }
    }