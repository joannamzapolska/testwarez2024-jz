import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import { baseURL, userID, user, password } from "../helpers/data.js";

let token_response;
let count;
let response;

describe("Api tests", () => {
  it.skip("Find a book", async () => {
    response = await spec().get(`${baseURL}/BookStore/v1/Books`);
    //.inspect();
    expect(response.statusCode).to.eql(200);

    const rensponseB = JSON.stringify(response.body);
    expect(response.body.books[1].isbn).to.eql("9781449331818");
    expect(response.body.books[4].author).to.eql("Kyle Simpson");
    expect(rensponseB).to.include("Kyle Simpson");

    const found = response.body.books.find(
      (element) => element.isbn === "9781449331818"
    );
    expect(found.author).to.eql("Addy Osmani");
    console.log(found);
  });

  it("Generate a token", async () => {
    response = await spec()
      .post(`${baseURL}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      });
    expect(response.statusCode).to.eql(200);
    expect(response.body.result).to.eql("User authorized successfully.");

    token_response = response.body.token;
  });

  it("post books", async () => {
    response = await spec()
      .get(`${baseURL}/Account/v1/User/${userID}/`)
      .withBearerToken(token_response);

    expect(response.statusCode).to.eql(200);
    count = response.body.books.length;
    expect(count).to.eql(1);

    response = await spec()
      .post(`${baseURL}/BookStore/v1/Books`)
      .withBearerToken(token_response)
      .withBody({
        userId: userID,
        collectionOfIsbns: [
          {
            isbn: "9781449337711",
          },
        ],
      });
    expect(response.statusCode).to.eql(201);

    response = await spec()
      .get(`${baseURL}/Account/v1/User/${userID}/`)
      .withBearerToken(token_response);

    expect(response.statusCode).to.eql(200);
    count = response.body.books.length;
    expect(count).to.eql(2);
  });

  it("delete books", async () => {
    response = await spec()
      .delete(`${baseURL}/BookStore/v1/Book`)
      .withBearerToken(token_response)
      .withBody({
        userId: userID,
        isbn: "9781449337711",
      });
    expect(response.statusCode).to.eql(204);

    response = await spec()
      .get(`${baseURL}/Account/v1/User/${userID}/`)
      .withBearerToken(token_response);

    expect(response.statusCode).to.eql(200);
    count = response.body.books.length;
    expect(count).to.eql(1);
  });
});
