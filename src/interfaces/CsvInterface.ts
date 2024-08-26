export interface CsvFrench {
  // Infos client

  codeClient: string;
  nomDuSite: string;
  annee?: number;

  // Taux global

  tonnageDechets?: number;
  tonnageDechetsRecyclable?: number;
  tauxDeTri?: number; // En pourcentage

  // Matières en tonnes

  DEEE?: number;
  plastique?: number;
  carton?: number;
  acier?: number;
  bois?: number;
  bioDechets?: number;
  ampoules?: number;
  textile?: number;
  papier?: number;
  alluminium?: number;
  verre?: number;
  electronique?: number;
  pneus?: number; // Ajout de la catégorie pneus
  vegetaux?: number; // Ajout de la catégorie végétaux

  // Equivalences

  equivalenceKwh?: number; // kwH d'electricité economisé
  equivalenceBois?: number; // En tonnes
  equivalenceEau?: number; // En m3 d'eau / tonnes de cartons * 50
  equivalenceArbres?: number; // Nombre d'arbres / papier * 18
  equivalenceOxygene?: number; // En tonnes
  equivalencePetrole?: number; // En kilogrammes / pastique * 700
  equivalenceBarilsPetrole?: number; // plastique * 5
  equivalenceEnergieFrigo?: number; // En années
  equivalenceEnergieFoyer?: number; // En années pour 2 personnes
  equivalenceEnergieUnePersonne?: number; // En mois
  equivalenceParisMarseille?: number; // En nombre de voitures
  equivalenceConsommationEauUnePersonne?: number; // En mois
  equivalencePiscinesOlympiques?: number; // equivalenceEau / 2300
  equivalenceBoitePizza?: number;
  equivalenceCompost?: number; // En kilogrammes / bioDechets * 0.5
  equivalenceCo2?: number; // En kilogrammes
  equivalenceParisNewYork?: number;
  equivalenceDouches?: number; // En année pour une personnes
  equivalenceBains?: number;
  equivalenceVelos?: number; // Nombre de vélos de courses
  equivalenceSable?: number; // En kilogrammes / verre * 0.7
  equivalenceBenneOrdure?: number;
  equivalenceRepas?: number;
  equivalenceMercure?: number;
  equivalenceCaoutchouc?: number; // En kilogrammes pour pneus
}

export interface Csv {
  // Customer information
  clientCode: string;
  siteName: string;
  year?: number;

  // Global rates
  wasteTonnage?: number;
  recyclableWasteTonnage?: number;
  sortingRate?: number; // In percentage

  // Materials in tons
  DEEE?: number;
  plastic?: number;
  bulbs?: number;
  cardboard?: number;
  steel?: number;
  wood?: number;
  organicWaste?: number;
  textile?: number;
  paper?: number;
  aluminum?: number;
  glass?: number;
  electronics?: number;
  tires?: number; // Ajout de la catégorie pneus
  vegetals?: number; // Ajout de la catégorie végétaux
}

// Post traitements

export type MaterialType =
  | 'DEEE'
  | 'plastic'
  | 'cardboard'
  | 'bulbs'
  | 'steel'
  | 'wood'
  | 'organicWaste'
  | 'textile'
  | 'paper'
  | 'aluminum'
  | 'glass'
  | 'electronics'
  | 'tires' // Ajout de la catégorie pneus
  | 'vegetals'; // Ajout de la catégorie végétaux

export const types: MaterialType[] = [
  'DEEE',
  'plastic',
  'cardboard',
  'bulbs',
  'steel',
  'wood',
  'organicWaste',
  'textile',
  'paper',
  'aluminum',
  'glass',
  'electronics',
  'tires', // Ajout de la catégorie pneus
  'vegetals', // Ajout de la catégorie végétaux
];

export type EquivalenceType =
  | 'kwhEquivalent' // kWh of saved electricity                          *
  | 'woodEquivalent' // In tons                          *
  | 'waterEquivalent' // In m3 of water / tons of cardboard * 50                          *
  | 'treesEquivalent' // Number of trees / paper * 18                          *
  | 'oxygenEquivalent' // In tons                          *
  | 'petrolEquivalent' // In kilograms / plastic * 700                          *
  | 'petrolBarrelsEquivalent' // plastic * 5                           *
  | 'fridgeEnergyEquivalent' // In years                          *
  | 'homeEnergyEquivalent' // In years for 2 people                          *
  | 'OlympicSwimmingPoolsEquivalent' // waterEquivalent / 2300                          *
  | 'pizzaBoxEquivalent' //                           *
  | 'compostEquivalent' // In kilograms / organicWaste * 0.5                           *
  | 'co2Equivalent' // In kilograms                                     *
  | 'ParisToNewYorkEquivalent' //                           *
  | 'showersEquivalent' // In years for one person                          *
  | 'bikesEquivalent' // Number of racing bikes                          *
  | 'sandEquivalent' // In kilograms / glass * 0.7                          *
  | 'mercuryEquivalent' // In grams                          *
  | 'bathsEquivalent'
  | 'garbageDumpsterEquivalent'
  | 'mealsPerDayEquivalent'
  | 'singlePersonEnergyEquivalent' // In months
  | 'ParisToMarseilleEquivalent' // Number of cars
  | 'singlePersonWaterConsumptionEquivalent' // In months
  | 'rubberEquivalent'; // En kilogrammes pour pneus

