<template>
  <header class="header-container">
    <div class="notes-header">
      <div class="logo">
        <h2>{{ title }}</h2>
        <div class="create-to-do-div">
          <button type="button" @click="createButtonClicked" class="create-button">
            Create to-do items
          </button>
        </div>
      </div>
      <div class="search">
        <input
          type="text"
          placeholder="Search to-do items..."
          id="searchInput"
          v-model="searchQuery"
        />
      </div>
    </div>
  </header>
</template>


<script>
export default {
  name: 'Header',
  data() {
    return {
      title: 'Welcome to your TO-DO App!',
      searchQuery: ''
    }
  },
  methods: {
 createButtonClicked() {
      this.$emit('create-button-clicked')
    }
  }
}
</script>
