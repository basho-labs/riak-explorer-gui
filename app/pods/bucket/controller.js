import Ember from 'ember';
import SideDrawer from '../../mixins/controller/side-drawer';
import Modal from '../../mixins/controller/modal';

export default Ember.Controller.extend(SideDrawer, Modal, {
  pageSize: null,

  currentObjects: null,

  showCachedListWarning: true
});
