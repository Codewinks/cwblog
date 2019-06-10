<template>
  <v-container>
    <v-layout row mb-4>
      <h1>New Post</h1>
      <v-flex d-flex shrink align-center class="ml-auto">
        <v-icon v-on:click.stop="settings.panel = !settings.panel" class="mr-2">settings</v-icon>
        <v-btn small color="secondary" class="mr-2">Preview</v-btn>
        <v-btn small color="primary" v-on:click.prevent="createPost">Publish</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex>
        <div class="p-1 form-inline">
          <b class="mr-2 my-1">Permalink:</b>
          <template v-if="!editSlug">
            <a
              :href="baseUrl + post.slug"
              target="_"
              rel="noopener noreferrer"
            >{{ baseUrl + post.slug }}</a>

            <v-icon v-on:click.prevent="editSlug = true" size="1em">mdi-lead-pencil</v-icon>
          </template>
          <template v-else>{{ baseUrl }}</template>
          <input
            :type="editSlug ? 'text' : 'hidden'"
            ref="slug"
            class="form-control form-control-sm form-control-plaintext"
            v-model="post.slug"
            v-on:focusout="editSlug = false"
          >
        </div>
        <v-text-field
          v-model="post.title"
          :rules="rules.title"
          :counter="250"
          :label="!post.title ? 'Add post title' : 'Post Title'"
          large
          outline
          required
        ></v-text-field>
        <v-textarea
          outline
          v-model="post.content"
          :label="!post.content ? 'Start writing your post content here' : 'Post Content'"
        ></v-textarea>
      </v-flex>
      <v-flex ml-5 pt-4 shrink style="width: 300px;" v-if="settings.panel">
        <v-tabs auto-height full-width>
          <v-tab key="post" ripple>Settings</v-tab>
          <v-tab key="block" ripple>Block</v-tab>
          <v-flex grow></v-flex>
          <v-tab ripple shrink>
            <v-icon v-on:click.stop="settings.panel = !settings.panel">close</v-icon>
          </v-tab>
          <v-tab-item key="post">
            <v-card flat>
              <v-expansion-panel v-model="settings.tabs" expand>
                <v-expansion-panel-content key="status">
                  <template v-slot:header>
                    <div>Status &amp; Visibility</div>
                  </template>
                  <v-card>
                    <v-card-text class="pt-0">
                      <v-layout row>
                        <v-flex>
                          <label class="my-1 mr-1">
                            <i class="mdi mdi-flash mr-1"></i>Status:
                          </label>
                          <template v-if="!editStatus">
                            <b>{{ labels.status }}</b>
                          </template>
                          <template v-else>
                            <div class="d-inline-block form-inline">
                              <select
                                class="form-control form-control-sm"
                                ref="status"
                                v-model="post.status"
                                v-on:change="changeStatus"
                                v-on:focusout="changeStatus"
                              >
                                <option value="1" v-if="post.published_at">Published</option>
                                <option value="0">Draft</option>
                                <option value="-1">Pending Review</option>
                              </select>
                            </div>
                          </template>
                          <i
                            class="mdi mdi-lead-pencil ml-1"
                            v-if="!editStatus"
                            v-on:click.prevent="editStatus = true"
                          ></i>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex>
                          <label class="my-1 mr-1">
                            <i class="mdi mdi-eye mr-1"></i>Visibility:
                          </label>
                          <template v-if="!editVisibility">
                            <b>{{ labels.visibility }}</b>
                          </template>
                          <template v-else>
                            <div class="d-inline-block form-inline">
                              <select
                                class="form-control form-control-sm"
                                ref="visibility"
                                v-model="post.visibility"
                                v-on:change="changeVisibility"
                                v-on:focusout="changeVisibility"
                              >
                                <option value="1">Public</option>
                                <option value="0">Private</option>
                                <option value="-1">Protected</option>
                              </select>
                            </div>
                          </template>
                          <i
                            class="mdi mdi-lead-pencil ml-1"
                            v-if="!editVisibility"
                            v-on:click.prevent="editVisibility = true"
                          ></i>
                        </v-flex>
                      </v-layout>

                      <v-layout row>
                        <v-flex>
                          <label class="my-1 mr-1">
                            <i class="mdi mdi-calendar mr-1"></i>Publish:
                          </label>
                          <template v-if="!editPublishedAt">
                            <b>{{ labels.published_at }}</b>
                            <i
                              class="mdi mdi-lead-pencil ml-1"
                              v-if="!editPublishedAt"
                              v-on:click.prevent="editPublishedAt = true"
                            ></i>
                          </template>
                          <template v-else>
                            <input
                              type="datetime-local"
                              class="form-control form-control-sm"
                              ref="published_at"
                              v-model="post.published_at"
                              v-on:change="changePublishedAt"
                              v-on:focusout="changePublishedAt"
                            >
                          </template>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content key="categories">
                  <template v-slot:header>
                    <div>Categories</div>
                  </template>
                  <v-card>
                    <v-card-text class="pt-0">Categories</v-card-text>
                  </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content key="tags">
                  <template v-slot:header>
                    <div>Tags</div>
                  </template>
                  <v-card>
                    <v-card-text class="pt-0">Tags</v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card>
          </v-tab-item>

          <v-tab-item key="block">
            <v-card flat>
              <v-card-text>Block Settings</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
      tab: false,

      baseUrl: this.$root.config.siteUrl,
      settings: {
        panel: true,
        tabs: [true, false, false]
      },

      autoSlug: true,

      editSlug: false,
      editStatus: false,
      editVisibility: false,
      editPublishedAt: false,

      loading: true,

      labels: {
        status: this.$refs.status
          ? this.$refs.status.options[this.$refs.status.options.selectedIndex]
              .text
          : "Draft",
        visibility: this.$refs.visibility
          ? this.$refs.visibility.options[
              this.$refs.visibility.options.selectedIndex
            ].text
          : "Public",
        published_at: this.$refs.published_at
          ? this.$refs.published_at.value
          : "Immediately"
      },
      post: {
        title: null,
        slug: "",
        status: "0",
        visibility: "1",
        published_at: null
      },
      rules: {
        title: [v => !!v || "Title is required."]
      }
    };
  },
  watch: {
    "post.title"() {
      if (this.autoSlug) {
        this.post.slug = this.post.title;
      }
    },
    "post.slug"(val) {
      // TODO: Check if post slug already exists on change
      this.post.slug = this.$options.filters.slugify(val);
    },
    editSlug(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.slug.focus();
        }, 50);
      }
    },
    editStatus(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.status.focus();
        }, 50);
      }
    },
    editVisibility(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.visibility.focus();
        }, 50);
      }
    },
    editPublishedAt(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.published_at.focus();
        }, 50);
      }
    }
  },
  mounted() {
    console.log(this.$auth.profile)
  },
  methods: {
    changeStatus() {
      this.editStatus = false;
      this.labels.status = this.$refs.status.options[
        this.$refs.status.options.selectedIndex
      ].text;
    },
    changeVisibility() {
      this.editVisibility = false;
      this.labels.visibility = this.$refs.visibility.options[
        this.$refs.visibility.options.selectedIndex
      ].text;
    },
    changePublishedAt() {
      this.editPublishedAt = false;
      console.log(this.$refs.published_at.value);
      this.labels.published_at = this.$refs.published_at.value
        ? this.$refs.published_at.value
        : "Immediately";
    },
    createPost() {
      this.loading = true;
      let params = {
        user_id: this.$auth.profile.id,
        title: this.post.title,
        slug: this.post.slug,
        status: this.post.status,
        sort: "0",
        format: "0",
        comment_status: "0",
        visibility: this.post.visibility,
        published_at: this.post.published_at
      }
      this.$axios
        .post("http://api.winks.localhost:3000/v1/posts", params)
        .then(response => {
          console.log(response);
          this.posts = response.data ? response.data : [];
          console.log(this.posts);
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>