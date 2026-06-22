export function groupMatches(matches) {
  const groups = {};

  matches.forEach((match) => {
    // ignora mata-mata
    if (match.stage !== "GROUP") return;

    const letter = match.id.charAt(0).toUpperCase();

    if (!groups[letter]) {
      groups[letter] = {
        nome: `Grupo ${letter}`,
        partidas: [],
      };
    }

    groups[letter].partidas.push(match);
  });

  return groups;
}