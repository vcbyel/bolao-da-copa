export function generateGroupStandings(matches) {
  const groups = {};

  matches.forEach((match) => {
    if (match.status !== "finished") return;

    const group = match.id.charAt(0).toUpperCase();

    if (!groups[group]) {
      groups[group] = {};
    }

    const home = match.home_team;
    const away = match.away_team;

    if (!groups[group][home]) {
      groups[group][home] = {
        team: home,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        gd: 0,
      };
    }

    if (!groups[group][away]) {
      groups[group][away] = {
        team: away,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        gd: 0,
      };
    }

    groups[group][home].gf += match.home_result;
    groups[group][home].ga += match.away_result;

    groups[group][away].gf += match.away_result;
    groups[group][away].ga += match.home_result;

    if (match.home_result > match.away_result) {
      groups[group][home].points += 3;
      groups[group][home].wins++;

      groups[group][away].losses++;
    } else if (match.home_result < match.away_result) {
      groups[group][away].points += 3;
      groups[group][away].wins++;

      groups[group][home].losses++;
    } else {
      groups[group][home].points += 1;
      groups[group][away].points += 1;

      groups[group][home].draws++;
      groups[group][away].draws++;
    }
  });

  Object.keys(groups).forEach((group) => {
    groups[group] = Object.values(groups[group])
      .map((team) => ({
        ...team,
        gd: team.gf - team.ga,
      }))
      .sort((a, b) => {
        if (b.points !== a.points)
          return b.points - a.points;

        if (b.gd !== a.gd)
          return b.gd - a.gd;

        return b.gf - a.gf;
      });
  });

  console.log("GRUPO B");
console.table(groups["B"]);


 
  return groups;
  
}