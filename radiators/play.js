require("dotenv").config();
const axios = require("axios");

let adaxUrl = process.env.ADAX_BASE_URL;

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  params: {
    grant_type: "password",
    username: process.env.ADAX_USER_ID,
    password: process.env.ADAX_PASS,
  },
};

const getToken = async () => {
  try {
    const auth = await axios.post(
      adaxUrl + process.env.ADAX_AUTH_PATH,
      {},
      config
    );
    return ({ access_token, expires_in } = auth.data);
  } catch (error) {
    console.error(error);
  }
  return {};
};

const getHeatingInfo = async (token) => {
  let path = "rest/v1/content/";
  let heatings = {};
  try {
    heatings = await axios.get(adaxUrl + path, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    heatings = heatings?.data;
  } catch (error) {
    console.error(error);
  }
  return heatings;
};

async function run() {
  let { access_token, expires_in } = await getToken();

  let smartHeat = await getHeatingInfo(access_token);
  console.log(smartHeat);

  let roomsNormalised = smartHeat.rooms?.map((room) => {
    return { ...room, temperature: room.temperature / 100 };
  });
  console.log({ roomsNormalised });
}

run();
