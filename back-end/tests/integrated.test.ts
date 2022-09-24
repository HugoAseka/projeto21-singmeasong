import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import * as recommendationsFactory from "./factories/recommendationsFactory";
import { Recommendation } from "@prisma/client";

const api = supertest(app);
type recommendationType = Recommendation;

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE recommendations RESTART IDENTITY;`;
});

describe("tests POST /recommendations ", () => {
  it("returns 201 for successful creation", async () => {
    const body = await recommendationsFactory.validRecommendation();
    const result = await api.post("/recommendations").send(body);
    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: body.name },
    });

    expect(result.status).toEqual(201);
    expect(createdRecommendation.name).toEqual(body.name);
  });

  it("returns 422 for invalid input", async () => {
    await api.post("/recommendations").send({}).expect(422);
  });

  it("returns 409 for existing name of recommendation", async () => {
    const body = await recommendationsFactory.insertIntoDatabase();
    await api
      .post("/recommendations")
      .send({ name: body.name, youtubeLink: body.youtubeLink })
      .expect(409);
  });
});

describe("tests POST /recommendations/:id/upvote", () => {
  it("returns 200 for successful increment in score", async () => {
    const createdRecommendation =
      await recommendationsFactory.insertIntoDatabase();
    const result = await api.post(
      `/recommendations/${createdRecommendation.id}/upvote`
    );
    const { score: finalScore } = await recommendationsFactory.findByName(
      createdRecommendation.name
    );
    expect(result.status).toEqual(200);
    expect(finalScore).toEqual(1);
  });

  it("returns 404 for id not found", async () => {
    await api.post(`/recommendations/99999/upvote`).expect(404);
  });
});

describe("tests POST /recommendations/:id/downvote", () => {
  it("returns 200 for successful decrease in score", async () => {
    const createdRecommendation =
      await recommendationsFactory.insertIntoDatabase();
    const result = await api.post(
      `/recommendations/${createdRecommendation.id}/downvote`
    );
    const { score: finalScore } = await recommendationsFactory.findByName(
      createdRecommendation.name
    );
    expect(finalScore).toEqual(-1);
    expect(result.status).toEqual(200);
  });

  it("returns 404 for not found id", async () => {
    await api.post(`/recommendations/9999/downvote`).expect(404);
  });
  it("returns status 200 and delete recommendation when score is -5", async () => {
    const { name, id } = await recommendationsFactory.insertWithLowestScore();
    const res = await api.post(`/recommendations/${id}/downvote`);
    const recommendation = await recommendationsFactory.findByName(name);
    expect(res.status).toEqual(200);
    expect(recommendation).toBeNull;
  });
});

describe("tests GET /recommendations", () => {
  it("returns an array with 10 elements and status 200", async () => {
    await recommendationsFactory.insertMany(12);
    const { body: recommendations } = await api
      .get("/recommendations")
      .expect(200);
    expect(recommendations.length).toEqual(10);
  });
  it("element from return array has correct format", async () => {
    const recommendation = await recommendationsFactory.insertIntoDatabase();
    const res = await api.get("/recommendations").expect(200);
    expect(res.body[0]).toMatchObject(recommendation);
  });
});

describe("tests GET /recommendations/:id", () => {
  it("returns element by id and status 200", async () => {
    const createdRecommendation =
      await recommendationsFactory.insertIntoDatabase();
    const res = await api
      .get(`/recommendations/${createdRecommendation.id}`)
      .expect(200);
    expect(res.body).toMatchObject(createdRecommendation);
  });
  it("return 404 if id doesn't exist", async () => {
    const createdRecommendation =
      await recommendationsFactory.insertIntoDatabase();
    await api.get(`/recommendations/${createdRecommendation.id}`).expect(200);
  });
});

describe("tests GET /recommendations/random", () => {
  it("returns 404 if there's no songs in database", async () => {
    await api.get("/recommendations/random").expect(404);
  });
});

describe("tests GET /recommendations/top/:amount", () => {
  it("returns n amount of songs in decreasing order by score ", async () => {
    const amount = 7;
    await recommendationsFactory.insertMany(amount);
    const result = await api.get(`/recommendations/top/${amount}`);
    expect(result.body.length).toEqual(amount);
    for (let i = 0; i < amount - 1; i++) {
      expect(result.body[i].score).toBeGreaterThanOrEqual(
        result.body[i + 1].score
      );
    }
  });
});
