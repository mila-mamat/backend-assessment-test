// ==================================================================
// import dependencies
// ==================================================================
const request = require("supertest");
const express = require("express");
const app = express();
const apiAssist = require("../routes/apiAssist");

require("../routes/apiRoutes")(app);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

describe("Test the api/ping path", () => {
  test("It should response the get method with status 200", (done) => {
    request(app).get("/api/ping").expect(200).expect({ success: true }, done);
  });
});

// ==================================================================
// testing bad requests
// ==================================================================
describe("Test the api/posts path", () => {
  test("It should response the get method with empty array", (done) => {
    request(app)
      .get("/api/posts/invalidTag")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect({ posts: [] }, done);
  });

  test("It should response the get method with status 400", (done) => {
    request(app)
      .get("/api/posts")
      .expect(400)
      .expect({ error: "Tags parameter is required" }, done);
  });

  test("It should response the get method with status 400", (done) => {
    request(app)
      .get("/api/posts/history/invalidSortBy")
      .expect(400)
      .expect({ error: "sortBy parameter is invalid" }, done);
  });

  test("It should response the get method with status 400", (done) => {
    request(app)
      .get("/api/posts/history/likes/invalidDirection")
      .expect(400)
      .expect({ error: "direction parameter is invalid" }, done);
  });
});

// ==================================================================
//testing good requests
// ==================================================================
describe("Test the api/posts path", () => {
  test("It should response the get method with status 200", (done) => {
    request(app)
      .get("/api/posts/politics")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        let posts = res.body.posts;
        expect(posts.length).not.toBe(0);
        expect(posts[0]).toHaveProperty("author");
        return done();
      });
  });
  test("It should be able to handle multiple tags", (done) => {
    request(app)
      .get("/api/posts/politics,tech")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        let posts = res.body.posts;
        expect(posts.length).not.toBe(0);
        return done();
      });
  });
  test("It should be case insensitive", (done) => {
    request(app)
      .get("/api/posts/politics/LikES/DEsc")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        let posts = res.body.posts;
        expect(posts.length).not.toBe(0);
        return done();
      });
  });
});
