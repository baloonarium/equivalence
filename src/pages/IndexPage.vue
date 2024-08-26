<template>
  <q-page>
    <q-tabs v-model="tab" inline-label class="text-grey-9 q-mt-lg">
      <q-tab name="csv" icon="cloud_upload" label="Importer un CSV" />
      <q-tab name="form" icon="edit_note" label="Renseigner le formulaire" />
      <!-- <q-tab name="html" icon="edit_note" label="Renseigner le formulaire" /> -->
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      class="q-mt-xl"
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="csv">
        <FormCSV />
      </q-tab-panel>

      <q-tab-panel name="form">
        <FormMaterial />
      </q-tab-panel>

      <q-tab-panel name="html">
        <HtmlRender />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import FormCSV from 'src/components/FormCSV.vue';
import FormMaterial from 'src/components/FormMaterial.vue';
import HtmlRender from 'src/components/HtmlRender.vue';
import { ref } from 'vue';

const tab = ref('csv');
</script>
