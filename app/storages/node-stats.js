import StorageArray from 'ember-local-storage/session/array';

const Storage = StorageArray.extend();

// Uncomment if you would like to set initialState
// Storage.reopenClass({
//   initialState() {
//     return [];
//   }
// });

export default Storage;