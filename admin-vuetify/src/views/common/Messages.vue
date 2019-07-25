<template>
  <div class="messages mb-4">
    <transition name="fade-transition">
    <v-alert :value="true" type="success" :dismissible="true" v-if="success"><span v-html="success"></span></v-alert>
    <v-alert :value="true" type="info" :dismissible="true" v-if="info">{{ info }}</v-alert>
    <v-alert :value="true" type="warning" :dismissible="true" v-if="warning">{{ warning }}</v-alert>
    <v-alert :value="true" type="error" :dismissible="true" v-if="errors.length">
      <template v-for="(error, i) in errors">
        <div :key="i">{{ error }}</div>
      </template>
    </v-alert>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["success", "info", "warning", "errors"],
};
</script>