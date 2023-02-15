import {showContextMenu} from "./context.js";
import {addCollection, removeFromCollection} from "./collection.js";
import {copy} from "./util.js";
import {Dialog} from "./webcom.es.js";

const DEFAULT_COLOR = '#000000';
const DEFAULT_BG_COLOR = '';

const MIN_EXPORT_IMG_SIZE = 10;
const MAX_EXPORT_IMG_SIZE = 200;
const DEFAULT_EXPORT_IMG_SIZE = 50;

const MIN_EXPORT_FONT_PERCENT = 50;
const MAX_EXPORT_FONT_PERCENT = 100;
const DEFAULT_EXPORT_FONT_PERCENT = 80;

export const exportAsImage = (unicodeList) => {
	let html = `<div class="export-img">
					<ul class="export-option">
						<li>
							<label>Font Color:</label>
							<input type="color" value="#000000">
						</li>
						<li>
							<label>Background Color:</label>
							<label>
								<input type="radio" name="bgc" checked="checked" value="transparent" class="qwc-check">
								<span class="transparent-btn"></span>
							</label>
							<label>
								<input type="radio" name="bgc" value="color" class="qwc-check">
								<input type="color" value="#fff">
							</label>
						</li>
						<li>
							<label>Image Size:</label>
							<input type="range" rel="img-size" value="${DEFAULT_EXPORT_IMG_SIZE}" min="${MIN_EXPORT_IMG_SIZE}" max="${MAX_EXPORT_IMG_SIZE}">
							<input type="number" rel="img-size" placeholder="${DEFAULT_EXPORT_IMG_SIZE}" value="${DEFAULT_EXPORT_IMG_SIZE}" class="qwc-text"> Pixel
						</li>
						<li>
							<label>Font Percent:</label>
							<input type="range" rel="font-percent" value="${DEFAULT_EXPORT_FONT_PERCENT}" min="${MIN_EXPORT_FONT_PERCENT}" max="${MAX_EXPORT_FONT_PERCENT}">
							<input type="number" rel="font-percent" value="${DEFAULT_EXPORT_FONT_PERCENT}" placeholder="${DEFAULT_EXPORT_FONT_PERCENT}" class="qwc-text"> %
						</li>
					</ul>
					<div class="export-preview" style="--img-size:${DEFAULT_EXPORT_IMG_SIZE}px; --font-percent:${DEFAULT_EXPORT_FONT_PERCENT}">
						<var><span>${unicodeList.join('</span></var><var><span>')}<span></var>
					</div>
				</div>`;
	let dlg = Dialog.show('Export as image', html, {
		buttons: [
			{title:"Export PNG", callback:()=>{

			}},
			{title:"Close"}
		],
		width:600
	});
	let preview = dlg.dom.querySelector('.export-preview');
	dlg.dom.querySelector('input[name="bgc"]').addEventListener('input', e=>{
		preview.style.setProperty('--bg-color', e.target.value);
	});

	let inputs = dlg.dom.querySelectorAll('input[rel]');
	inputs.forEach(input => {
		input.addEventListener('input', e => {
			let rel = input.getAttribute('rel');
			Array.from(inputs).filter(inp => {
				if (inp.getAttribute('rel') === rel && input !== inp) {
					inp.value = input.value;
				}
			});
			preview.style.setProperty('--' + rel, input.value + (rel === 'font-percent' ? '' : 'px'));
		});
	});
}

export const showCharContextMenu = (unicode, eventDimension) => {
	showContextMenu([
		[`Copy Character: <var class="char">${unicode}</var>`, () => {
			copy(unicode);
		}],
		[`Copy Unicode: <var class="char">${escape(unicode).replace(/%/g, '\\')}</var>`, () => {
			copy(escape(unicode).replace(/%/g, '\\'));
		}],
		[`Copy JS Code: <var class="char">${escape(unicode).replace(/%u([^%]+)/g, '\\u{$1}')}</var>`, () => {
			copy(escape(unicode).replace(/%u([^%]+)/g, '\\u{$1}'));
		}],
		[`Copy Image: <var class="char">${unicode}</var>`, () => {
			char2Png(unicode);
		}],
		[`Export As Image: <var class="char">${unicode}</var>`, () => {
			exportAsImage([unicode]);
		}],
		'-',
		[`Add Collection`, () => {
			addCollection(unicode);
		}],
		[`Remove Collection`, () => {
			removeFromCollection(unicode);
		}],
	], eventDimension);
}

export const wrapCharacter = unicode => {
	return `<span class="char">${unicode}</span>`;
}

let charSP = null;
export const char2Png = (unicode, fileName = 'img.png') => {
	if (!charSP) {
		charSP = document.createElement('span');
		charSP.className = 'char2png';
		document.body.appendChild(charSP);
	}
	charSP.style.display = '';
	charSP.innerText = unicode;

	html2canvas(charSP, {
		backgroundColor: null
	}).then(canvas => {
		let pngData = canvas.toDataURL('image/png');
		downloadData(pngData, fileName);
	});
}

let downloadLink = null;
export const downloadData = (data, fileName) => {
	data = data.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
	data = data.replace(/^data:application\/octet-stream/, `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=${fileName}`);
	if (!downloadLink) {
		downloadLink = document.createElement('a');
		document.body.appendChild(downloadLink);
	}
	downloadLink.style.display = '';
	downloadLink.href = data;
	downloadLink.download = fileName;
	downloadLink.click();
	downloadLink.style.display = 'none';
}