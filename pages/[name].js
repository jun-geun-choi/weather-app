import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { groupForecastByDate } from "../utils/groupForecast";

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
  const router = useRouter();
  const city = router.query.name; // URL 파라미터 ex) Seoul, Tokyo, Paris, London
  const [openDate, setOpenDate] = useState(null);

  // GraphQL 요청
  const { loading, error, data } = useQuery(GET_WEATHER, {
    variables: { city },
    skip: !city, // city가 없을 때 요청 방지
  });

  if (!city) return <p>Loading...</p>;
  if (loading) return <p>Fetching weather...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const grouped = groupForecastByDate(data.forecast5days);

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
