<template>
  <v-container>
    <v-layout row>
      <h1>Posts</h1>
      <v-btn small color="primary" class="ml-auto" :to="{name: 'posts.create'}">Add New</v-btn>
    </v-layout>

    <v-layout row align-center>
      <v-flex grow>
        <a href="#" class="font-weight-bolder text-body">All (2)</a> |
        <a class href="#">
          Drafts
          <span class="text-body">(2)</span>
        </a>
      </v-flex>
      <v-flex d-flex shrink>
        <v-icon v-on:click="refresh" class="mr-3">refresh</v-icon>
        <v-text-field v-model="search" append-icon="search" label="Search Posts" single-line></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row align-center>
      <v-flex d-flex shrink mr-3>
        <v-select
          :items="actions"
          item-text="label"
          item-value="value"
          label="Bulk Actions"
          dense
          solo
          hide-details
        ></v-select>
        <v-btn color="secondary" class="px-1 mt-0">Apply</v-btn>
      </v-flex>
      <v-flex d-flex shrink mr-2>
        <v-select
          :items="dates"
          item-text="label"
          item-value="value"
          label="All Dates"
          dense
          solo
          hide-details
          class="mr-2"
        ></v-select>
        <v-select
          :items="categories"
          item-text="label"
          item-value="value"
          label="All Categories"
          dense
          solo
          hide-details
        ></v-select>
        <v-btn color="secondary" class="px-1 mt-0">Filter</v-btn>
      </v-flex>
      <v-flex grow text-xs-right>2 items</v-flex>
    </v-layout>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="posts"
      :search="search"
      select-all
      disable-initial-sort
      class="elevation-2"
    >
      <template v-slot:items="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">
          <td>
            <v-checkbox
              primary
              hide-details
              :input-value="props.selected"
            ></v-checkbox>
          </td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.author }}</td>
          <td>{{ props.item.categories }}</td>
          <td class="text-xs-right">{{ props.item.tags }}</td>
          <td class="text-xs-right">{{ props.item.comments }}</td>
          <td class="text-xs-right">{{ props.item.date }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      search: null,
      profile: this.$auth.profile,

      actions: [
        { label: "Edit", value: "edit" },
        { label: "Move to Trash", value: "trash" }
      ],
      dates: [
        { label: "July 2018", value: "201807" },
        { label: "August 2018", value: "201808" }
      ],
      categories: [{ label: "Uncategorized", value: "1" }],
      headers: [
        { text: "Title", value: "title", align: "left" },
        { text: "Author", value: "author", align: "left" },
        { text: "Categories", value: "categories", align: "left" },
        { text: "Tags", value: "tags", align: "left" },
        { text: "Comments", value: "comments", align: "left" },
        { text: "Date", value: "date", align: "left" }
      ],
      posts: []
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    refresh(){
      this.getPosts();
    },
    getPosts() {
      this.loading = true;
      this.$axios
        .get("http://api.winks.localhost:3000/v1/posts")
        .then(response => {
          console.log(response);
          this.posts = response.data ? response.data : [];
          console.log(this.posts);
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(()=>{
          this.loading = false;
        });
    }
  }
};
</script>