const RANKING_KEY = 'ranking';
const TOKEN_KEY = 'token';
// const ASSETION_KEY = 'assertion';

const readRanking = () => JSON.parse(localStorage.getItem(RANKING_KEY));
const saveRanking = (ranking) => localStorage
  .setItem(RANKING_KEY, JSON.stringify(ranking));
const readToken = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getRanking = () => {
  let ranking = readRanking();

  if (ranking === null) {
    ranking = [];
  }

  return ranking;
};

export const addRanking = (ranking) => {
  const oldRankings = getRanking();
  const rankings = oldRankings === null ? [ranking] : [...oldRankings, ranking];

  saveRanking(rankings);
};

export const updateRankig = (newScore, assertions, { id: userId }) => {
  const rankings = readRanking();
  const rankingToBeUpdate = rankings.find(({ id }) => id === userId);
  const oldRankings = rankings.filter(({ id }) => id !== userId);

  rankingToBeUpdate.score = newScore;
  rankingToBeUpdate.assertions = assertions;

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

export const updateRefreshState = (ranking) => {
  const oldRankings = readRanking().filter(({ id }) => id !== ranking.id);
  ranking.gotRefresh = true;

  saveRanking([...oldRankings, ranking]);
};

export const sortRanking = (data) => {
  const NUMBER = -1;
  data.sort((a, b) => {
    if (a.score > b.score) return NUMBER;
    if (a.score < b.score) return 1;
    return 0;
  });

  return data;
};
