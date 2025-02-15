import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const fetchGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};

export const fetchSingleGame = async (id: string) => {
  const response = await axios.get(`${API_URL}/games/${id}`);
  return response.data;
};

export const joinGame = async (gameId: string) => {
  const response = await axios.post(`${API_URL}/games/joingame/${gameId}`);
  return response.data;
};
