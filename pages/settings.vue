<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card min-width="300" max-width="500">
        <v-card-title class="headline">
          Настройки
        </v-card-title>        
        <v-card-actions>
          <v-spacer />
          <v-btn            
            color="red"
            @click="deleteData"
          >
            Удалить данные
          </v-btn>
          
        </v-card-actions>
        <v-card-actions>
          <v-spacer />
         
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>


export default {
  components: {
  },
  methods: {
    deleteData() {
      this.$store.commit('deleteData')
      location.href = '/'
    }
  }
}
</script>
