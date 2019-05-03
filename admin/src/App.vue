<template>
  <v-app id="inspire" dark>
    <Navigation></Navigation>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navigation from './views/common/Navigation'

export default {
  name: "App",
  components: {
    Navigation
  }
};
</script>

<style>
#app{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.v-text-field.v-text-field--solo .v-input__control{
  min-height: 36px;
}
</style>