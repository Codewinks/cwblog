<template>
  <div class="main-nav">
    <v-navigation-drawer v-model="leftNav" clipped fixed app :width="200">
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/posts">
          <v-list-tile-action>
            <v-icon>apps</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Posts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/users">
          <v-list-tile-action>
            <v-icon>group</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/settings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="primary darken-1" dark app fixed>
      <v-toolbar-side-icon @click.stop="leftNav = !leftNav"></v-toolbar-side-icon>
      <v-toolbar-title class="pr-4 ml-1">
        <router-link to="/"><span class="hidden-sm-and-down">CWBlog Admin</span></router-link>
      </v-toolbar-title>
      <template v-if="$root.isAuthenticated">
        <v-text-field
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="search"
          label="Search"
          class="hidden-sm-and-down"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
      </template>

      <div class="ml-auto">
        <v-menu
          offset-y
          right
          nudge-bottom="10px"
          origin="center center"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on">
              <v-avatar size="32px" tile>
                <img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify">
              </v-avatar>
            </v-btn>
          </template>
          <v-list dense>
            <template v-if="$root.isAuthenticated">
              <v-list-tile to="profile">
                <v-list-tile-action>
                  <v-icon>person</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Profile</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click.prevent="$root.logout">
                <v-list-tile-action>
                  <v-icon>lock</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Sign Out</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <template v-else>
              <v-list-tile  @click.prevent="$root.login">
                <v-list-tile-action>
                  <v-icon>lock_open</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Login</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      leftNav: null
    };
  },
  methods: {
    test() {
      console.log("test");
    }
  }
};
</script>

<style scoped>
.v-list__tile__action {
  min-width: 36px;
}
.v-toolbar__content {
  padding: 0 16px;
}
.v-toolbar__title a{
  color: #fff;
  text-decoration: none;
}
</style>