import {
  Csv,
  ShapedCsvRow,
  ConvertFunctions,
  EquivalenceType,
  Material,
  materials0,
  types,
} from '../interfaces/CsvInterface';
import PdfBuilder from './PdfGenerator';

export const parseCSV = (csvData: string): Csv[] => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(';').map((header) => header.trim()); // Utilisation de ';' comme délimiteur
  const data: Csv[] = [];

  // Modifier la condition pour inclure la dernière ligne
  for (let i = 1; i <= lines.length - 1; i++) {
    const values = lines[i].split(';');
    const entry: Record<string, string | number> = {};
    for (let j = 0; j < headers.length; j++) {
      if (headers[j] != 'clientCode' && headers[j] != 'siteName')
        entry[headers[j]] = Number(values[j].trim());
      else entry[headers[j]] = values[j].trim();
    }

    data.push(entry as unknown as Csv);
  }

  return data;
};

const convert: ConvertFunctions = {
  DEEE: {
    kwhEquivalent: (value: number) => {
      return value * 1500;
    },
    co2Equivalent: (value: number) => {
      return value * 2; // tonnes
    },
  },

  bulbs: {
    kwhEquivalent: (value: number) => {
      return value * 0.6 * 1200;
    },
    mercuryEquivalent: (value: number) => {
      return (value * 25000 * 4) / 1000; //grammes
    },
  },

  plastic: {
    petrolBarrelsEquivalent: (value: number) => {
      return (value * 610) / 136; // kg de pétrole économisés convertis en barils (1 baril ≈ 136 kg)
    },
    petrolEquivalent: (value: number) => {
      return value * 610; // kg de pétrole par tonne de plastique
    },
    /*     co2Equivalent: (value: number) => {
      return value * 2.9; // 2.9 tonnes de CO2 par tonne de plastique
    },
    kwhEquivalent: (value: number) => {
      return value * 10960; // kWh économisés par tonne de plastique
    }, */
  },

  steel: {
    garbageDumpsterEquivalent: (value: number) => {
      return value / 1.2;
    },
    co2Equivalent: (value: number) => {
      return value * 1.78; //tonnes
    },
  },
  organicWaste: {
    mealsPerDayEquivalent: (value: number) => {
      return value * 20;
    },
  },
  paper: {
    waterEquivalent: (value: number) => {
      return value * 48.2;
    },
    treesEquivalent: (value: number) => {
      return value * 18;
    },
  },

  textile: {
    waterEquivalent: (value: number) => {
      return value * 10000; // m3
    },
    co2Equivalent: (value: number) => {
      return value * 3.6; //tonnes
    },
  },

  aluminum: {
    co2Equivalent: (value: number) => {
      return value * 7.5; //kg
    },
    bikesEquivalent: (value: number) => {
      return value * 200; //number of bike
    },
  },

  glass: {
    sandEquivalent: (value: number) => {
      return value * 0.7 * 1000; //kg
    },
    co2Equivalent: (value: number) => {
      return value * 0.315; //tonnes
    },
    kwhEquivalent: (value: number) => {
      return value * 1200;
    },
  },

  electronics: {
    kwhEquivalent: (value: number) => {
      return value * 1500;
    },
    co2Equivalent: (value: number) => {
      return value * 2;
    },
  },

  wood: {
    woodEquivalent: (value: number) => {
      return value * 1.5;
    },
  },

  cardboard: {
    waterEquivalent: (value: number) => {
      return value * 27.5;
    },

    olympicSwimmingPoolsEquivalent: (value: number) => {
      return (value * 27.5) / 2300;
    },
  },

  // Ajout des équivalences pour les pneus
  tires: {
    rubberEquivalent: (value: number) => {
      return value * 700; // kg de caoutchouc économisé par tonne de pneus recyclés
    },
  },

  // Ajout des équivalences pour les végétaux
  vegetals: {
    compostEquivalent: (value: number) => {
      return value * 400; // kg de compost produit par tonne de végétaux valorisés (moyenne entre 300 et 500 kg)
    },
  },
};

export function equivalenceCalcul(data: Csv[]): ShapedCsvRow[] {
  if (!data) return [];

  return data.map((row: Csv) => {
    const materials: Material[] = [];

    const missingKeys = Object.keys(materials0)
      .filter((key) => !(key in row))
      .reduce((acc, curr) => {
        acc[curr] = 0;
        return acc;
      }, {} as { [key: string]: number });

    const rowCompleted = { ...row, ...missingKeys };

    types.forEach((type) => {
      if (!(rowCompleted as Csv).hasOwnProperty(type)) {
        // TODO: log error
        return;
      }

      const quantity = Number(rowCompleted[type]);
      if (!convert[type as EquivalenceType]) {
        // TODO log error
        return;
      }
      const listOfEqui = Object.keys(convert[type as EquivalenceType]);

      materials.push({
        code: type,
        name: type,
        quantity,
        equivalences: listOfEqui.map((equi) => {
          return {
            code: equi,
            name: equi,
            quantity:
              Math.round(
                convert[type as EquivalenceType][equi](quantity) * 10
              ) / 10,
            draw: () => {
              //
            },
          };
        }),
      });
    });

    // Trier les matériaux par quantité décroissante
    const sortedMaterials = materials.sort((a, b) => b.quantity - a.quantity);

    // Sélectionner les 6 premiers matériaux ou tous les matériaux si leur nombre est inférieur à 6
    const topMaterials = sortedMaterials.slice(
      0,
      Math.min(6, sortedMaterials.length)
    );

    const csv: ShapedCsvRow = {
      siteName: rowCompleted.siteName,
      year: rowCompleted.year,
      clientCode: rowCompleted.clientCode,
      sortingRate: rowCompleted.sortingRate,
      recyclableWasteTonnage: rowCompleted.recyclableWasteTonnage,
      wasteTonnage: rowCompleted.wasteTonnage,
      materials: topMaterials,
    };

    return csv;
  });
}

export async function pdfGenerator(params: ShapedCsvRow[]) {
  for (const param of params) {
    await generateSinglePDF(param);
  }
}

// Nouvelle fonction pour générer un PDF pour un seul paramètre
async function generateSinglePDF(data: ShapedCsvRow) {
  return new Promise<void>((resolve) => {
    const pdf = PdfBuilder(data);
    pdf();
    resolve();
  });
}
