<template>
  <v-app>
    <site-navbar/>
    <h1>This is Home</h1>
    <router-view></router-view>
    <site-footer/>
  </v-app>
</template>
<script>

export default {
  name: 'Home',
}
</script>
