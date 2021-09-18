<template>
  <footer class="footer">
    <div class="company" company-name="Groupomania">
      <i class="fa fa-copyright" aria-hidden="true">&nbsp;</i> {{ copyright }} &nbsp;
    </div>
    <div class="contact">
      Contact : <a href="mailto:groupomania@groupomania.fr">groupomania@groupomania.fr</a>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    companyName: String,
  },
  computed: {
    copyright: function () {
      const currentYear = new Date().getFullYear();
      return `Copyright ${this.companyName} ${currentYear}`;
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/utils/_variables.scss";
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $secondary-color;
  color: white;
  margin: 1rem 0;
  height: 5rem;
  font-size: 0.8rem;
  div {
    margin: 0.5rem 0;
    a {
      text-decoration: none;
      color: white;
    }
  }
  @media screen and (min-width: 768px) {
    flex-direction: row;
    font-size: 1rem;
  }
}
</style>