export interface ShapedCsvRow {
  // Customer information
  clientCode: string;
  siteName: string;
  year?: number;

  // Global rates
  wasteTonnage?: number;
  recyclableWasteTonnage?: number;
  sortingRate?: number; // In percentage

  materials: Material[];
}

export interface Material {
  code: string;
  name: string;
  quantity: number; //
  equivalences: Equivalence[];
}

export interface Equivalence {
  code: string;
  name: string;
  quantity: number;
  draw: () => void;
}

export interface ConvertFunctions {
  [key: string]: {
    [key: string]: (value: number) => number;
  };
}

interface Row {
  columnName: string;
  dataType: string;
  description: string;
  example: string;
}

import { QTableColumn } from 'quasar';

export const columns: QTableColumn[] = [
  {
    name: 'columnName',
    required: true,
    label: 'Nom de la colonne (excel)',
    align: 'left',
    field: (row: Row) => row.columnName,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  {
    name: 'dataType',
    align: 'center',
    label: 'Type de données',
    field: (row: Row) => row.dataType,
    sortable: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: (row: Row) => row.description,
  },
  {
    name: 'example',
    label: 'Exemple',
    field: (row: Row) => row.example,
  },
];

export const rows = [
  {
    columnName: 'clientCode',
    dataType: 'Chaîne de caractères',
    description: 'Code unique du client.',
    example: 'HXTDJ7',
  },
  {
    columnName: 'siteName',
    dataType: 'Chaîne de caractères',
    description: "Nom du site de l'entreprise.",
    example: 'Truffault',
  },
  {
    columnName: 'wasteTonnage',
    dataType: 'Nombre',
    description: 'Quantité totale de déchets en tonnes.',
    example: '78',
  },
  {
    columnName: 'recyclableWasteTonnage',
    dataType: 'Nombre',
    description: 'Quantité de déchets recyclables en tonnes.',
    example: '45',
  },
  {
    columnName: 'sortingRate',
    dataType: 'Nombre',
    description: 'Taux de tri des déchets, exprimé en pourcentage.',
    example: '75',
  },
  {
    columnName: 'DEEE',
    dataType: 'Nombre',
    description: 'Quantité de déchets DEEE en tonnes.',
    example: '4',
  },
  {
    columnName: 'plastic',
    dataType: 'Nombre',
    description: 'Quantité de plastique recyclé en tonnes.',
    example: '5',
  },
  {
    columnName: 'cardboard',
    dataType: 'Nombre',
    description: 'Quantité de carton recyclé en tonnes.',
    example: '12',
  },
  {
    columnName: 'steel',
    dataType: 'Nombre',
    description: "Quantité d'acier recyclé en tonnes.",
    example: '4',
  },
  {
    columnName: 'wood',
    dataType: 'Nombre',
    description: 'Quantité de bois recyclé en tonnes.',
    example: '65',
  },
  {
    columnName: 'organicWaste',
    dataType: 'Nombre',
    description: 'Quantité de déchets organiques recyclés en tonnes.',
    example: '8',
  },
  {
    columnName: 'bulbs',
    dataType: 'Nombre',
    description: "Quantité d'ampoules recyclées en tonnes.",
    example: '6',
  },
  {
    columnName: 'textile',
    dataType: 'Nombre',
    description: 'Quantité de textile recyclé en tonnes.',
    example: '14',
  },
  {
    columnName: 'paper',
    dataType: 'Nombre',
    description: 'Quantité de papier recyclé en tonnes.',
    example: '24',
  },
  {
    columnName: 'aluminum',
    dataType: 'Nombre',
    description: "Quantité d'aluminium recyclé en tonnes.",
    example: '5',
  },
  {
    columnName: 'glass',
    dataType: 'Nombre',
    description: 'Quantité de verre recyclé en tonnes.',
    example: '4',
  },
  {
    columnName: 'electronics',
    dataType: 'Nombre',
    description: 'Quantité de déchets électroniques recyclés en tonnes.',
    example: '2',
  },
];

export const materials0 = {
  DEEE: 0,
  aluminum: 0,
  plastic: 0,
  cardboard: 0,
  steel: 0,
  wood: 0,
  organicWaste: 0,
  bulbs: 0,
  textile: 0,
  paper: 0,
  glass: 0,
  electronics: 0,
  tires: 0, // Ajout de la catégorie pneus
  vegetals: 0, // Ajout de la catégorie végétaux
};
