export function calculatePoints(
  betHome,
  betAway,
  resultHome,
  resultAway
) {
  // Acertou placar exato
  if (
    betHome === resultHome &&
    betAway === resultAway
  ) {
    return 10;
  }

  const betDiff = betHome - betAway;
  const resultDiff = resultHome - resultAway;

  // Acertou vencedor ou empate
  if (
    (betDiff > 0 && resultDiff > 0) ||
    (betDiff < 0 && resultDiff < 0) ||
    (betDiff === 0 && resultDiff === 0)
  ) {
    return 5;
  }

  return 0;
}