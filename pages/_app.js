import React from "react";
import "../styles/globals.css";  
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// 클라이언트 생성 (컴포넌트 밖에서 생성하는 것이 성능상 더 좋습니다)
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