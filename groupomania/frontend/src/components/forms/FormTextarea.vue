<template>
  <ValidationProvider
    class="TextAreaInput"
    tag="div"
    :vid="vid"
    :rules="rules"
    :name="name || label"
    v-slot="{ errors, required, ariaTextarea, ariaMsg }"
  >
    <label
      @click="$refs.textarea.focus()"
      :for="name"
      :class="{ 'text-gray-700': !errors[0], 'text-red-600': errors[0] }"
    >
      <span>{{ label || name }}</span>
      <span>{{ required ? ' (obligatoire)' : '' }}</span>
    </label>
    <textarea
      :class="{ 'border-gray-700': !errors[0], 'border-red-600': errors[0], 'has-value': hasValue }"
      :id="name"
      :type="type"
      :placeholder="placeholder"
      ref="textarea"
      v-model="innerValue"
      v-bind="ariaTextarea"
      cols="50"
      rows="5"
      value="innerValue"
    >
    </textarea>
    <span
      v-bind="ariaMsg"
      v-if="errors[0]"
    >{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "TextAreaInput",
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
      default: ""
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
.TextAreaInput {
  padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  input {
    border-radius: $border-radius-s;
      margin-top: 0.25rem;
      line-height: 1.5rem;
      border-width: 1px;
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
      background-color: $bg-body;
      &.border-gray-700 { border-color: #4a5568; }
      &.border-gray-600 { border-color: #718096; }

    &.has-value,
    &:focus {
      outline: none;
    }
  }

  label {
   padding-bottom: 0.5rem;
   &.text-gray-700 {color: #4a5568;} 
    &.text-red-600 { color: #e53e3e; }
  input.has-value ~ label,
  input:focus ~ label {
    font-size: 0.6rem;
    margin-top: 0;
    transition: all 0.2s ease-in-out;
  }
}
}
</style>