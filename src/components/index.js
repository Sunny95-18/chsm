//import comboDatebox from './date/combo-datebox'

//Vue.component("combo-datebox",comboDatebox)

Vue.prototype.$eventTarget= Vue.prototype.$eventTarget ||  new Vue({
     methods : {
		 on(eventName,fn) {
		    this.$on(eventName,fn); 
		 },
	     broadcast(eventName,params) {
		    this.$emit(eventName,params);
		 }
	 }
});
