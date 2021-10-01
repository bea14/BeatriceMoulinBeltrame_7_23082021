<template>
<div 
  class="RadioInput" 
  :class="[value === v_value?'field__radio--checked':'']"
>
    <label
      :for="name"
      @click="$emit('input', v_value)"
    >
    <input
      type="radio"
      :id="name"
      :name="name"
      ref="input"
      v-model="value"      
      value="label"
     />
    </label>
  </div>
</template>

<script>
export default {
  name: "RadioInput",
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
    value: {
    },
    v_value: {
    },    
  },
};
</script>