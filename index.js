import {EmojiList} from "./data.js";
import {copy, createFragment, scrollToAnchor} from "./util.js";
import {showCharContextMenu} from "./char.js";
import {addCollection} from "./collection.js";

let html = '';
let asideHtml = '<ul>';
for(let cat in EmojiList){
	html += `<h2><a name="${encodeURI(cat)}">${cat}</a></h2><ul class="char-list">`;
	asideHtml += `<li><a href="#${encodeURI(cat)}">${cat}</a></li>`;
	EmojiList[cat].forEach(char => {
		html += `<li data-char="${char}">
						<span class="char-item" title="click to copy">${char}</span>
						<span class="add-collection" data-cmd="add-collection" title="Add to collection">Add Coll</span>
					</li>`;
	});
	html += `</ul>`;
}
asideHtml += '</ul>';
document.querySelector('aside').appendChild(createFragment(asideHtml));
document.querySelector('.content').appendChild(createFragment(html));

if(document.location.hash){
	scrollToAnchor(location.hash.substring(1));
}

document.querySelectorAll('aside ul a').forEach(a => {
	if(a.hash[0] === '#'){
		a.addEventListener('click', e=>{
			scrollToAnchor(a.hash.substring(1));
			e.preventDefault();
			return false;
		});
	}
})

document.querySelectorAll('.char-list li').forEach(n => {
	n.addEventListener('contextmenu', e => {
		showCharContextMenu(n.getAttribute('data-char'), {left: e.clientX, top: e.clientY});
	});
});
document.querySelectorAll('.char-list .char-item').forEach(n => {
	n.addEventListener('click', e => {
		copy(n.parentNode.getAttribute('data-char'));
	});
});
document.querySelectorAll('.char-list .add-collection').forEach(n => {
	n.addEventListener('click', e => {
		addCollection(n.parentNode.getAttribute('data-char'));
	});
});
