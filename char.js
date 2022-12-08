import {showContextMenu} from "./context.js";
import {addCollection, removeFromCollection} from "./collection.js";
import {copy} from "./util.js";

export const showCharContextMenu = (unicode, dimension) => {
	showContextMenu([
		[`Copy Character: <var class="char">${unicode}</var>`, ()=>{copy(unicode);}],
		[`Copy Unicode: <var class="char">${escape(unicode).replace(/%/g, '\\')}</var>`, ()=>{copy(escape(unicode).replace(/%/g, '\\'));}],
		[`Copy JS Code: <var class="char">${escape(unicode).replace(/%u([^%]+)/g, '\\u{$1}')}</var>`, ()=>{copy(escape(unicode).replace(/%u([^%]+)/g, '\\u{$1}'));}],
		'-',
		[`Add Collection`, ()=>{addCollection(unicode);}],
		[`Remove Collection`, ()=>{removeFromCollection(unicode);}],
	], dimension);
}

export const wrapCharacter = unicode =>{
	return `<span class="char">${unicode}</span>`;
}
