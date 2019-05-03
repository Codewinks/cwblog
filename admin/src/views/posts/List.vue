<template>
  <div>
    <v-card>
    <v-card-title>
      Posts
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    ></v-data-table>
  </v-card>

    <div class="breadcrumb">
      <h1>Posts</h1>
      <a href="/admin/posts/new" class="btn btn-secondary btn-sm">Add New</a>
    </div>

    <div class="d-flex align-items-end mt-2">
      <div class="flex-grow-1">
        <a href="#" class="font-weight-bolder text-body">All (2)</a> |
        <a class href="#">
          Drafts
          <span class="text-body">(2)</span>
        </a>
      </div>
      <div class>
        <div class="input-group">
          <input type="text" class="form-control form-control-sm" placeholder="Search Posts">
          <span class="input-group-btn">
            <button class="btn btn-primary btn-sm" type="button">
              <i class="mdi mdi-magnify"></i>
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center my-2">
      <div class="d-flex mr-4">
        <select class="custom-select custom-select-sm mr-2">
          <option>Bulk Actions</option>
          <option value="edit">Edit</option>
          <option value="trash">Move to Trash</option>
        </select>
        <a href="#" class="btn-secondary btn-sm">Apply</a>
      </div>
      <div class="d-flex">
        <select class="custom-select custom-select-sm mr-2">
          <option>All Dates</option>
          <option value="201808">August 2018</option>
        </select>
        <select class="custom-select custom-select-sm mr-2">
          <option>All Categories</option>
          <option value="1">Uncategorized</option>
        </select>
        <a href="#" class="btn-secondary btn-sm">Filter</a>
      </div>
      <div class="flex-grow-1 text-right">2 items</div>
    </div>

    <div class="card">
      <table class="table table-sm table-striped mb-0">
        <thead>
          <tr>
            <th width="1" scope="col">
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input mt-0" id="exampleCheck1">
              </div>
            </th>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Categories</th>
            <th scope="col">Tags</th>
            <th scope="col">
              <i class="mdi mdi-chat"></i>
            </th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, key) in posts" :key="post.id">
            <th scope="row" :test="key">
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
              </div>
            </th>
            <td>
              <strong>
                <a
                  class="row-title"
                  :href="'/admin/posts/edit/'+post.Id"
                  :aria-label="'“'+post.Title+'” (Edit)'"
                >{{ post.Title }}</a> —
                <span class>Draft</span>
              </strong>
              <div class="row-actions">
                <span class="edit">
                  <a
                    :href="'/admin/posts/edit/'+post.Id"
                    :aria-label="'Edit “'+post.Title+'”'"
                  >Edit</a> |
                </span>
                <span class="trash">
                  <a
                    href="https://www.heejinseo.com/wp-admin/post.php?post=50&amp;action=trash&amp;_wpnonce=63ee255d23"
                    class="text-danger"
                    :aria-label="'Move “'+post.Title+'” to the Trash'"
                  >Trash</a> |
                </span>
                <span class="view">
                  <a
                    href="https://www.heejinseo.com/?p=50&amp;preview=true"
                    rel="bookmark"
                    :aria-label="'Preview “'+post.Title+'”'"
                  >Preview</a>
                </span>
              </div>
            </td>
            <td>
              <a href="#">{{ post.User.FirstName }}</a>
            </td>
            <td>
              <span aria-hidden="true">—</span>
              <span class="sr-only sr-only-focusable">Uncategorized</span>
            </td>
            <td>
              <span aria-hidden="true">—</span>
              <span class="sr-only sr-only-focusable">No tags</span>
            </td>
            <td>
              <span aria-hidden="true">—</span>
              <span class="sr-only sr-only-focusable">No tags</span>
            </td>
            <td>
              Last Modified
              <br>
              <abbr :title="post.UpdatedAt">{{ post.UpdatedAt }}</abbr>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: this.$auth.profile
    };
  },
  methods: {}
};
</script>