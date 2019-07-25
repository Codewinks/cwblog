<template>
  <v-container>
    <loader :on="loading"></loader>
    <messages :success="success" :errors="errors"></messages>

    <v-layout row mb-4 v-if="!loading">
      <h1>New Post</h1>
      <v-flex d-flex shrink align-center class="ml-auto">
        <v-icon v-on:click.stop="config.panel = !config.panel" class="mr-2">settings</v-icon>
        <v-btn small color="secondary" class="mr-2">Preview</v-btn>
        <v-btn small color="primary" v-on:click.prevent="savePost">{{ actionLabel }}</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex>
        <div class="p-1 form-inline">
          <v-label>Permalink:</v-label>          
          <v-chip small text-color="white" class="ml-2 mb-2">
            <template v-if="!editSlug">
              <a
                :href="baseUrl + post.slug"
                target="_"
                rel="noopener noreferrer"
                class="white--text"
              >{{ baseUrl + post.slug }}</a>
              <v-icon v-on:click.prevent="editSlug = true" size="1em" class="ml-2">mdi-lead-pencil</v-icon>
            </template>
            <template v-else>{{ baseUrl }}</template>
            <input
              :type="editSlug ? 'text' : 'hidden'"
              ref="slug"
              class="form-control form-control-sm form-control-plaintext"
              v-model="post.slug"
              v-on:focusout="editSlug = false"
            >
            <v-icon v-on:click.prevent="editSlug = false" size="1em" class="ml-2" v-if="editSlug">mdi-check</v-icon>
          </v-chip>
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
      <v-flex ml-5 pt-4 shrink style="width: 300px;" v-if="config.panel">
        <v-tabs auto-height full-width>
          <v-tab key="post" ripple>Settings</v-tab>
          <v-tab key="block" ripple>Block</v-tab>
          <v-flex grow></v-flex>
          <v-tab ripple shrink>
            <v-icon v-on:click.stop="config.panel = !config.panel">close</v-icon>
          </v-tab>
          <v-tab-item key="post">
            <v-card flat>
              <v-expansion-panel v-model="config.tabs" expand>
                <v-expansion-panel-content key="status">
                  <template v-slot:header>
                    <div>Status &amp; Visibility</div>
                  </template>
                  <v-card>
                    <v-card-text class="pt-0">
                      <v-layout row align-center my-2>
                        <v-label>
                          <i class="mdi mdi-flash mr-1"></i>Status:
                        </v-label>
                        <v-menu transition="slide-x-transition" left max-width="300">
                          <template v-slot:activator="{ on }">
                            <v-chip small text-color="white" v-on="on" class="ml-auto">
                              {{ statusLabel }}
                              <v-icon small right class="ml-2">mdi-lead-pencil</v-icon>
                            </v-chip>
                          </template>

                          <v-list subheader auto-height class="list-condensed">
                            <v-subheader>Post Status</v-subheader>

                            <v-radio-group v-model="post.status" class="p-0 mt-0">
                              <v-list-tile
                                v-for="cfg in config.status"
                                :key="cfg.value"
                                @click="post.status = cfg.value"
                                class="auto-height"
                              >
                                <v-list-tile-action>
                                  <v-radio :value="cfg.value"></v-radio>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                  <v-list-tile-title>{{ cfg.label }}</v-list-tile-title>
                                  <v-list-tile-sub-title>{{ cfg.description }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-radio-group>
                          </v-list>
                        </v-menu>
                      </v-layout>

                      <v-layout row align-center my-2>
                        <v-label class="my-1 mr-1 grow">
                          <i class="mdi mdi-eye mr-1"></i>Visibility:
                        </v-label>

                        <v-menu transition="slide-x-transition" left max-width="300">
                          <template v-slot:activator="{ on }">
                            <v-chip small text-color="white" v-on="on" class="ml-auto">
                              {{ visibilityLabel }}
                              <v-icon small right class="ml-2">mdi-lead-pencil</v-icon>
                            </v-chip>
                          </template>

                          <v-list subheader auto-height class="list-condensed">
                            <v-subheader>Post Visibility</v-subheader>

                            <v-radio-group v-model="post.visibility" class="p-0 mt-0">
                              <v-list-tile
                                v-for="cfg in config.visibility"
                                :key="cfg.value"
                                @click="post.visibility = cfg.value"
                                class="auto-height"
                              >
                                <v-list-tile-action>
                                  <v-radio :value="cfg.value"></v-radio>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                  <v-list-tile-title>{{ cfg.label }}</v-list-tile-title>
                                  <v-list-tile-sub-title>{{ cfg.description }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-radio-group>
                          </v-list>
                        </v-menu>
                      </v-layout>

                      <v-layout row align-center my-2>
                        <v-label class="my-1 mr-1 grow">
                          <i class="mdi mdi-calendar mr-1"></i>Publish:
                        </v-label>

                        <v-menu
                          transition="slide-x-transition"
                          left
                          max-width="300"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ on }">
                            <v-chip small text-color="white" v-on="on" class="ml-auto">
                              {{ publishLabel }}
                              <v-icon small right class="ml-2">mdi-lead-pencil</v-icon>
                            </v-chip>
                          </template>
                          <v-card>
                            <v-list subheader auto-height class="list-condensed">
                              <v-date-picker
                                v-model="post.published_at"
                                picker-date
                                color="green lighten-1"
                              ></v-date-picker>
                            </v-list>
                          </v-card>
                        </v-menu>
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
import moment from "moment";

export default {
  data() {
    let config = {
      panel: true,
      tabs: [true, false, false],
      status: [
        { value: 0, label: "Draft", description: "" },
        { value: 1, label: "Published", description: "" },
        { value: -1, label: "Pending Review", description: "" }
      ],
      visibility: [
        { value: 1, label: "Public", description: "Visible to everyone." },
        {
          value: 0,
          label: "Private",
          description: "Only visible to site admins and editors."
        },
        {
          value: -1,
          label: "Password Protected",
          description:
            "Protected with a password you choose. Only those with the password can view this post."
        }
      ]
    };

    return {
      config: config,

      success: null,
      errors: [],
      tab: false,

      baseUrl: this.$root.config.siteUrl,

      autoSlug: true,
      editSlug: false,
      loading: false,

      post: {
        id: this.$route.params.postId,
        title: null,
        slug: "",
        status: 0,
        visibility: 1,
        published_at: null
      },
      rules: {
        title: [v => !!v || "Title is required."]
      }
    };
  },
  computed: {
    actionLabel: function() {
      if (this.post.id) return "Update";

      return "Publish";
    },
    statusLabel: function() {
      return this.config.status.find(v => v.value === this.post.status).label;
    },
    visibilityLabel: function() {
      return this.config.visibility.find(v => v.value === this.post.visibility)
        .label;
    },
    publishLabel: function() {
      if (this.post.published_at) {
        return moment(this.post.published_at).format("MMM D, YYYY h:mma");
      }

      return "Immediately";
    }
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
    "post.published_at"(val) {
      console.log(val);
    },
    editSlug(val) {
      if (val === true) {
        setTimeout(() => {
          this.$refs.slug.focus();
        }, 50);
      }
    }
  },
  mounted() {
    console.log(this.$auth.profile);
    console.log(this.post);
    if (this.post.id) {
      this.loadPost();
    }
  },
  methods: {
    loadPost() {
      this.loading = true;
      this.$axios
        .get(`http://api.winks.localhost:3000/v1/posts/${this.post.id}`)
        .then(response => {
          if (response.data) this.post = response.data;
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(() => {
          this.loading = false;
        });
    },
    savePost() {
      this.errors = [];
      this.success = null;
      this.loading = true;

      let endpoint = "http://api.winks.localhost:3000/v1/posts";
      endpoint += this.post.id ? `/${this.post.id}` : null;

      let params = {
        user_id: this.$auth.profile.id,
        title: this.post.title,
        content: this.post.content,
        slug: this.post.slug,
        status: this.post.status,
        sort: 0,
        format: 0,
        comment_status: 0,
        visibility: this.post.visibility,
        published_at: this.post.published_at
      };

      this.$axios
        .request({
          method: this.post.id ? "put" : "post",
          url: endpoint,
          data: params
        })
        .then(response => {
          this.post = response.data ? response.data : [];
          this.success = `<b>"${this.post.title}"</b> was successfully saved.`;
        })
        .catch(error => {
          console.log(error.response);
          this.errors.push(
            `${error.response.data.status}: ${error.response.data.error}`
          );
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>