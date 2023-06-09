const request = require("supertest"); // import the supertest library 
const expect = require('chai').expect; // expect library from chai 
const booking = require('../test_data/booking.json') // variable booking imports the booking.json file and sends file as request body.
const authdata = require('../test_data/authdata.json')
const updatebooking = require('../test_data/update_booking.json')

describe('Restful Booker API Test', () => {
    const baseUrl = 'https://restful-booker.herokuapp.com'; //declare base url API
    var bookingId;  //stored bookingId value created and use for get API
    var token;  //stored token value created and use for update API

//Post for Create Token
before(function(done) {
    request(baseUrl)
    .post('/auth') // end point of URL API
    .send(authdata) //send file booking in json that's been imported
    .set('Accept', 'application/json')
    .end(function(err, response){
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.token).not.to.be.null;
        token = response.body.token;
        if (err){
            throw err;
        }
        done(); 
    });
        
});

//Post Request and Successfully Create a Booking
it('Creates a new booking in the API', (done)=>{
    request(baseUrl)
    .post('/booking') // end point of URL API
    .send(booking)
    .set('Accept', 'application/json') //Header -- Sets what format the response body is returned in
    .set('Content-Type', 'application/json') // Header -- Sets the format of payload you are sending.
    .end(function(err, response){
        expect(response.statusCode).to.be.equal(200); //check status code
        //assertion property check
        expect(response.body.bookingId).not.to.be.null;
        expect(response.body.booking.firstname).to.be.equal(booking.firstname);
        expect(response.body.booking.lastname).to.be.equal(booking.lastname);
        expect(response.body.booking.totalprice).to.be.equal(booking.totalprice);
        expect(response.body.booking.depositpaid).to.be.equal(booking.depositpaid);
        expect(response.body.booking.bookingdates.checkin).to.be.equal(booking.bookingdates.checkin);
        expect(response.body.booking.bookingdates.checkout).to.be.equal(booking.bookingdates.checkout);
        expect(response.body.booking.additionalneeds).to.be.equal(booking.additionalneeds);
        //store value bookinvgId to rause in another test
        bookingId = response.body.bookingid;
        if (err){
            throw err;
        }
        done();
    });
});
//Get Request and Successfully Get a Booking by ID
it('Get a Booking by Ids', (done) => {
    request(baseUrl)
    .get('/booking/' + bookingId)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end(function(err, response){
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.firstname).to.be.equal(booking.firstname);
        expect(response.body.lastname).to.be.equal(booking.lastname);
        expect(response.body.bookingdates.checkin).to.be.equal(booking.bookingdates.checkin);
        expect(response.body.bookingdates.checkout).to.be.equal(booking.bookingdates.checkout);
        if (err){
            throw err;
        }
        done();
    });
});
//Update Request with PUT and Successfully Updated a Booking by ID
it('Updates a current booking', (done)=>{
    request(baseUrl)
    .put('/booking/' + bookingId)
    .send(updatebooking)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Cookie','token=' + token) //headers token
    .end(function(err,response){
            expect(response.statusCode).to.be.eq(200)//check status code
            expect(response.body.firstname).to.be.eq(updatebooking.firstname)
            expect(response.body.lastname).to.be.eq(updatebooking.lastname)
            expect(response.body.totalprice).to.be.eq(updatebooking.totalprice)
            expect(response.body.depositpaid).to.be.eq(updatebooking.depositpaid)
            expect(response.body.bookingdates.checkin).to.be.eq(updatebooking.bookingdates.checkin)
            expect(response.body.bookingdates.checkout).to.be.eq(updatebooking.bookingdates.checkout)
            expect(response.body.additionalneeds).to.be.eq(updatebooking.additionalneeds)
            if (err){
                throw err;
            }
            done();
        });
    });
//Update request with PATCH and Successfully Updated a Booking by ID 
it('Updates a current booking with a partial payload',(done)=>{
    var firstname = "Jim";//Created variable firstname for updating data firstname
    var lastname = "Braun";//Created variable lastname for updating data lastname
    request(baseUrl)
    .patch('/booking/' + bookingId)
    //the data want to update is only the firstname and lastname, so only the data sent is both
    .send({firstname: firstname,lastname: lastname})
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Cookie','token=' + token) //headers token
    .end(function(err,response){
        expect(response.statusCode).to.be.eq(200)//check status code
        expect(response.body.firstname).to.be.eq(firstname)//value checking, the value must be the same as the contents of the variable
        expect(response.body.lastname).to.be.eq(lastname)//value checking, the value must be the same as the contents of the variable
        expect(response.body.totalprice).to.be.eql(updatebooking.totalprice);
        expect(response.body.totalprice).to.be.eq(updatebooking.totalprice)
        expect(response.body.depositpaid).to.be.eq(updatebooking.depositpaid)
        expect(response.body.bookingdates.checkin).to.be.eq(updatebooking.bookingdates.checkin)
        expect(response.body.bookingdates.checkout).to.be.eq(updatebooking.bookingdates.checkout)
        expect(response.body.additionalneeds).to.be.eq(updatebooking.additionalneeds)
        if (err){
            throw err;
        }
        done();
    });
});

//Successfully Deleted a Booking by ID 
it('Deleted a Booking by ID',(done)=>{
    request(baseUrl)
    .delete('/booking/' + bookingId)
    .set('Content-Type', 'application/json')
    .set('Cookie','token=' + token) //headers token
    .end(function(err,response){
        expect(response.statusCode).to.be.eq(201)//check status code
        if (err){
            throw err;
        }
        done();
     });
   });
});
