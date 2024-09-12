const Animal = {
  MACACO: "MACACO",
  LEAO: "LEAO",
  LEOPARDO: "LEOPARDO",
  CROCODILO: "CROCODILO",
  GAZELA: "GAZELA",
  HIPOPOTAMO: "HIPOPOTAMO",
};

const RequisitosAnimal = {
  [Animal.LEAO]: { tamanho: 3, biomas: ["savana"] },
  [Animal.LEOPARDO]: { tamanho: 2, biomas: ["savana"] },
  [Animal.CROCODILO]: { tamanho: 3, biomas: ["rio"] },
  [Animal.MACACO]: { tamanho: 1, biomas: ["savana", "floresta"] },
  [Animal.GAZELA]: { tamanho: 2, biomas: ["savana"] },
  [Animal.HIPOPOTAMO]: { tamanho: 4, biomas: ["savana", "rio"] },
};

const recintos = [
  { id: 1, bioma: "savana", tamanho: 10, animais: { MACACO: 3 } },
  { id: 2, bioma: "floresta", tamanho: 5, animais: {} },
  { id: 3, bioma: "savana e rio", tamanho: 7, animais: { GAZELA: 1 } },
  { id: 4, bioma: "rio", tamanho: 8, animais: {} },
  { id: 5, bioma: "savana", tamanho: 9, animais: { LEAO: 1 } },
];

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    if (!animal || animal.length === 0) {
      return { erro: "Animal em branco", recintosViaveis: false };
    }

    if (!RequisitosAnimal[animal]) {
      return { erro: "Animal inválido", recintosViaveis: false };
    }

    if (quantidade <= 0) {
      return { erro: "Quantidade inválida", recintosViaveis: false };
    }

    const viableEnclosures = recintos
      .filter((enclosure) => {
        const {
          tamanho: maxSize,
          bioma: biome,
          animais: animalsInEnclosure,
        } = enclosure;
        let totalAnimalSize = 0;
        let hasCarnivore = false;
        let hasOtherSpecies = false;

        const biomeIsSuitable =
          RequisitosAnimal[animal].biomas.includes(biome) ||
          (animal === Animal.MACACO && biome === "savana e rio");

        if (!biomeIsSuitable) return false;

        for (const [animalInEnclosure, quantityInEnclosure] of Object.entries(
          animalsInEnclosure
        )) {
          const requirements = RequisitosAnimal[animalInEnclosure];
          if (requirements) {
            totalAnimalSize += requirements.tamanho * quantityInEnclosure;
            if (
              [Animal.LEAO, Animal.LEOPARDO, Animal.CROCODILO].includes(
                animalInEnclosure
              )
            ) {
              hasCarnivore = true;
            }
            if (animalInEnclosure !== animal) {
              hasOtherSpecies = true;
            }
          }
        }

        if (animal === Animal.HIPOPOTAMO && biome !== "savana e rio")
          return false;
        if (
          animal === Animal.MACACO &&
          Object.keys(animalsInEnclosure).length === 0 &&
          quantidade <= 1
        )
          return false;
        if (
          hasCarnivore &&
          ![Animal.LEAO, Animal.LEOPARDO, Animal.CROCODILO].includes(animal)
        )
          return false;

        const requiredSize =
          RequisitosAnimal[animal].tamanho * quantidade +
          (hasOtherSpecies ? 1 : 0);
        totalAnimalSize += requiredSize;

        return maxSize >= totalAnimalSize;
      })
      .map((enclosure) => {
        const { id, tamanho: maxSize, animais: animalsInEnclosure } = enclosure;
        let totalAnimalSize = 0;
        let hasOtherSpecies = false;

        for (const [animalInEnclosure, quantityInEnclosure] of Object.entries(
          animalsInEnclosure
        )) {
          const requirements = RequisitosAnimal[animalInEnclosure];
          if (requirements) {
            totalAnimalSize += requirements.tamanho * quantityInEnclosure;
            if (animalInEnclosure !== animal) {
              hasOtherSpecies = true;
            }
          }
        }

        const requiredSize =
          RequisitosAnimal[animal].tamanho * quantidade +
          (hasOtherSpecies ? 1 : 0);
        totalAnimalSize += requiredSize;

        const freeSpace = maxSize - totalAnimalSize;
        return `Recinto ${id} (espaço livre: ${freeSpace} total: ${maxSize})`;
      });

    if (viableEnclosures.length === 0) {
      return { erro: "Não há recinto viável", recintosViaveis: false };
    }

    return { erro: false, recintosViaveis: viableEnclosures };
  }
}

export { RecintosZoo as RecintosZoo };
