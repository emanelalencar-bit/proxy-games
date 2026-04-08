const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req,res)=>{
  res.send("Proxy funcionando!");
});

app.get("/proxy", async (req,res)=>{
  try{
    const response = await axios.get("URL_DA_API_DA_PROVEDORA");
    res.json(response.data);
  }catch(e){
    res.status(500).send("Erro no proxy");
  }
});

app.listen(process.env.PORT || 3000);