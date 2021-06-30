<template>
  <div>
    <b-btn
      :class="[{ 'open': expanded }]"
      class="hamburger g5-header-menu-trigger"
      variant="transparent"
      style="padding-top: 0.4em;"
      @click="expanded = !expanded"
    >
      <span class="hamburger-box">
        <span class="hamburger-inner" />
      </span>
    </b-btn>
    <!-- Nav Container -->
    <b-collapse
      v-model="expanded"
      style="z-index: 100; position: absolute; top: 65px; left: 0; right: 0; background-color: var(--primary-10)"
    >
      <b-navbar type="dark" size="sm" style="height: 80px;" variant="tertiary">
        <b-navbar-nav style="font-size: 1.25em; font-weight: bold;">
          <b-nav-item href="/">
            Home
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </b-collapse>
  </div>
</template>

<script>
export default {
  data () {
    return {
      expanded: false
    }
  }
}
</script>

<style lang="scss">
#navbar-toggle-collapse .nav-link {
  padding-right: 3rem;
  color: rgba(255, 255, 255, 0.7);
}
#navbar-toggle-collapse .nav-link:hover {
  color: rgba(255, 255, 255, 1);
}
#nav-dropdown-menu .dropdown-menu {
  top: 50px !important;
  right: 45px;
  padding: 1px;
  background-color: var(--tertiary-30);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 .5em .75em rgba(12, 35, 64, 0.25);
  & .dropdown-item {
    color: white;
  } & .dropdown-item:hover {
    color: black;
  }
}
</style>
