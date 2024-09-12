class RecintosZoo {
  constructor() {
    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanho: 10,
        animais: [{ especie: "MACACO", quantidade: 3 }],
      },
      { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanho: 7,
        animais: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
      {
        numero: 5,
        bioma: "savana",
        tamanho: 9,
        animais: [{ especie: "LEAO", quantidade: 1 }],
      },
    ];

    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"] },
      LEOPARDO: { tamanho: 2, biomas: ["savana"] },
      CROCODILO: { tamanho: 3, biomas: ["rio"] },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
      GAZELA: { tamanho: 2, biomas: ["savana"] },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
    };
  }

  analisaRecintos(animal, quantidade) {
    if (!this.animais[animal]) {
      return { erro: "Animal inválido", recintosViaveis: null };
    }

    if (quantidade <= 0) {
      return { erro: "Quantidade inválida", recintosViaveis: null };
    }

    const especie = this.animais[animal];
    const recintosViaveis = [];

    for (const recinto of this.recintos) {
      let espacoOcupado = 0;
      for (const a of recinto.animais) {
        espacoOcupado += this.animais[a.especie].tamanho * a.quantidade;
      }

      let espacoNecessario = especie.tamanho * quantidade;
      if (recinto.animais.length > 0) {
        espacoNecessario += 1;
      }

      if (
        recinto.bioma.includes(especie.biomas) &&
        recinto.tamanho - espacoOcupado >= espacoNecessario
      ) {
        if (this.verificaRegrasEspecificas(recinto, animal, quantidade)) {
          recintosViaveis.push(
            `Recinto ${recinto.numero} (espaço livre: ${
              recinto.tamanho - espacoOcupado - espacoNecessario
            } total: ${recinto.tamanho})`
          );
        }
      }
    }

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável", recintosViaveis: null };
    }

    return { erro: null, recintosViaveis };
  }

  verificaRegrasEspecificas(recinto, animal, quantidade) {
    const animaisExistentes = recinto.animais.map((a) => a.especie);
    const isCarnivoro = ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal);

    if (
      isCarnivoro &&
      animaisExistentes.length > 0 &&
      !animaisExistentes.includes(animal)
    ) {
      return false;
    }

    if (animal === "HIPOPOTAMO" && recinto.bioma !== "savana e rio") {
      return false;
    }

    if (
      animal === "MACACO" &&
      quantidade === 1 &&
      recinto.animais.length === 0
    ) {
      return false;
    }

    return true;
  }
}

export { RecintosZoo as RecintosZoo };
