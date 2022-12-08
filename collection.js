import {copy, createFragment, insertStyle} from "./util.js";
import {showInfo, showToast} from "./toast.js";
import {wrapCharacter} from "./char.js";
import {showContextMenu} from "./context.js";

const COLL_KEY = 'collection';

insertStyle(`
	.collection{position:fixed; z-index:9; opacity:0.5; transition:all 0.3s linear; bottom:10px; right:30px; max-width:400px; box-shadow:var(--panel-shadow); background-color:#fffffff5; padding:.5em; display:flex; border-radius:40px;}
	.collection.active{opacity:1; border-radius:5px;}
	.collection dt{flex:1; max-width:35px; cursor:pointer;}
	.collection dt:before{content:"🎨"; font-size:1.5rem;}
	.collection dd{flex:1; display:none; max-height:300px; overflow-y:auto; overflow-x:hidden; transition:all 0.5s linear; background-color:#eeeeee; padding:0.5rem; border-radius:5px;}
	.collection [data-char]{display:inline-block; padding:0.25rem 0.5rem; height:40px; overflow:hidden; background-color:#ffffff; margin:3px; cursor:pointer; box-shadow:1px 1px 5px #cccccc;}
	.collection [data-char]:hover{background-color:#7991e0f9; color:white;}
	.collection.active dd{display:block;}
	.collection [data-char]{font-size:1.5rem;}
`);

document.body.appendChild(createFragment(`
<dl class="collection">
	<dt title="Toggle"></dt>
	<dd></dd>
</dl>
`));

/**
 * Collection
 * @type {Element}
 */
let collectionCon = document.querySelector('.collection dd');
(JSON.parse(localStorage.getItem(COLL_KEY)) || []).forEach(unicode => {
	collectionCon.appendChild(createFragment(`<span data-char="${unicode}" title="click to copy">${unicode}</span>`));
});

document.querySelector('.collection dt').addEventListener('click', e => {
	document.querySelector('.collection').classList.toggle('active');
});

collectionCon.addEventListener('contextmenu', e => {
	if(e.target.matches('[data-char]')){
		let unicode = e.target.getAttribute('data-char');
		showContextMenu([
			[`Copy as character: <var class="char">${unicode}</var>`, ()=>{copy(unicode);}],
			[`Copy as image: <var class="char">${unicode}</var>`, ()=>{copy(unicode);}],
			'-',
			[`Remove from collection`, ()=>{removeFromCollection(unicode);}],
		], e);
	} else {
		showContextMenu([
			['Copy All As Text', e => {
				copyAllCollection()
			}],
			'-',
			['Clean Collection', e => {
				cleanCollection()
			}]
		], e);
	}
});

collectionCon.addEventListener('click', e=>{
	if(e.target.matches('[data-char]')){
		copy(e.target.getAttribute('data-char'));
	}
})

export const showCollection = () => {
	document.querySelector('.collection').classList.add('active');
}

export const hideCollection = ()=>{
	document.querySelector('.collection').classList.remove('active');
}

export const addCollection = (unicode) => {
	showInfo('Added to collection: ' + wrapCharacter(unicode));
	if(collectionCon.querySelector(`[data-char="${unicode}"]`)){
		return;
	}
	let coll = JSON.parse(localStorage.getItem(COLL_KEY)) || [];
	coll.push(unicode);
	localStorage.setItem(COLL_KEY, JSON.stringify(coll));
	collectionCon.appendChild(createFragment(`<span data-char="${unicode}" title="click to copy">${unicode}</span>`));
};

export const copyAllCollection = () => {
	let coll = JSON.parse(localStorage.getItem(COLL_KEY)) || [];
	let txt = coll.join('');
	if(txt.length){
		copy(txt);
	}else{
		showInfo('Collection empty');
	}
}

export const removeFromCollection = (unicode) => {
	let coll = JSON.parse(localStorage.getItem(COLL_KEY)) || [];
	coll = coll.filter(c => {
		return c !== unicode;
	});
	localStorage.setItem(COLL_KEY, JSON.stringify(coll));
	let item = collectionCon.querySelector(`[data-char="${unicode}"]`);
	item.parentNode.removeChild(item);
	showToast(wrapCharacter(unicode) + ' removed from collection');
};

export const cleanCollection = () => {
	collectionCon.innerHTML = '';
	localStorage.setItem(COLL_KEY, JSON.stringify([]));
	showToast('Collection Clean!');
	hideCollection();
}
