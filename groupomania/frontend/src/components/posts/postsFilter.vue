<template>
  <div class="filterposts">
    <!--Filtre sur les  catégories-->
    <!--
    <div class="items">
      <label for="tag">Choisissez une catégorie :</label>
        <select v-model="selected" @change="changeTag($event)">          
          <option value="" selected disabled>--Choisir une catégorie--</option>
          <option v-for="tag in tags" :value="tag.text" :key="tag.value" :class="getCategorie(tag.name)">
            {{ tag.text }}
          </option>
        </select>
    </div>-->
    <!--Zone de recherche par mots clés-->
    <!--<div class="items">
      <input type="text" v-model="searchTerm" placeholder="Search Posts" class="search-input" />
    </div>-->
    <!--Tri sur les dates des posts-->
    <div class="items">
      <label for="tag">Trier :</label>
      <!--<select name="triDate" v-model="selectedsorting" @change="changeTag($event)"> -->
      <select name="triDate" v-model="selectedsorting" @change="changeTag()">         
        <option value="" selected disabled>--Tri--</option>
        <option v-for="sort in sorts" :value="sort.value" :key="sort.value" :class="getSorting(sort.name)">
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
      /*searchTerm: "",*/
      selectedsorting: "--Les plus récents--",
      sorts: [
        {text:'Les plus récents', value: 'Desc'},
        {text:'Les plus anciens', value: 'Asc'},
        {text:'la dernière semaine', value: 'LastWeek'},
        {text:'Le dernier mois', value: 'LastMonth'},
      ],
      /*selected: "--Choisir une catégorie--",
      tags: [
            {text:'Environnement', value: 'Environnement'},
            {text:'Science', value: 'Science'},
            {text:'Technologie', value: 'Technologie'},
            {text:'Actualités', value: 'Actualités'},
            {text:'Humour', value: 'Humour'},
            {text:'Au travail', value: 'Au travail'},
            {text:'Divers', value: 'Divers'},
        ],
      tag:''*/
    };
  },
  methods: {
    /*getCategorie(val){
      const catactive = "cat_item cat_item_isactive"
      const catinactive = "cat_item"
      var categorie = val === this.selected ? catactive : catinactive;
      return categorie;
    },*/
    getSorting(val) {
      const sortactive = "cat_item cat_item_isactive"
      const sortinactive = "cat_item"
      var sorting = val === this.selected ? sortactive : sortinactive;
      return sorting;
    },
    changeTag () {
      //this.tag = event.target.value;
      //this.selectedTag = event.target.options[event.target.option];
      let sortingDate = this.selectedsorting;
      //return sortingDate   
      this.$emit("sorting-date", sortingDate);
    },
  },
}
</script>

<style lang="scss">
.filterposts{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: 1024px){
    flex-direction: row;
  }
}
</style>
