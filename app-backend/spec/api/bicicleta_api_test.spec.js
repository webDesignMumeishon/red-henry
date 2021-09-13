var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = "http://localhost:3000/api/bicicletas";

describe ('Bicicleta API', () => {
    
    /*beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });*/

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if (err) console.log(err);
            done();
        });
    });


    describe ('GET BICICLETAS /', () => {
        it('Status 200 vacia', (done) => {
            request.get(base_url, function(error, response, body){
                expect(response.statusCode).toBe(200);
                Bicicleta.allBicis(function(err, doc) {
                    expect(doc.length).toBe(0);
                    done();
                });
            });
        });
        it('Status 200 con uno', (done) => {
            var a = new Bicicleta({code: 10, color: 'rojo', modelo: 'urbana', ubicacion: [-34, -54]});
            Bicicleta.add (a, function(doc) {
                request.get(base_url, function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    Bicicleta.allBicis(function(err, doc) {
                        expect(doc.length).toBe(1);
                        done();
                    });
                });
            });
        });
    });

   
    describe ('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = { "code": 10, "color": "rojo", "modelo": "urbana", "lat":-34, "lng": -54};
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: JSON.stringify(aBici)
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                // console.log("--------Original>",body)
                // console.log("--------parseado>",JSON.parse(body).bicicleta)
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe(aBici.color);
                expect(bici.modelo).toBe(aBici.modelo);
                expect(bici.ubicacion[0]).toBe(aBici.lat);
                expect(bici.ubicacion[1]).toBe(aBici.lng);
                done();
            });
        });
    });

    // xdescribe ('POST BICICLETAS /delete', () => {
    //     it('Status 204', (done) => {
    //         var headers = {'content-type' : 'application/json'};
    //         var a = new Bicicleta({code: 10, color: 'rojo', modelo: 'urbana', ubicacion: [-34, -54]});
    //         var aBiciId = { "id": a.code };
    //         Bicicleta.add (a);
            
    //         expect(Bicicleta.allBicis.length).toBe(1);

    //         request.post({
    //             headers: headers,
    //             url: base_url + '/delete',
    //             body: JSON.stringify(aBiciId)
    //         }, function(error, response, body) {
    //             expect(response.statusCode).toBe(204);
    //             Bicicleta.allBicis(function(err, doc) {
    //                 expect(doc.length).toBe(0);
    //                 done();
    //             });
    //         });
    //     });
    // });

    // xdescribe ('POST BICICLETAS /update', () => {
    //     it('Status 200', (done) => {
    //         var headers = {'content-type' : 'application/json'};
    //         var a = new Bicicleta({code: 10, color: 'rojo', modelo: 'urbana', ubicacion: [-34, -54]});
    //         Bicicleta.add (a, function() {
    //             var headers = {'content-type' : 'application/json'};
    //             var updatedBici = { "id": a.code, "color": "verde", "modelo": "montaña", "lat":-33, "lng": -55};
    //             request.post({
    //                 headers: headers,
    //                 url: base_url + '/update',
    //                 body: JSON.stringify(updatedBici)
    //             }, function(error, response, body) {
    //                 expect(response.statusCode).toBe(200);
    //                 var foundBici = Bicicleta.findByCode(10, function(err, doc) {
    //                     expect(doc.code).toBe(10);
    //                     expect(doc.color).toBe(updatedBici.color);
    //                     expect(doc.modelo).toBe(updatedBici.modelo);
    //                     expect(doc.ubicacion[0]).toBe(updatedBici.lat);
    //                     expect(doc.ubicacion[1]).toBe(updatedBici.lng);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
    
});