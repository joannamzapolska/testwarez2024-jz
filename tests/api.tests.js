import { expect } from "chai";
import pkg from "pactum";
import "dotenv/config";
const { spec } = pkg;
import {baseURL, userID} from "../helpers/data.js"

describe("Api tests", () => {
  it.skip("get request", async () => {
    const response = await spec().get(`${baseURL}/BookStore/v1/Books`);
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

  it("Authorize a user", async () => {
    const response = await spec()
      .post(`${baseURL}/Account/v1/GenerateToken`)
      .withBody({
        userName: "asia123_tw2024",
        password: process.env.SECRET_PASSWORD,
      })
    .inspect()
    expect(response.statusCode).to.eql(200);
  });

});
