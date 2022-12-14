import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database";

type TypeRecommendation = {
  name: string;
  youtubeLink: string;
};

export async function validRecommendation(): Promise<TypeRecommendation> {
  return {
    name: faker.lorem.words(5),
    youtubeLink: "https://www.youtube.com/watch?v=y1dbbrfekAM",
  };
}

export async function recommendationData(): Promise<Recommendation> {
  return {
    id: Number(faker.finance.amount(1, 100, 0)),
    name: faker.lorem.words(10),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    score: 0,
  };
}

export async function insertIntoDatabase() {
  const body = await validRecommendation();
  return await prisma.recommendation.create({ data: body });
}

export async function findByName(name: string) {
  return await prisma.recommendation.findUnique({ where: { name } });
}

export async function insertWithLowestScore() {
  const body = await insertIntoDatabase();
  return await prisma.recommendation.update({
    where: { id: body.id },
    data: { score: -4 },
  });
}

export async function generateMany(amount: number) {
  const data = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      name: `name ${i}`,
      youtubeLink: "https://www.youtube.com/watch?v=y1dbbrfekAM",
      score: Math.floor(Math.random() * 200),
    });
  }
  return data;
}

export async function insertMany(amount: number) {
  const body = await generateMany(amount);
  return await prisma.recommendation.createMany({ data: body });
}
