<template>
  <ValidationProvider
    class="CheckboxInput"
    tag="div"
    :vid="vid"
    :rules="rules"
    :name="name || label"
    v-slot="{ errors, required, ariaCheckbox, ariaMsg }"
  >
    <label
      @click="$refs.input.focus()"
      :for="name"
      :class="{ 'text-gray-700': !errors[0], 'text-red-600': errors[0] }"
    >
      <span>{{ label }}</span>
      <span>{{ required ? ' (obligatoire)' : '' }}</span>
    </label>
    <input
      :class="{ 'border-gray-700': !errors[0], 'border-red-600': errors[0], 'has-value': hasValue }"
      :id="name"
      :type="type"
      :value="value"
      ref="input"
      v-model="innerValue"
      v-bind="ariaCheckbox"
    >    
    <span
      v-bind="ariaMsg"
      v-if="errors[0]"
    >{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "CheckboxInput",
  components: {
    ValidationProvider
  },
  props: {
    vid: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    rules: {
      type: [Object, String],
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text",
      validator(value) {
        return [
          "url",
          "text",
          "password",
          "tel",
          "search",
          "number",
          "email"
        ].includes(value);
      }
    },
    value: {
      type: null,
      default: "radio"
    }
  },
  data: () => ({
    innerValue: ""
  }),
  computed: {
    hasValue() {
      return !!this.innerValue;
    }
  },
  watch: {
    innerValue(value) {
      this.$emit("input", value);
    },
    value(val) {
      if (val !== this.innerValue) {
        this.innerValue = val;
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/main.scss";
.CheckboxInput {
  display: flex;
  flex-direction: row;
  input {
  display: block;}
  
}
</style>