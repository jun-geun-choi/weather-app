// GraphQL 요청을 하고, 결과 상태를 loading, error, data로 관리
import { gql, useQuery } from "@apollo/client";
//URL의 값을 읽고, 페이지 이동 할 때 활용.
import { useRouter } from "next/router";
import { useState } from "react";
//groupForecastByDate 코드의 함수를 사용하기 위해
import { groupForecastByDate } from "../utils/groupForecast";

// 요청할 것들을 미리 정의
const GET_WEATHER = gql`
  query ($city: String!) {
    currentWeather(city: $city) {
      temp
      description
    }
    forecast5days(city: $city) {
      dt_txt
      temp
      description
    }
  }
`;

export default function CityWeather() {
  //URL의 값을 읽어온다.
  const router = useRouter();
  const city = router.query.name; 
  // 토글 관리
  const [openDate, setOpenDate] = useState(null);

  // GraphQL 요청
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { city },
    skip: !city, // city가 없을 때 요청 방지
  });

  if (!city) return <p>Loading...</p>;
  if (loading) return <p>Fetching weather...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //요청된 데이터 중, 5일 예보 데이터를 가공.
  const grouped = groupForecastByDate(data.forecast5days);

  // 이후 화면에 출력
  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather Information for {city}</h1>

      <section style={{ marginBottom: "30px" }}>
        <h2>Current Weather</h2>
        <p>🌡 Temp: {data.currentWeather.temp}°C</p>
        <p>☁ {data.currentWeather.description}</p>
      </section>

      <section>
        <h2>5-day Forecast</h2>

        {Object.keys(grouped).map((date) => (
          <div key={date} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
            <div
              onClick={() => setOpenDate(openDate === date ? null : date)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {date} {openDate === date ? "▲" : "▼"}
            </div>

            {openDate === date && (
              <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                {grouped[date].map((item, idx) => (
                  <div key={idx} style={{ marginBottom: "6px" }}>
                    ⏰ {item.dt_txt.split(" ")[1]} — 🌡 {item.temp}°C — {item.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
