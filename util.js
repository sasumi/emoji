export const copy = (text) => {
	(async () => {
		const {showInfo, showError} = await import('./toast.js');
		navigator.clipboard.writeText(text).then(() => {
			showInfo('Content copied: ' + text);
		}).catch(() => {
			showError('Copy Failed');
		});
	})();
};

export const insertStyle = (styleSheetStr, id = '') => {
	let style = document.createElement('style');
	document.head.appendChild(style);
	style.innerHTML = styleSheetStr;
	if(id){
		style.id = id;
	}
	return style;
};

export const matchOrParent = (node, selector) => {
	while(node){
		if(node.matches && node.matches(selector)){
			return node;
		}
		node = node.parentNode;
	}
	return false;
}

export const createFragment = (html) => {
	let frag = document.createDocumentFragment(), temp = document.createElement('div');
	temp.innerHTML = html;
	while(temp.firstChild){
		frag.appendChild(temp.firstChild);
	}
	return frag;
}
