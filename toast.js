import {insertStyle} from "./util.js";

let toastDom = null;
let toastTimer = null;

insertStyle(`
	.toast{position:fixed; top:5px; width:100%; height:0; text-align:center;}
	.toast .ctn{display:inline-block; border-radius:3px; padding:0.5em 3em 0.5em 2em; background-color:#ffffffa8; box-shadow:1px 1px 4px #cccccc;}
	.toast .close{color:gray;}
	.toast .close:before{content:"×"; font-size:25px; cursor:pointer; position:absolute; margin:0 0 0 -30px; transition:all 0.1s linear;}
	.toast .close:hover{color:black;}
	.toast-success .ctn{background-color:#008000f5; color:white;}
	.toast-success .close{color:#eeeeee}
	.toast-success .close:hover{color:white;}
	
	.toast-info .ctn{background-color:#fff; color:var(--color);}
	.toast-info .close{color:#666}
	.toast-info .close:hover{color:var(--color);}
	
	.toast-success .ctn{background-color:#206098F5; color:white;}
	.toast-success .close{color:#eeeeee}
	.toast-success .close:hover{color:white;}
`)

export const showInfo = (msg)=>{
	showToast(msg, 'info');
}

export const showError = (msg) => {
	showToast(msg, 'error');
}

export const showToast = (msg, type = 'success', timeout = 1500) => {
	toastTimer && clearTimeout(toastTimer);
	if(!toastDom){
		toastDom = document.createElement('div');
		document.body.appendChild(toastDom);
		toastDom.className = 'toast';
		toastDom.innerHTML = `<span class="ctn"></span><span class="close"></span>`;
		toastDom.querySelector('.close').addEventListener('click', e => {
			hideToast();
		});
	}
	toastDom.className = 'toast toast-' + type;
	toastDom.querySelector('.ctn').innerHTML = msg;
	toastDom.style.display = 'block';
	toastTimer = setTimeout(hideToast, timeout);
}

export const hideToast = () => {
	if(toastDom){
		toastDom.style.display = 'none';
	}
};
