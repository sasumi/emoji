import {
	insertStyle
} from "./util.js";

export const showDialog = ({
	title,
	content,
	closeButton = true,
	width = 500
}) => {
	let dialog = document.createElement('dialog');
	dialog.className = 'qwc-dialog';
	document.body.appendChild(dialog);
	dialog.innerHTML = `
		<div class="dlg-ti">${title}</div>
		${closeButton ? '<span class="dlg-close"></span>':''}
		<div class="dlg-ctn">${content}</div>
	`;
	dialog.style.display = 'block';
	dialog.style.width = width + 'px';
	if (closeButton) {
		dialog.querySelector('.dlg-close').addEventListener('click', e => {
			dialog.parentNode.removeChild(dialog)
		});
	}
	return dialog;
}