
class Point {

    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    static createPointById(p) {
        const [i, j] = p.split(',');
        return new Point(parseInt(i), parseInt(j));
    }

    static createIdByPoint(p){
        const [i, j] = [p.i, p.j];
        return `${i},${j}`;
    }

    static createEmptyPoint() {
        return new Point();
    }

    static isEmptyPoint(p) {
        if(p===undefined) return true
        if (p.i === undefined && p.j === undefined)
            return true;
        return false;
    }
    
    /* Verify if points are the same */
    static isSamePoint(p1, p2) {
        if(p1===undefined || p2===undefined) return false
        if (p1.i === p2.i && p1.j === p2.j)
            return true;
        return false;
    }

    /* Check compatibility point, verifing that are vertical, 
    horizonta or diagonal, by string. I.e. sp and ep passed to the function 
    are Point. */
    static compatibilityPointByPoint(startP, endP) {

        /* If start point is equal end point return "" */
        if (startP.i === endP.i && startP.j === endP.j){
            return false;            
        }           
        /* Word by coloum */
        if (startP.j === endP.j){
            return true
        }           
        /* Word by row */
        if (startP.i === endP.i){
            return true
        }  
        /* Word by diagonal */
        if (startP.i !== endP.i && startP.j !== endP.j && 
            (Math.abs(startP.i-endP.i) === Math.abs(startP.j-endP.j))){
            return true
        }       

        return false;
    }

    /* Check compatibility point, verifing that are vertical, 
    horizonta or diagonal, by string. I.e. sp and ep passed to the function 
    are string. */
    static compatibilityPointByString(sp, ep) {
        const startP = Point.createPointById(sp);
        const endP = Point.createPointById(ep)
        
        return Point.compatibilityPointByPoint(startP, endP);
    }

}



module.exports = Point;