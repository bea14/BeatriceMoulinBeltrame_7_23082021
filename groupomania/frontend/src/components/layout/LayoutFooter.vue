<template>
  <footer class="footer">
    <div class="company" company-name="Groupomania">
      <i class="fa fa-copyright" aria-hidden="true">&nbsp;</i>
      {{ copyright }} &nbsp;
    </div>
    <div class="contact">
      Contact :
      <a href="mailto:groupomania@groupomania.fr">groupomania@groupomania.fr</a>
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
