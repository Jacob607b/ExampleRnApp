import React, { useContext, useEffect } from "react";
import { JWTContext } from "../../context/JWTContext";
import { useState } from "react";

const useFetch = async (url) => {
  const { Jwt, setJwt } = useContext(JWTContext);
  const [response, setResponse] = useState();


  useEffect(() => {
    const fetchFunction = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: Jwt }),
      };
      //Endpoint is currently a firbase cloud funtion using the firebase emulator
      await fetch(url, requestOptions).then((res) => {
        setResponse(res);
      });
      
    };
    fetchFunction();
  }, []);
  return { response };
};

export default useFetch;
// "http://10.0.2.2:5001/vcs-reads/us-central1/app/verify"
