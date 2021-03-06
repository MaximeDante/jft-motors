<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="600">
          <div style="display: flex">
            <v-img class="white--text align-end" width="45%" :src="business" />
            <v-img class="white--text align-end" width="45%" :src="services" />
          </div>
          <v-card-subtitle class="pb-0">Role: {{ user.role }}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div data-cy="user-full-name">
              {{ `${user.firstname} ${user.lastname}` }}
            </div>
          </v-card-text>

          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container>
              <v-row class="px-3">
                <v-col cols="12" md="6">
                  <v-text-field
                    filled
                    readonly
                    value="JFT Motors"
                    label="Company (name)"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    filled
                    readonly
                    :value="user.email"
                    label="Email Address"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                    :value="user.firstname"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                    :value="user.lastname"
                  />
                </v-col>

                <v-col cols="12" class="mb-n6">
                  <v-banner class="mb-2" icon="mdi-map" single-line sticky>
                    Business Address
                  </v-banner>
                </v-col>

                <v-col cols="8" md="8">
                  <v-text-field
                    label="Street Address"
                    class="purple-input"
                    v-model="details.address.street"
                  />
                </v-col>
                <v-col cols="4" md="4">
                  <v-text-field
                    label="Suburb"
                    class="purple-input"
                    v-model="details.address.suburb"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="City"
                    class="purple-input"
                    v-model="details.address.city"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Country"
                    class="purple-input"
                    v-model="details.address.country"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                    v-model="details.address.zipcode"
                  />
                </v-col>

                <v-col cols="12">
                  <v-banner
                    sticky
                    single-line
                    class="mb-2"
                    icon="mdi-notebook-edit"
                  >
                    Settings / Rules
                  </v-banner>
                  <v-row>
                    <v-col cols="12">
                      <h3>Total Discount</h3>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="number"
                        label="Rand amount"
                        class="purple-input"
                        v-model="discounts.rands"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        type="number"
                        label="Percentage"
                        class="purple-input"
                        v-model="discounts.percentage"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch
                        inset
                        label="Allow Discounts"
                        v-model="discounts.allowed"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0" @click="update">
                    Update Settings
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppEditor from "@/components/layouts/AppManager.vue";
import User from "@/models/User";
import { curd, watchDocument } from "@/services/curd.service";
import { db } from "@/firebase";

@Component({
  components: { AppEditor }
})
export default class Business extends Vue {
  get user(): User {
    return this.$store.state.auth.user;
  }

  watcher: any = null;

  details = this.$store.state.details;

  discounts = {
    rands: 150,
    allowed: false,
    percentage: 15
  };

  update() {
    curd.update(this.details, "settings", "business-details");
    curd.update({ discounts: this.discounts }, "settings", "rules");
  }

  created() {
    this.watcher = watchDocument(db.doc("/settings/rules"), data => {
      const { discounts } = data;
      if (discounts) {
        this.discounts = discounts;
        this.$store.commit("SET_RULES", { discounts });
      }
    });
  }

  destroyed() {
    this.watcher();
  }

  get business() {
    return require("@/assets/business.jpg");
  }

  get services() {
    return require("@/assets/business-services.jpg");
  }
}
</script>
