import {createDomByHtml, insertStyleSheet} from "./webcom.es.js";

let context;
let context_showing = false;

insertStyleSheet(`
	.context-menu{position:absolute; z-index:10; min-width:180px; padding:5px 0; border-radius:5px; background-color:#fffffff5; box-shadow:var(--panel-shadow);}
	.context-menu .item-content{padding:0.5em 1em; display:block; cursor:pointer;}
	.context-menu .item-content:hover{background-color:#eeeeee;}
	.context-menu var{font-style:normal}
	.context-menu .sep{border-top:1px solid #dddddd; border-bottom:1px solid white; margin:0 0.5em}
`);

/**
 * 显示菜单
 * @param {Array} menuItems [[title, payload], '-', []]
 * @param eventDimension
 */
export const showContextMenu = (menuItems, eventDimension)=>{
	context_showing = true;
	setTimeout(() => {
		context_showing = false;
	}, 10);

	if(!context){
		context = document.createElement('ul');
		document.body.appendChild(context);
		context.className = 'context-menu';
		context.addEventListener('click', hideContextMenu);
		document.body.addEventListener('click', e => {
			hideContextMenu();
		});
	}

	context.innerHTML = '';
	menuItems.forEach(item=>{
		if(item === '-'){
			context.appendChild(createDomByHtml('<li class="sep"></li>'));
			return;
		}
		let [title, payload] = item;
		let li = document.createElement('li');
		li.innerHTML = `<span class="item-content">${title}</span>`;
		context.appendChild(li);
		li.addEventListener('click', payload);
	});

	context.style.left = '0px';
	context.style.top = '0px';
	context.style.visibility = 'hidden';
	context.style.display = 'block';
	let scrollLeft = document.body.parentNode.scrollLeft;
	let scrollTop = document.body.parentNode.scrollTop;
	let maxLeft = Math.min(scrollLeft + document.body.clientWidth - context.offsetWidth - 20, scrollLeft + eventDimension.clientX);
	let maxTop = Math.min(scrollTop + document.body.clientHeight - context.offsetHeight - 20, scrollTop + eventDimension.clientY);
	context.style.left = maxLeft + 'px';
	context.style.top = maxTop + 'px';
	context.style.visibility = 'visible';
}

export const hideContextMenu = () => {
	if(!context_showing && context){
		context.style.display = 'none';
	}
}

//prevent all default context event
document.body.addEventListener('contextmenu', e=>{e.preventDefault();});
document.body.addEventListener('keyup', e=>{
	if(e.code === 'Escape'){
		hideContextMenu();
	}
})
