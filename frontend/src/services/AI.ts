import axios from "axios";

const AI_BASE_URL = process.env.REACT_APP_AI_BASE_URL;

export const retrain = () => {
  try {
    axios.post(`${AI_BASE_URL}/model_retrain`, {});
  } catch (e) {
    console.error(e);
  }
}