const RANKING_KEY = 'ranking';
const TOKEN_KEY = 'token';
// const ASSETION_KEY = 'assertion';

const readRanking = () => JSON.parse(localStorage.getItem(RANKING_KEY));
const saveRanking = (ranking) => localStorage
  .setItem(RANKING_KEY, JSON.stringify(ranking));
const readToken = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const createRanking = (ranking) => {
  saveRanking([ranking]);
};

export const getRanking = () => {
  let ranking = readRanking();

  if (ranking === null) {
    ranking = [];
  }

  return ranking;
};

export const addNewRankings = (newRanking) => {
  const oldRankings = getRanking();

  saveRanking([...oldRankings, newRanking]);
};

export const saveScore = (newScore, { id: userId }) => {
  const rankings = readRanking();
  const rankingToBeUpdate = rankings.find(({ id }) => id === userId);
  const oldRankings = rankings.filter(({ id }) => id !== userId);

  rankingToBeUpdate.score = newScore;

  saveRanking([...oldRankings, rankingToBeUpdate]);
};

export const getToken = () => {
  let ranking = readToken();

  if (ranking === null) {
    ranking = '';
  }

  return ranking;
};

export const createToken = (token) => {
  saveToken(token);
};

export const clearLocalStorage = () => localStorage.clear();
