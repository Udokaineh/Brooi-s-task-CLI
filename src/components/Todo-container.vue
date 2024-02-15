<template>
  <div class="notes-wrapper">
    <Header @create-button-clicked="createButtonClicked" />

    <div class="to-do-container">
      <div ref="notes" class="notes" id="fullPageDisplay">
        <div class="left-scroll-div" id="halfDisplay">
          <div
            v-for="(items, index) in filteredItems"
            :key="index"
            class="title-para-div"
            id="titleParaDiv"
            tabindex="0"
            @click="selectItem(items)"
          >
            <div class="date-div">
              <h4 v-if="items">{{ items.date }}</h4>
              <i @click="deleteItem(index)" class="fa fa-trash"></i>
            </div>
            <div class="title-div">
              <h4>{{ items.title }}</h4>
              <ul id="statusUpdate">
                <!-- <li class="status"> -->
                <li class="status" :style="getBackgroundStyles(items.status)">
                  {{ items.status || 'Task Status' }}
                  <i class="fa fa-caret-down"></i>
                  <ul class="status-option">
                    <li
                      v-for="option in statusOptions"
                      :key="option.value"
                      :class="getOptionClass(option.class)"
                      @click="setStatus(items, option.text, option.class)"
                    >
                      {{ option.text }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="para-div">
              <p>{{ items.para }}</p>
            </div>
          </div>
          <p v-if="filteredItems.length === 0" class="not-found" id="notFound">Item Not Found</p>
        </div>

        <div ref="DisplayAndFormDiv" class="display-and-form-div" id="DisplayAndFormDiv">
          <div
            :class="{ 'dummy-display': dummyDisplay, 'dummy-display-hide': !dummyDisplay }"
            id="dummyDisplay"
          >
            <h2>Welcome! click on the button above to add to-do items...</h2>
          </div>
          <div
            :class="{ 'right-scroll': rightScroll, 'right-scroll-hide': !rightScroll }"
            id="rightScrollDiv"
            v-if="recentlyAddedItem || selectedItem"
          >
            <div class="right-display-div" id="rightDisplayDiv">
              <div class="title-edit-div">
                <h3 class="right-display-title" id="rightDisplayTitle">
                  {{ recentlyAddedItem ? recentlyAddedItem.title : selectedItem.title }}
                </h3>
                <i @click="editText(selectedItem, selectedItemIndex)" class="fa fa-pen"></i>
              </div>
              <p class="right-display-para" id="rightDisplayPara">
                {{ recentlyAddedItem ? recentlyAddedItem.para : selectedItem.para }}
              </p>
            </div>
          </div>

          <form
            ref="form"
            id="inputDiv"
            :class="{ 'display-form-hide': formHidden, 'display-form': !formHidden }"
            @submit.prevent="collectData"
          >
            <div class="close-icon-div">
              <i class="fa fa-xmark" id="closeIcon" @click="close"></i>
            </div>
            <label for="displayDate" class="display-label">Enter Date</label>
            <input
              v-model="dateValue"
              ref="dateInput"
              value=""
              class="date-input"
              id="displayDate"
              type="date"
            />

            <label for="displayTitle" @input="adjustTextareaHeight" class="display-label"
              >Enter Title</label
            >
            <textarea
              v-model="titleValue"
              value=""
              class="display-title-div"
              id="displayTitle"
            ></textarea>

            <label for="paraText" class="display-para">Write Notes Here</label>
            <textarea
              v-model="paraValue"
              value=""
              @input="adjustTextareaHeight"
              class="display-para-div"
              id="paraText"
            ></textarea>

            <button type="submit" class="button">Add to-do items</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TodoContainer',
  components: {
    Header
  },
  data() {
    return {
      formHidden: true,
      dummyDisplay: true,
      dateValue: '', // Separate data properties for each input
      titleValue: '',
      paraValue: '',
      rightScroll: false,
      userArray: [],
      recentlyAddedItem: null,
      selectedItem: null,
      statusText: 'Task status',
      statusClass: '',
      searchQuery: '',
      selectedItemStatus: '',
      statusOptions: [
        { value: 'inprogress', text: 'In progress', class: 'inprogress' },
        { value: 'pending', text: 'Pending', class: 'pending' },
        { value: 'completed', text: 'Completed', class: 'completed' }
      ]
    }
  },
  methods: {
    ...mapActions(['updateItemStatus']),
    setStatus(item, status) {
      this.updateItemStatus({ item, status })
    },

    createButtonClicked() {
      this.formHidden = false
      this.dummyDisplay = false
      this.$nextTick(() => {
        this.$refs.dateInput.focus()
      })
      this.hideRightScroll()
    },
    close() {
      this.formHidden = true
      this.dummyDisplay = true
      this.hideRightScroll()
    },

    collectData(e) {
      e.preventDefault()

      const newItem = {
        date: this.dateValue || 'Date?',
        title: this.titleValue,
        para: this.paraValue
      }

      this.recentlyAddedItem = newItem

      this.userArray.unshift(newItem)
      localStorage.setItem('userData', JSON.stringify(this.userArray))

      this.dateValue = ''
      this.titleValue = ''
      this.paraValue = ''
      this.revealRightScroll()
      this.hideForm(this.$refs.form)
      this.revealRightScroll()
    },

    hideRightScroll() {
      this.rightScroll = false
    },
    hideForm(form) {
      form.reset()
      this.formHidden = true
    },

    revealRightScroll() {
      this.rightScroll = true
    },

    selectItem(items) {
      this.recentlyAddedItem = items
      this.selectedItem = items
      this.revealRightScroll()
      this.dummyDisplay = false
    },

    deleteItem(index) {
      this.userArray.splice(index, 1)
      localStorage.setItem('userData', JSON.stringify(this.userArray))
    },
    editText(items, index) {
      this.editedItem = items
      this.hideRightScroll()
      this.formHidden = false
      // Update form fields (using data binding)
      this.titleValue = items.title
      this.paraValue = items.para
      this.deleteItem(index)
    },

    adjustTextareaHeight(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    },

    getOptionClass(option) {
      // Return class based on optionValue
      switch (option) {
        case 'inprogress':
          return 'inprogress'
        case 'pending':
          return 'pending'
        case 'completed':
          return 'completed'
        default:
          return 'status'
      }
    },
    getBackgroundStyles(status) {
      switch (status) {
        case 'In progress':
          return { backgroundColor: '#f4dbbb', color: '#b87721' }
        case 'Pending':
          return { backgroundColor: '#cacaca', color: '#505050' }
        case 'Completed':
          return { backgroundColor: '#adff2f', color: '#006900' }
        default:
          return { backgroundColor: '#e3e3e3', color: '#161616' }
      }
    },

    setStatus(item, status, cssClass) {
      if (item) {
        this.selectedItem = item // Set selectedItem to the clicked item
        this.selectedItem.status = status
        localStorage.setItem('userData', JSON.stringify(this.userArray))
      }
    },

    searchItems() {
      return this.userArray.filter((item) => {
        // Filter based on title and para, you can extend this logic as needed
        return (
          item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.para.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      })
    }
  },

  computed: {
    displayedItem() {
      return this.selectedItem || this.recentlyAddedItem
    },
    filteredItems() {
      // Return filtered items based on search query
      return this.searchQuery ? this.searchItems() : this.userArray
    },
    ...mapGetters(['getStatusOptions', 'getUserArray'])
  },

  mounted() {
    if (localStorage.getItem('userData')) {
      this.userArray = JSON.parse(localStorage.getItem('userData'))
    }
  }
}
</script>
