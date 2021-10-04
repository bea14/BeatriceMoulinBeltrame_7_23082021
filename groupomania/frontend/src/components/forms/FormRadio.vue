<template>
  <div class="RadioInput">
    <label
    >
    <input
      type="radio"
      :name="name"
      v-model="radioButtonValue"      
      :value="label"
     />
     {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "RadioInput",
  props: {
    name: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    value: {
    },
    v_value: {
    },    
  },
  computed: {
        radioButtonValue: {
            get: function() {
                return this.value
            },
            set: function() {
                // Communicate the change to parent component so that selectedValue can be updated
                this.$emit("change", this.label)
            }
        }
    }
};
</script>