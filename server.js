const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const consumerKey = "SUA_KEY";
const consumerSecret = "SEU_SECRET";

async function getToken() {
  const res = await axios.get(
    "https://api.sandbox.vm.co.mz:18352/ipg/v1x/oauth/access-token",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(consumerKey + ":" + consumerSecret).toString("base64")
      }
    }
  );

  return res.data.access_token;
}

app.post("/pagar", async (req, res) => {
  try {
    const { numero, valor } = req.body;

    const token = await getToken();

    const response = await axios.post(
      "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/",
      {
        input_TransactionReference: "TX123",
        input_CustomerMSISDN: numero,
        input_Amount: valor,
        input_ThirdPartyReference: "APP123",
        input_ServiceProviderCode: "171717"
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(3000, () => console.log("Servidor rodando"));
