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
      <span>{{ required ? " (obligatoire)" : "" }}</span>
    </label>
    <textarea
      :class="{
        'border-gray-700': !errors[0],
        'border-red-600': errors[0],
        'has-value': hasValue,
      }"
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
    <span v-bind="ariaMsg" v-if="errors[0]">{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "TextAreaInput",
  components: {
    ValidationProvider,
  },
  props: {
    vid: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
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
          "email",
        ].includes(value);
      },
    },
    value: {
      type: null,
      default: "",
    },
  },
  data: () => ({
    innerValue: "",
  }),
  computed: {
    hasValue() {
      return !!this.innerValue;
    },
  },
  watch: {
    innerValue(value) {
      this.$emit("input", value);
    },
    value(val) {
      if (val !== this.innerValue) {
        this.innerValue = val;
      }
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
