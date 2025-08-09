import axios from "axios";

const spoonacularRequest = async (endpoint, params = {}) => {
  params.apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `${process.env.SPOONACULAR_BASE_URL}${endpoint}`;
  const response = await axios.get(url, { params });
  return response.data;
};

export { spoonacularRequest };
