<template>
  <section class="column items-center justify-center">
    <q-form @submit="submitForm" style="width: 40vw">
      <section class="column q-col-gutter-xl">
        <div class="col">
          <span class="text-h6 text-grey-9"
            ><q-icon name="info" /> Informations générale</span
          >
          <q-separator class="q-mb-md" horizontal></q-separator>
          <q-input
            required
            dense
            v-model="formData.clientCode"
            label="Code client"
          />
          <q-input
            dense
            required
            v-model="formData.siteName"
            label="Nom du site"
          />
          <q-input
            dense
            v-model="formData.wasteTonnage"
            label="Tonnage de déchets"
            type="number"
          />
          <q-input
            dense
            v-model="formData.recyclableWasteTonnage"
            label="Tonnage de déchets recyclables"
            type="number"
          />
          <q-input
            dense
            v-model="formData.sortingRate"
            label="Taux de tri"
            type="number"
          />
          <q-input dense v-model="formData.year" label="Année" type="number" />
        </div>

        <div class="col">
          <span class="text-h6 text-grey-9">
            <q-icon name="recycling" /> Déchêts traités en tonnes</span
          >
          <q-separator class="q-mb-md" horizontal></q-separator>
          <div class="row q-gutter-x-xl">
            <div class="col">
              <q-input
                dense
                v-model="formData.DEEE"
                label="Déchets d'équipements électriques et électroniques"
                type="number"
              />
              <q-input
                dense
                v-model="formData.plastic"
                label="Plastique"
                type="number"
              />
              <q-input
                dense
                v-model="formData.cardboard"
                label="Carton"
                type="number"
              />
              <q-input
                dense
                v-model="formData.steel"
                label="Acier"
                type="number"
              />
              <q-input
                dense
                v-model="formData.wood"
                label="Bois"
                type="number"
              />
              <q-input
                dense
                v-model="formData.organicWaste"
                label="Déchets organiques"
                type="number"
              />
            </div>
            <div class="col">
              <q-input
                dense
                v-model="formData.bulbs"
                label="Ampoules"
                type="number"
              />
              <q-input
                dense
                v-model="formData.textile"
                label="Textile"
                type="number"
              />
              <q-input
                dense
                v-model="formData.paper"
                label="Papier"
                type="number"
              />
              <q-input
                dense
                v-model="formData.aluminum"
                label="Aluminium"
                type="number"
              />
              <q-input
                dense
                v-model="formData.glass"
                label="Verre"
                type="number"
              />
              <q-input
                dense
                v-model="formData.electronics"
                label="Électroniques"
                type="number"
              />
              <q-input
                dense
                v-model="formData.tires"
                label="Pneu"
                type="number"
              />
              <q-input
                dense
                v-model="formData.vegetals"
                label="Végetaux"
                type="number"
              />
            </div>
          </div>
        </div>
      </section>

      <div class="q-mt-xl">
        <q-btn rounded type="submit" label="Télécharger"
          ><q-icon color="primary" class="q-ml-sm" name="download"
        /></q-btn>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ShapedCsvRow } from '../interfaces/CsvInterface';
import PdfBuilder from './PdfGenerator';
import { equivalenceCalcul } from './utils';
import { Csv } from 'src/interfaces/CsvInterface';

const formData: Ref<Csv> = ref({
  clientCode: '',
  siteName: '',
  wasteTonnage: 0,
  recyclableWasteTonnage: 0,
  year: new Date().getFullYear(),
  sortingRate: 0,
  DEEE: 0,
  plastic: 0,
  cardboard: 0,
  steel: 0,
  wood: 0,
  organicWaste: 0,
  bulbs: 0,
  textile: 0,
  paper: 0,
  aluminum: 0,
  glass: 0,
  electronics: 0,
});

function pdfGenerator(params: ShapedCsvRow[]) {
  params.reduce(async (promise, param) => {
    await promise;
    return PdfBuilder(param)();
  }, Promise.resolve());
}

const submitForm = () => {
  const formDatas = [];
  formDatas.push(formData.value);
  if (!formData.value) return;
  pdfGenerator(equivalenceCalcul(formDatas));
};
</script>
