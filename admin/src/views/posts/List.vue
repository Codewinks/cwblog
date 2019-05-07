<template>
  <v-container>
    <v-layout row>
      <h1>Posts</h1>
      <v-btn small color="primary" class="ml-4">Add New</v-btn>
    </v-layout>

    <v-layout row align-center>
      <v-flex grow>
        <a href="#" class="font-weight-bolder text-body">All (2)</a> |
        <a class href="#">
          Drafts
          <span class="text-body">(2)</span>
        </a>
      </v-flex>
      <v-flex shrink>
        <v-text-field v-model="search" append-icon="search" label="Search Posts" single-line></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row align-center>
      <v-flex shrink>
        <select class="custom-select custom-select-sm mr-2">
          <option>Bulk Actions</option>
          <option value="edit">Edit</option>
          <option value="trash">Move to Trash</option>
        </select>
        <v-btn small color="secondary" class="px-1">Apply</v-btn>
      </v-flex>
      <v-flex shrink>
        <select class="custom-select custom-select-sm mr-2">
          <option>All Dates</option>
          <option value="201808">August 2018</option>
        </select>
        <select class="custom-select custom-select-sm mr-2">
          <option>All Categories</option>
          <option value="1">Uncategorized</option>
        </select>
        <a href="#" class="btn-secondary btn-sm">Filter</a>
      </v-flex>
      <v-flex grow text-xs-right>2 items</v-flex>
    </v-layout>

    <v-data-table :headers="headers" :items="posts" :search="search"></v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: null,
      profile: this.$auth.profile,

      headers: [],
      posts: []
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      this.$axios
        .get("http://api.winks.localhost:3000/v1/posts")
        .then(response => {          
          console.log(response);
          this.posts = response.data; // used `this.items = ` instead of `items = `
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>