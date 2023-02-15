import {Toast} from "./webcom.es.js";

export const copy = (text) => {
	(async () => {
		navigator.clipboard.writeText(text).then(() => {
			Toast.showSuccess('Content Copied: ' + text);
		}).catch(() => {
			Toast.showError('Copy Failed');
		});
	})();
};

export const scrollToAnchor = (name)=>{
	let n = document.querySelector(`a[name="${name}"]`);
	if(n){
		n.scrollIntoView({behavior: 'smooth'});
	}
}
export const matchOrParent = (node, selector) => {
	while(node){
		if(node.matches && node.matches(selector)){
			return node;
		}
		node = node.parentNode;
	}
	return false;
}