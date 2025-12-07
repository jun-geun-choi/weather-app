import { ApolloServer, gql } from "apollo-server-micro";
const fetch = require("node-fetch");

// 1) GraphQL 타입 정의
const typeDefs = gql`
  type Weather {
    temp: Float
    description: String
  }

  type ForecastItem {
    dt_txt: String
    temp: Float
    description: String
  }

  type Query {
    currentWeather(city: String!): Weather
    forecast5days(city: String!): [ForecastItem]
  }
`;

// 2) Resolver
const resolvers = {
  Query: {
    // 현재 날씨
    currentWeather: async (_, { city }) => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set");

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      return {
        temp: data?.main?.temp ?? null,
        description: data?.weather?.[0]?.description ?? null,
      };
    },

    // 5일 예보
    forecast5days: async (_, { city }) => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set");

      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      // 응답이 잘못되었을 경우 처리
      if (!data?.list) return [];

      return data.list.map((item) => ({
        dt_txt: item?.dt_txt ?? null,
        temp: item?.main?.temp ?? null,
        description: item?.weather?.[0]?.description ?? null,
      }));
    },
  },
};

// 3) Apollo 서버 생성
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Next.js bodyParser 비활성화 (필수!)
export const config = {
  api: {
    bodyParser: false,
  },
};

// 4) Next.js Handler (server.start 보장)
let handlerPromise;
export default async function handler(req, res) {
  if (!handlerPromise) {
    handlerPromise = apolloServer.start().then(() =>
      apolloServer.createHandler({ path: "/api/graphql" })
    );
  }

  const h = await handlerPromise;
  return h(req, res);
}
