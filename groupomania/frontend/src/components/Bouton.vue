<template>
    <button
    class="submitButton" 
    type="button"
    @click.prevent="emitCustomEvent"
    >
    {{text}}
    </button>
</template>

<script>
export default {
    props: {
        text: String,
        disabled: {
            type: Boolean,
            default: undefined
        },
    },
    methods: {
        emitCustomEvent() {
        this.$emit('click')
        }
    }
}
</script>

