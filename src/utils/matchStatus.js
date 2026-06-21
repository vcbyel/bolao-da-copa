export function getMatchStatus(match) {
  const now = new Date();

  const startDate = new Date(
    `${match.data}T${match.hora}:00`
  );

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