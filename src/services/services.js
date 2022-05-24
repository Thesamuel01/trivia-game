const RANKING_KEY = 'ranking';
const TOKEN_KEY = 'token';

const readRanking = () => JSON.parse(localStorage.getItem(RANKING_KEY));
const saveRanking = (ranking) => localStorage
  .setItem(RANKING_KEY, JSON.stringify(ranking));
const readToken = () => JSON
  .parse(localStorage.getItem(TOKEN_KEY));
const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const createRanking = ({ name, score, picture }) => {
  const ranking = {
    name,
    score,
    picture,
  };

  saveRanking([{ ...ranking }]);
};

export const getRanking = () => {
  let ranking = readRanking();

  if (ranking === null) {
    ranking = [];
  }

  return ranking;
};

export const updateScore = (newScore, userName) => {
  const rankings = readRanking();
  const rankingToBeUpdate = rankings.filter(({ name }) => name === userName);
  const oldRankings = rankings.filter(({ name }) => name !== userName);
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
