<script>
import Footer from "./components/layout/LayoutFooter";
export default {
  name: "App",
  components: {
    Footer,
  },
};
</script>

<template>
  <div id="app"> 
    <main>
      <router-view />
    </main>
    <Footer companyName="Groupomania" />
  </div>
</template>

<style lang="scss">
main {
  margin-top: 20vh;
  @media screen and (min-width: 668px) {
    margin-top: 4rem;
  }
}
</style>
