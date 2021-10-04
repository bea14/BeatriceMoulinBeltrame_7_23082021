<template>
  <div
    class="FormDate"
    @keyup.capture="updateValue"
  >
    <input
      v-if="showDay"
      ref="day"
      v-model="day"
      class="FormDate__input FormDate__input--day"
      type="number"
      placeholder= "dd"
      @input="updateDay"
      @blur="day = day.padStart(2, 0)">
    <span
      v-if="showDay && showMonth"
      class="FormDate__divider"
    >/</span>
    <input
      v-if="showMonth"
      ref="month"
      v-model="month"
      class="FormDate__input FormDate__input--month"
      type="number"
      placeholder= "mm"
      @input="updateMonth"
      @blur="month = month.padStart(2, 0)">
    <span
      v-if="showYear && (showDay || showMonth)"
      class="FormDate__divider"
    >/</span>
    <input
      v-if="showYear"
      ref="year"
      v-model="year"
      class="FormDate__input FormDate__input--year"
      type="number"
      placeholder= "yyyy"
      @blur="year = year.padStart(4, 0)">
  </div>
</template>

<script>
export default {
  name: "FormDate",
  props: {
    showDay: {
      type: Boolean,
      default: true,
    },
    showMonth: {
      type: Boolean,
      default: true,
    },
    showYear: {
      type: Boolean,
      default: true,
    },
  },
   data() {
    return {
      day: `${this.value ? new Date(this.value).getDate() : ''}`,
      month: `${this.value ? new Date(this.value).getMonth() + 1 : ''}`,
      year: `${this.value ? new Date(this.value).getFullYear(): ''}`,
    };
  },
  methods: {
    updateDay() {
      //on vérifie que valeur non vide ou pas inférieure à 4 avant de passer à la suite
      if (!this.day.length || parseInt(this.day, 10) < 4) return;
      if (this.showMonth) this.$refs.month.select();
      else if (this.showYear) this.$refs.year.select();
    },
    updateMonth() {
      //on vérifie que valeur non vide ou pas inférieure à 2 avant de passer à la suite
      if (!this.month.length || parseInt(this.month, 10) < 2) return;
      if (this.showYear) this.$refs.year.select();
    },
    // Fonction qui sert à convertir les jours, mois et années en timestamp qui sera emit
    updateValue() {
      const timestamp = Date.parse(`${this.year.padStart(4, 0)}-${this.month}-${this.day}`);
      if (Number.isNaN(timestamp)) return;
      this.$emit('input', timestamp);
    },
  },
  watch: {
    //on vérifie qu'il n'y a pas plus de 4 chiffres pour l'année
    year(current, prev) {
      if (current > 9999) this.year = prev;
    },
  },
}
</script>