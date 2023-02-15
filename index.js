import {EmojiList} from "./data.js";
import {copy, scrollToAnchor} from "./util.js";
import {exportAsImage, showCharContextMenu} from "./char.js";
import {addCollection} from "./collection.js";
import {showContextMenu} from "./context.js";
import {createDomByHtml} from "./webcom.es.js";

let html = '';
let asideHtml = '<ul>';
for (let cat in EmojiList) {
	html += `<h2><a smooth-anchor="1" href="#${encodeURI(cat)}" name="${encodeURI(cat)}">${cat}</a></h2><ul class="char-list">`;
	asideHtml += `<li><a smooth-anchor="1" href="#${encodeURI(cat)}">${cat}</a></li>`;
	EmojiList[cat].forEach(char => {
		html += `<li data-char="${char}">
						<span class="char-item" title="click to copy">${char}</span>
						<span class="add-collection" data-cmd="add-collection" title="Add to collection">Add Coll</span>
					</li>`;
	});
	html += `</ul>`;
}
asideHtml += '</ul>';
document.querySelector('aside').appendChild(createDomByHtml(asideHtml));
document.querySelector('.content').appendChild(createDomByHtml(`<div>${html}</div>`));

if (document.location.hash) {
	scrollToAnchor(location.hash.substring(1));
}

document.querySelectorAll('a[smooth-anchor]').forEach(a => {
	if (a.hash[0] === '#') {
		a.addEventListener('click', e => {
			scrollToAnchor(a.hash.substring(1));
			e.preventDefault();
			history.pushState({}, '', a.hash);
			return false;
		});
	}
});

document.querySelectorAll('.char-list').forEach(n => {
	n.addEventListener('contextmenu', e => {
		if (e.target.matches('.char-list')) {
			showContextMenu([
				['Copy All To Text', () => {
					let text = '';
					e.target.querySelectorAll('.char-item').forEach(c => {
						text += c.innerText;
					});
					copy(text);
				}],
				[`Export All As Image`, () => {
					let unicodeList = [];
					e.target.querySelectorAll('.char-item').forEach(c => unicodeList.push(c.innerText));
					exportAsImage(unicodeList);
				}],
				'-',
				['Add All To Collection', () => {
					e.target.querySelectorAll('.char-item').forEach(c => {
						addCollection(c.innerText);
					});
				}],
			], e);
		}
	})
});

document.querySelectorAll('.char-list li').forEach(n => {
	n.addEventListener('contextmenu', e => {
		showCharContextMenu(n.getAttribute('data-char'), e);
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