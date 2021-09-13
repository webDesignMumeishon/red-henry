var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
var server = require('../../bin/www'); //Para Mongoose



describe('Testing Usuarios', function() {

    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterEach(function(done) {
        Reserva.deleteMany({}, function(err, success){
            if (err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Cuando un Usuario reserva una bici',() => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Martín'});
            usuario.save()
            const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            bicicleta.save()
            let hoy = new Date();
            let mañana = new Date();
            mañana.setDate(hoy.getDate()+1); //tambien podemos hacer add day con Moment  

            // .this(userSaved => {
            //     const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            //     return bicicleta.save()
            // })
            // .then(biciSaved => {
            //     let hoy = new Date();
            //     let mañana = new Date();
            //     mañana.setDate(hoy.getDate()+1); //tambien podemos hacer add day con Moment
            //     return userSaved.reservar(bicicleta.id, hoy, mañana)
            // })
            usuario.reservar(bicicleta.id, hoy, mañana)
            .then(reservaSaved => {
                return Reserva.find({}).populate('bicicleta').populate('usuario')
            })
            .then(reservas => {
                console.log(reservas[0]);
                expect(reservas.length).toBe(1);
                expect(reservas[0].diasDeReserva()).toBe(2);
                expect(reservas[0].bicicleta.code).toBe(1);
                expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                // expect(reservas[0].usuario.email).toBe(userSaved.email);
                // expect(reservas[0].usuario.password).toBe(userSaved.password);
                done();
            })

            // const usuario = new Usuario({nombre: 'Martín', email: 'a@a.a', password: 'p'});
            // usuario.save(function(err, user){
            //     const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            //     bicicleta.save(function(err, bici){
            //         var hoy = new Date();
            //         var mañana = new Date();
            //         mañana.setDate(hoy.getDate()+1); //tambien podemos hacer add day con Moment
            //         user.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
            //             Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
            //                 console.log(reservas[0]);
            //                 expect(reservas.length).toBe(1);
            //                 expect(reservas[0].diasDeReserva()).toBe(2);
            //                 expect(reservas[0].bicicleta.code).toBe(1);
            //                 expect(reservas[0].usuario.nombre).toBe(user.nombre);
            //                 expect(reservas[0].usuario.email).toBe(user.email);
            //                 expect(reservas[0].usuario.password).toBe(user.password);
            //                 done();
            //             });
            //         });
            //     });
            // });
        });
    });
});