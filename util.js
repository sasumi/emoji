import {Dialog, Toast, copy as CopyFn} from "./webcom.es.js";

export const copy = (text) => {
	try{
		if(!CopyFn(text, true)){
			throw "内容复制失败";
		}
		Toast.showSuccess('内容已复制：' + text);
	}catch(err){
		Dialog.prompt('复制失败，请使用 Ctrl+C复制', {initValue: text}).catch(e => {});
	}
};

export const scrollToAnchor = (name) => {
	let n = document.querySelector(`a[name="${name}"]`);
	if(n){
		n.scrollIntoView({behavior: 'smooth'});
	}
}