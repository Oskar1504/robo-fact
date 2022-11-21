let zahlen = [2, 4,6,8,10,11]
let loesungen = [1, 0.5,0.33,0.25,0,0]



zahlen.forEach((zahl,i) => {
    let o = (zahl-2)/zahl
    console.log("Calc: ", (((zahl-2)/zahl)/((zahl/2)-1)))
    console.log("Soll: ", loesungen[i])
})

console.log((4/2)-1)