import {showContextMenu} from "./context.js";
import {addCollection, removeFromCollection} from "./collection.js";
import {copy} from "./util.js";

export const showCharContextMenu = (unicode, dimension) => {
	showContextMenu([
		[`Copy as character: <var class="char">${unicode}</var>`, ()=>{copy(unicode);}],
		[`Copy as image: <var class="char">${unicode}</var>`, ()=>{copy(unicode);}],
		'-',
		[`Add to collection`, ()=>{addCollection(unicode);}],
		[`Remove from collection`, ()=>{removeFromCollection(unicode);}],
	], dimension);
}

export const wrapCharacter = unicode =>{
	return `<span class="char">${unicode}</span>`;
}

