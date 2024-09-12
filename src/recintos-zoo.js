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

    const recintosViaveis = recintos
      .filter((recinto) => {
        const {
          tamanho: tamanhoMaximo,
          bioma,
          animais: animaisNoRecinto,
        } = recinto;
        let tamanhoTotalAnimais = 0;
        let possuiCarnivoro = false;
        let possuiOutraEspecie = false;

        const biomaEhAdequado =
          RequisitosAnimal[animal].biomas.includes(bioma) ||
          (animal === Animal.MACACO && bioma === "savana e rio");

        if (!biomaEhAdequado) return false;

        for (const [animalNoRecinto, quantidadeNoRecinto] of Object.entries(
          animaisNoRecinto
        )) {
          const requisitos = RequisitosAnimal[animalNoRecinto];
          if (requisitos) {
            tamanhoTotalAnimais += requisitos.tamanho * quantidadeNoRecinto;
            if (
              [Animal.LEAO, Animal.LEOPARDO, Animal.CROCODILO].includes(
                animalNoRecinto
              )
            ) {
              possuiCarnivoro = true;
            }
            if (animalNoRecinto !== animal) {
              possuiOutraEspecie = true;
            }
          }
        }

        if (animal === Animal.HIPOPOTAMO && bioma !== "savana e rio")
          return false;
        if (
          animal === Animal.MACACO &&
          Object.keys(animaisNoRecinto).length === 0 &&
          quantidade <= 1
        )
          return false;
        if (
          possuiCarnivoro &&
          ![Animal.LEAO, Animal.LEOPARDO, Animal.CROCODILO].includes(animal)
        )
          return false;

        const tamanhoNecessario =
          RequisitosAnimal[animal].tamanho * quantidade +
          (possuiOutraEspecie ? 1 : 0);
        tamanhoTotalAnimais += tamanhoNecessario;

        return tamanhoMaximo >= tamanhoTotalAnimais;
      })
      .map((recinto) => {
        const {
          id,
          tamanho: tamanhoMaximo,
          animais: animaisNoRecinto,
        } = recinto;
        let tamanhoTotalAnimais = 0;
        let possuiOutraEspecie = false;

        for (const [animalNoRecinto, quantidadeNoRecinto] of Object.entries(
          animaisNoRecinto
        )) {
          const requisitos = RequisitosAnimal[animalNoRecinto];
          if (requisitos) {
            tamanhoTotalAnimais += requisitos.tamanho * quantidadeNoRecinto;
            if (animalNoRecinto !== animal) {
              possuiOutraEspecie = true;
            }
          }
        }

        const tamanhoNecessario =
          RequisitosAnimal[animal].tamanho * quantidade +
          (possuiOutraEspecie ? 1 : 0);
        tamanhoTotalAnimais += tamanhoNecessario;

        const espacoLivre = tamanhoMaximo - tamanhoTotalAnimais;
        return `Recinto ${id} (espaço livre: ${espacoLivre} total: ${tamanhoMaximo})`;
      });

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável", recintosViaveis: false };
    }

    return { erro: false, recintosViaveis };
  }
}

export { RecintosZoo as RecintosZoo };
