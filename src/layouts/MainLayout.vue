<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon
            name="eco"
            size="1.5em"
            color="primary"
            class="q-mr-xs"
          ></q-icon>
          <!-- <span class="q-ml-sm text-grey-9">Equivalence</span> -->
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.q-toolbar {
  background: rgb(22, 75, 77);
  background: linear-gradient(
    90deg,
    rgb(15, 53, 55) 0%,
    rgba(9, 121, 94, 1) 44%,
    rgb(169, 228, 191) 100%
  );
}
</style>
