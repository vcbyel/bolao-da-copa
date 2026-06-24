import { getBestThirdPlaced } from "./getBestThirdPlaced";

export function getQualifiedTeams(groups) {
  
  const qualified = {};

  Object.entries(groups).forEach(([groupLetter, teams]) => {
    const first = teams[0];
    const second = teams[1];
    const third = teams[2];

    if (first) {
      qualified[`${groupLetter}1`] = {
        group: groupLetter,
        position: 1,
        ...first,
      };
    }

    if (second) {
      qualified[`${groupLetter}2`] = {
        group: groupLetter,
        position: 2,
        ...second,
      };
    }

    if (third) {
      qualified[`${groupLetter}3`] = {
        group: groupLetter,
        position: 3,
        ...third,
      };
    }
  });
  const bestThirds = getBestThirdPlaced(groups);

console.log("BEST THIRDS");
  console.table(bestThirds);
  
  qualified["T3_ABCDF"] = bestThirds[0];
  qualified["T3_CDFGH"] = bestThirds[1];
  qualified["T3_BEFIJ"] = bestThirds[2];
  qualified["T3_AEHIJ"] = bestThirds[3];
  qualified["T3_CEFHI"] = bestThirds[4];
  qualified["T3_EHIJK"] = bestThirds[5];
  qualified["T3_EFGIJ"] = bestThirds[6];
  qualified["T3_DEIJL"] = bestThirds[7];
  return qualified;
}