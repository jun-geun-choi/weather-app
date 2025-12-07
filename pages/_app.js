import React from "react";
import "../styles/globals.css";  
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

//GraphQL요청에 의한 데이터 공급을 전역적으로 사용할 수 있도록 해줌.
//따라서 어플리케이션 모든 부분은 이 코드를 사용할 수 있다는 것.
const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;