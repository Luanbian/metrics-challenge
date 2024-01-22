<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link to="/maps" :name="$t('sidebar.maps')" icon="tim-icons icon-upload"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <dashboard-content @click.native="toggleSidebar">
      </dashboard-content>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import DashboardContent from "./Content.vue";
export default {
  components: {
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
