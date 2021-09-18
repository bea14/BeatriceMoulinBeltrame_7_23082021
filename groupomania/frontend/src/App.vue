<script>
import Header from "./components/layout/LayoutHeader.vue";
import Footer from "./components/layout/LayoutFooter";
export default {
  name: "App",
  data(){
    return {
      headerKey: 0,
    }
  },
  components: {
    Header,
    Footer,
  },
  methods: {
      showPage() {
      console.log(window.location.pathname.split('/'));
      let page = true;
      let path = window.location.pathname;
      if (path == "/") {
        page = false;
      }
      return page;
    },
  }
};
</script>

<template>
  <div id="app">    
    <Header @gotohome="path = '/Posts'" v-if="showPage()" :key="headerKey"/>
    <main>
      <router-view />
    </main>
    <Footer companyName="Groupomania" />
  </div>
</template>

<style lang="scss">
@import "./assets/styles/utils/_variables.scss";
#app {
  font-family: Verdana, Arial, Helvetica, sans-serif;
}
main {
  background-color: lighten($tertiary-color, 50%);
  margin-top: 8rem;
  @media screen and (min-width: 770px) {
    margin-top: 4rem;
  }
}
</style>
