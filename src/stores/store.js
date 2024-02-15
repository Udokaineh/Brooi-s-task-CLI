import { createStore } from 'vuex';

export default createStore({
  state: {
    statusOptions: [
      { text: 'In progress', value: 'inprogress', class: 'inprogress' },
      { text: 'Pending', value: 'pending', class: 'pending' },
      { text: 'Completed', value: 'completed', class: 'completed' }
    ],
    userArray: [] // Each item will have a status property
  },
  mutations: {
    // Mutations and actions if any
  },
  getters: {
    getStatusOptions: state => state.statusOptions,
    getUserArray: state => state.userArray
  }
});

