import React from "react";
import ReactDOM from "react-dom";
import "tippy.js";
import "bulma/css/bulma.min.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Amplify, { Auth } from "aws-amplify";
import App from "./App";


Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  },
  Storage: {
    region: process.env.REACT_APP_REGION,
    bucket: process.env.REACT_APP_IMAGE_BUCKET,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "super-board",
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_REGION
      },
    ]
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
