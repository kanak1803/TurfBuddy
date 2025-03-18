import axios, { AxiosError } from "axios";

const API_URL = "https://turfbuddy.onrender.com/api";

export const fetchGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data.games;
};

export const fetchSingleGame = async (id: string) => {
  const response = await axios.get(`${API_URL}/games/${id}`);
  return response.data;
};

export const joinGame = async (gameId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/games/joingame/${gameId}`,
      {},
      { withCredentials: true } // Ensure auth cookies are included
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to join the game."
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const createGame = async (gameData: {
  sport: string;
  location: { address: string; city: string };
  date: string;
  time: string;
  playerNeeded: number;
}) => {
  try {
    const response = await axios.post(`${API_URL}/games/creategame`, gameData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create game."
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const deleteGame = async (gameId: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/games/deletegame/${gameId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete game."
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const leaveGame = async (gameId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/games/leavegame/${gameId}`,
      {}, // empty body
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to leave game.");
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to get user details."
      );
    }
    throw new Error("Failed to get user details.");
  }
};
