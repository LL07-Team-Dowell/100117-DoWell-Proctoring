// Import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { expect } = chai;

chai.use(chaiHttp);

const serverURL = 'http://localhost:5000';

describe('Event API Tests', function() {
    // Example test for getting all events
    it('should get all events', function(done) {
        chai.request(serverURL)
            .get('/api/events') // Adjust the path according to your actual API endpoint
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.be.an('array');
                done();
            });
    });33


describe('Event API Tests', function() {
    let eventId;

    // Test for creating an event
    it('should create an event', function(done) {
        chai.request(app)
            .post('/api/events')
            .send({
                start_time: "2024-04-01T09:00:00.000Z",
                duration_in_hours: 3,
                user_id: "someUniqueUserId",
                participants: [],
                max_cap: 50
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.have.property('id');
                eventId = res.body.data.id;
                done();
            });
    });

    // Test for getting all events
    it('should get all events', function(done) {
        chai.request(app)
            .get('/api/events')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.be.an('array');
                done();
            });
    });

    // Test for getting a single event by ID
    it('should get an event by id', function(done) {
        chai.request(app)
            .get(`/api/events/${eventId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.have.property('id', eventId);
                done();
            });
    });

    // Test for updating an event
    it('should update an event', function(done) {
        chai.request(app)
            .put(`/api/events/${eventId}`)
            .send({
                max_cap: 100
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.have.property('max_cap', 100);
                done();
            });
    });

    // Test for deleting an event
    it('should delete an event', function(done) {
        chai.request(app)
            .delete(`/api/events/${eventId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.equal('Event deleted successfully');
                done();
            });
    });
});
