export function getMatchStatus(match) {
  if (!match?.match_date) {
    return "scheduled";
  }

  const now = new Date();

  const startDate = new Date(match.match_date);
  

  const endDate = new Date(
    startDate.getTime() + 2 * 60 * 60 * 1000
  );

  
  if (now < startDate) {
    return "scheduled";
  }

  if (now >= startDate && now < endDate) {
    return "live";
  }

  
  return "finished";
}