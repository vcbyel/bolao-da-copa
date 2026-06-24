export function getBestThirdPlaced(groups) {
  const thirds = [];

  Object.entries(groups).forEach(([groupLetter, teams]) => {
    const thirdPlace = teams[2];

    if (!thirdPlace) return;

    thirds.push({
      group: groupLetter,
      ...thirdPlace,
    });
  });

  return thirds
    .sort((a, b) => {
      if (b.points !== a.points)
        return b.points - a.points;

      if (b.gd !== a.gd)
        return b.gd - a.gd;

      return b.gf - a.gf;
    })
    .slice(0, 8);
}