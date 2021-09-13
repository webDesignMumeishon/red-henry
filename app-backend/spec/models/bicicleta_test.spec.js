let Bicicleta = require('../../models/bicicleta')
let mongoose = require('mongoose')

describe('Testing Bicicletas', function(){
    beforeEach(function(done){
        let mongoDB = 'mongodb://localhost/testdb'
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function() {
            console.log("We are connected to test database")
            done()
        })
    })

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, succes){
            if(err) console.log(err)
            mongoose.disconnect(err); 
            done()
        })
    })

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {
            let bici = Bicicleta.createInstance(1, "verde", "urbana", [-45, -58])
            // console.log(bici)
            expect(bici.code).toBe(1)
            expect(bici.color).toBe("verde")
            expect(bici.modelo).toBe("urbana")
            expect(bici.ubicacion[0]).toEqual(-45)
            expect(bici.ubicacion[1]).toEqual(-58)
        })
    })

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis()
            .then(allBicis => {
                expect(allBicis.length).toBe(0);
                done();
            })
        })
    })

    describe('Bicicleta.add', () => {
        it('agrega una sola bici', (done) => {
            let aBici = new Bicicleta({code: 1, color:"verde", modelo: "urbana"})
            
            Bicicleta.add(aBici)
            .then(() => {
                return Bicicleta.allBicis()
            })
            .then(allBicisResult => {
                expect(allBicisResult.length).toEqual(1)
                expect(allBicisResult[0].code).toEqual(aBici.code)
                done()
            })

            // CALLBACK HERE APPROACH
            // let aBici = new Bicicleta({code: 1, color:"verde", modelo: "urbana"})
            // Bicicleta.add(aBici, function(err, newBici){
            //     if(err) console.log(err)
            //     Bicicleta.allBicis(function(err, bicis){
            //         expect(bicis.length).toEqual(1)
            //         expect(bicis[0].code).toEqual(aBici.code)

            //         done()
            //     })
            // })
        })
    })

    describe('Bicicleta.findbyCode', () => {
        it('debe devolver la bici con el code 1', (done) => {

            let aBici = new Bicicleta({code: 1, color:"verde", modelo: "urbana"})
            let aBici2 = new Bicicleta({code: 2, color:"rojo", modelo: "campestre"})

            Bicicleta.allBicis()
            .then(allBicis => {
                expect(allBicis.length).toBe(0);
            })
            .then(() => {
                return Bicicleta.add(aBici)
            })
            .then((aBiciResult) => {
                return Bicicleta.add(aBici2)
            })
            .then(() => {
                return Bicicleta.findByCode(1)
            })
            .then((resultFind) => {
                expect(resultFind.code).toBe(aBici.code)
                expect(resultFind.color).toBe(aBici.color)
                expect(resultFind.modelo).toBe(aBici.modelo)
                done()
            })


            // Bicicleta.allBicis(function(err, bicis){
            //     expect(bicis.length).toBe(0)
            //     let aBici = new Bicicleta({code: 1, color:"verde", modelo: "urbana"})
            //     Bicicleta.add(aBici, function(err, newBici){
            //         if(err) console.log(err)

            //         let aBici2 = new Bicicleta({code: 2, color:"rojo", modelo: "campestre"})

            //         Bicicleta.add(aBici2, function(err, newBici){
            //             if(err) console.log(err)
            //             Bicicleta.findByCode(1, function(err, targetBici){
            //                 expect(targetBici.code).toBe(aBici.code)
            //                 expect(targetBici.color).toBe(aBici.color)
            //                 expect(targetBici.modelo).toBe(aBici.modelo)

            //                 done()
            //             })
            //         })
            //     })
            // })
  
        })
    })
})










// beforeEach(() => { Bicicleta.allBicis = []})

// describe('Bicicleta.allBicis', () => {
//     it('comienza vacio', () => {
//         expect(Bicicleta.allBicis.length).toBe(0)
//     })
// })

// describe('Bicicleta.add', () => {
//     it('Agregamos una bici', () => {
//         expect(Bicicleta.allBicis.length).toBe(0)

//         let a = new Bicicleta(1, "rojo", "urbana", [-27.46056, -58.98389])
//         Bicicleta.add(a)

//         expect(Bicicleta.allBicis.length).toBe(1)
//         expect(Bicicleta.allBicis[0]).toBe(a)

//     })
// })

// describe('Bicicleta.findById', () => {
//     it('debe devolver la bici con id 1', () => {
//         expect(Bicicleta.allBicis.length).toBe(0)
//         let aBici1 = new Bicicleta(1, "rojo", "urbana", [-27.46056, -58.98389])
//         let aBici2 = new Bicicleta(1, "verde", "urbana", [-27.46056, -58.98389])
//         Bicicleta.add(aBici1)
//         Bicicleta.add(aBici2)

//         let targetBici = Bicicleta.findById(1)
//         expect(targetBici.id).toBe(1)
//         expect(targetBici.color).toBe(aBici1.color)
//         expect(targetBici.modelo).toBe(aBici1.modelo)
//         expect(targetBici.modelo).toBe(aBici1.modelo)

//     })
// })