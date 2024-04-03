let chai, chaiHttp, expect;

// Asynchronously import chai modules and configure them
async function initializeChai() {
    chai = await import('chai');
    chaiHttp = await import('chai-http');
    expect = chai.expect;
    chai.use(chaiHttp.default);
}


const serverURL = 'http://localhost:5000';

describe('Event API Tests', function () {
    let eventId;

    // Before running any tests, initialize chai and chaiHttp
    before(async function () {
        this.timeout(10000);
        await initializeChai();
    });

    // Test for creating an event
    it('should create an event', function (done) {
        chai.request(serverURL)
            .post('/api/events')
            .send({
                name: "New meeting",
                start_time: "2024-04-01T09:00:00.000Z",
                close_date: "2024-04-01T09:00:00.000Z",
                duration_in_hours: 3,
                user_id: "user_1234543",
                participants: [],
                max_cap: 50,
                link: "http://abc.com/meeting"
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
    it('should get all events', function (done) {
        chai.request(serverURL)
            .get('/api/events')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.be.an('array');
                done();
            });
    });

    // Test for getting a single event by ID
    it('should get an event by id', function (done) {
        chai.request(serverURL)
            .get(`/api/events/${eventId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.data).to.have.property('id', eventId);
                done();
            });
    });

    // Test for updating an event
    it('should update an event', function (done) {
        chai.request(serverURL)
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
    it('should delete an event', function (done) {
        chai.request(serverURL)
            .delete(`/api/events/${eventId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.equal('Event deleted successfully');
                done();
            });
    });
});
