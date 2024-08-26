<template>
  <section class="page" :class="$q.screen.lt.md ? 'column' : 'row'">
    <section class="col q-gutter-y-md q-pa-xl">
      <span class="text-h5">Documentation CSV pour la génération d'un PDF</span>

      <q-table
        class="q-ma-md"
        flat
        bordered
        :rows-per-page-options="[7]"
        title="Modèle à respecter"
        dense
        :rows="rows"
        :columns="columns"
        row-key="name"
      />

      <span class="text-h5">Remarques :</span>
      <ul class="q-gutter-y-md">
        <li>
          Chaque ligne du fichier CSV
          <b
            >représente les données d'une entreprise pour un site spécifique.</b
          >
        </li>
        <li>
          Les en-têtes de colonnes doivent correspondre exactement aux
          <b>noms des colonne du tableau ci-dessus.</b>
        </li>
        <li>
          Les valeurs doivent être fournies dans les unités spécifiées (tonnes
          pour les quantités de déchets).
        </li>
        <li>
          Les valeurs numériques doivent être fournies sous forme de nombres
          <b>entiers</b> ou <b>décimaux</b>, sans séparateurs de milliers, et
          utilisant<b> un point comme séparateur décimal.</b>
        </li>
        <li>
          Assurez-vous que le fichier CSV est <b>encodé en UTF-8</b> pour
          prendre en charge les caractères spéciaux.
        </li>
      </ul>
    </section>
    <q-separator vertical></q-separator>
    <section class="col column items-center">
      <div class="q-ma-lg col-grow">
        <q-file
          class="col q-mt-xl"
          filled
          bottom-slots
          v-model="csvFile"
          label="Fichier Csv"
          @update:model-value="handleFileUpload"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="csvFile = null"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint>{{}}</template>
        </q-file>
        <q-btn rounded @click="onCalculate" label="Télécharger"
          ><q-icon color="primary" class="q-ml-md" name="download"></q-icon
        ></q-btn>
      </div>
      <div v-if="jsonData">
        <pre>{{ jsonData }}</pre>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PdfBuilder from './PdfGenerator';
import { parseCSV, equivalenceCalcul } from './utils';
import { Csv, ShapedCsvRow, columns, rows } from '../interfaces/CsvInterface';

const csvFile = ref<File | null>(null);
const jsonData = ref<string>('');
const objectData = ref<Csv[]>();

const handleFileUpload = () => {
  if (csvFile.value) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === 'string') {
        const csvData = event.target.result;
        objectData.value = parseCSV(csvData);
        jsonData.value = JSON.stringify(objectData.value, null, 2);
      }
    };
    reader.readAsText(csvFile.value);
  }
};

function onCalculate() {
  if (!objectData.value) return;

  pdfGenerator(equivalenceCalcul(objectData.value));
}

async function pdfGenerator(params: ShapedCsvRow[]) {
  for (let i = 0; i < params.length; i++) {
    await generatePDFWithDelay(params[i]);
  }
}

// Le navigateur limite à 10 le nombre de pdf généré en simultanné utilisation d'un set time out pour resoudre le problème
function generatePDFWithDelay(param: ShapedCsvRow) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const pdf = PdfBuilder(param);
      pdf();
      resolve();
    }, 50);
  });
}
</script>
<i18n>
  {
    'fr-FR': {
     materials: {
        DEEE: 'tonnes de DEEE',
        plastic: 'tonnes de plastique',
        cardboard: 'tonnes de carton',
        tires: 'tonnes de pneu',
        steel: "tonnes d'acier",
        wood: 'tonnes de bois',
        organicWaste: 'tonnes de matière organique',
        bulbs: "tonnes d'ampoule",
        textile: 'tonnes de textile',
        paper: 'tonnes de papier',
        aluminum: 'tonnes de alluminium',
        glass: 'tonnes de verre',
        electronics: 'tonnes de déchêts électronique'
    }
    }
  }
</i18n>
