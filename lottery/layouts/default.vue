<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-center"
        >ভোলা পল্লী বিদ্যুৎ সমিতির ২৩তম বার্ষিক সদস্য সভার লটারি
        <!-- Result Button -->
        <v-btn color="green" dark small @click="$nuxt.$emit('showResult')">
          ফলাফল দেখুন
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="pink"
        dark
        absolute
        bottom
        right
        fab
        @click="$nuxt.$emit('startLottery')"
      >
        <v-icon>mdi-airplane</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Lottery',
    }
  },
}
</script>
