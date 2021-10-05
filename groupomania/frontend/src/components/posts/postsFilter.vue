<template>
  <div class="filterposts">  
    <!--Tri sur les dates des posts-->
    <div class="items">
      <label for="tag">Trier: </label>
      <select name="triDate" v-model="selectedsorting" @change="changeTag()" aria-label="tri par date">         
        <option value="" selected disabled>--Tri--</option>
        <option v-for="sort in sorts" :value="sort.value" :key="sort.value">
          {{ sort.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      innerValue: "",
      selectedsorting: "--Les plus récents--",
      sorts: [
        {text:'Les plus récents', value: 'Desc'},
        {text:'Les plus anciens', value: 'Asc'},
        {text:'la dernière semaine', value: 'LastWeek'},
        {text:'Le dernier mois', value: 'LastMonth'},
      ],
    };
  },
  methods: {
    //permet de récupérer l'option selectionnée et de l'envoyer au parent
    changeTag () {
      let sortingDate = this.selectedsorting;
      this.$emit("sortingdate", sortingDate);
    },
  },
}
</script>