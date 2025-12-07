// 서버 호출
import { ApolloServer, gql } from "apollo-server-micro";
const fetch = require("node-fetch"); // 외부 API 호출하기 위한 용도

// GraphQL 타입 정의(DTO 같은 것.) 
// Weather:날씨, ForcastItem : 날씨 예보 항목 구조
// Query : 프론트 엔드가 요청할 수 있는 조회용 API 목록 선언
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

// 실제 데이터 처리 함수들 정의
const resolvers = {
  Query: {
    // 현재 날씨
    currentWeather: async (_, { city }) => {
      // 발급받은 API키 가지고 와서
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set");
			
			// 전달 받은 인자값과 API키를 이용하여 
			// 현재 날씨만 반환하는 URL에 사용.
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;
			
			//해당 url을 비동기 통신으로 조회 및 할당
      const response = await fetch(url);
      const data = await response.json();
			
			// 전달받은 데이터를 가공.
      return {
        temp: data?.main?.temp ?? null,
        description: data?.weather?.[0]?.description ?? null,
      };
    },

    // 5일 예보
    forecast5days: async (_, { city }) => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set");
			
			// 5일치를 3시간 간격으로 제공받는 URL 사용.
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      // 응답이 잘못되었을 경우 처리
      if (!data?.list) return [];
			
			// 데이터 가공후 반환
      return data.list.map((item) => ({
        dt_txt: item?.dt_txt ?? null,
        temp: item?.main?.temp ?? null,
        description: item?.weather?.[0]?.description ?? null,
      }));
    },
  },
};

// Apollo 서버에 DTO 정의한 것과 데이터 처리 함수를 띄운다.
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// 요청된 데이터를 자동으로 파싱되는 것을 방지하고
// 정확하게 GraphQL로 실행할 수 있도록..
export const config = {
  api: {
    bodyParser: false,
  },
};

// GraphQL 서버를 안전하게 실행시키기 위해,
// 서버를 매 요청마다 새로 요청하지 않고, 한번만 초기화.
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
