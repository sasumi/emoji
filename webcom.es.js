/**
 * 检测指定值是否在指定区间内
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 * @param {Boolean} includeEqual 是否包含等于判断
 * @returns {boolean}
 */
const between = (val, min, max, includeEqual = true) => {
	return includeEqual ? (val >= min && val <= max) : (val > min && val < max);
};

/**
 * 取整
 * @param {Number} num
 * @param {Number} precision 精度，默认为两位小数
 * @returns {number}
 */
const round = (num, precision = 2) => {
	let multiple = Math.pow(10, precision);
	return Math.round(num * multiple) / multiple;
};

class BizEvent {
	events = [];
	breakOnFalseReturn = false;

	/**
	 * 是否在返回false时中断事件继续执行
	 * @param {boolean} breakOnFalseReturn
	 */
	constructor(breakOnFalseReturn = false){
		this.breakOnFalseReturn = breakOnFalseReturn;
	}

	listen(payload){
		this.events.push(payload);
	}

	remove(payload){
		this.events = this.events.filter(ev => ev !== payload);
	}

	fire(...args){
		let breakFlag = false;
		this.events.forEach(event => {
			let ret = event.apply(null, args);
			if(this.breakOnFalseReturn && ret === false){
				breakFlag = true;
				return false;
			}
		});
		return !breakFlag;
	}
}

/**
 * hover event
 * @param {HTMLElement} node
 * @param {Function} hoverIn
 * @param {Function} hoverOut
 */
const onHover = (node, hoverIn, hoverOut)=>{
	node.addEventListener('mouseover', hoverIn);
	node.addEventListener('mouseout', hoverOut);
};

/**
 * on document ready
 * @param {Function} callback
 */
const onDocReady = (callback)=>{
	if (document.readyState === 'complete') {
		callback();
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
};

/**
 * 触发HTML节点事件
 * @param {HTMLElement} node
 * @param {String} event
 */
const triggerDomEvent = (node, event) => {
	if("createEvent" in document){
		let evt = document.createEvent("HTMLEvents");
		evt.initEvent(event.toLowerCase(), false, true);
		node.dispatchEvent(evt);
	}else {
		node.fireEvent("on"+event.toLowerCase());
	}
};

/**
 * 事件代理
 * @param {HTMLElement} container
 * @param {String} selector
 * @param {String} eventName
 * @param {Function} payload
 */
const eventDelegate = (container, selector, eventName, payload)=>{
	container.addEventListener(eventName, ev=>{
		let target = ev.target;
		while(target){
			if(target.matches(selector)){
				payload.call(target, target);
				return;
			}
			if(target === container){
				return;
			}
			target = target.parentNode;
		}
	});
};

const KEYS = {
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,

	BackSpace: 8,
	Esc: 27,
	RightArrow: 39,
	Tab: 9,
	Space: 32,
	DownArrow: 40,
	Clear: 12,
	PageUp: 33,
	Insert: 45,
	Enter: 13,
	PageDown: 34,
	Delete: 46,
	Shift: 16,
	End: 35,
	NumLock: 144,
	Control: 17,
	Home: 36,
	Alt: 18,
	LeftArrow: 37,
	CapsLock: 20,
	UpArrow: 38,

	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,

	NumPad0: 96,
	NumPad1: 97,
	NumPad2: 98,
	NumPad3: 99,
	NumPad4: 100,
	NumPad5: 101,
	NumPad6: 102,
	NumPad7: 103,
	NumPad8: 104,
	NumPad9: 105,
	NumPadMultiple: 106,
	NumPadPlus: 107,
	NumPadDash: 109,
	NumPadDot: 110,
	NumPadSlash: 111,
	NumPadEnter: 108
	///?	191
	//`~	192
	//	[{	219
	//:	186
// \|	220
	//=+	187
	//<	188
// ]}	221

	//-_	189
//.>	190
// '"	222
};

/**
 * 混合ES6模板字符串
 * @example extract("hello ${user_name}", {user_name:"Jack"});
 * @param {String} es_template 模板
 * @param {Object} params 数据对象
 * @return {String}
 */
const extract = (es_template, params)=>{
	const names = Object.keys(params);
	const values = Object.values(params);
	return new Function(...names, `return \`${es_template}\`;`)(...values);
};

/**
 * 格式化数字
 * @param {Number} num
 * @param {Number} precision
 * @return {string|Number}
 */
const formatSize = (num, precision = 2) => {
	if(isNaN(num)){
		return num;
	}
	let str = '', i, mod = 1024;
	if(num < 0){
		str = '-';
		num = Math.abs(num);
	}
	let units = 'B KB MB GB TB PB'.split(' ');
	for(i = 0; num > mod; i++){
		num /= mod;
	}
	return str + round(num, precision) + units[i];
};

/**
 * 中英文字符串截取（中文按照2个字符长度计算）
 * @param str
 * @param len
 * @param eclipse_text
 * @returns {*}
 */
const cutString = (str, len, eclipse_text)=>{
	if(eclipse_text === undefined){
		eclipse_text = '...';
	}
	let r = /[^\x00-\xff]/g;
	if(str.replace(r, "mm").length <= len){
		return str;
	}
	let m = Math.floor(len / 2);
	for(let i = m; i < str.length; i++){
		if(str.substr(0, i).replace(r, "mm").length >= len){
			return str.substr(0, i) + eclipse_text;
		}
	}
	return str;
};

/**
 * 正则表达式转义
 * @param str
 * @returns {string}
 */
const regQuote = (str)=>{
	return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
};

/**
 * @param e
 * @return {string}
 */
const utf8Decode = (e) => {
	let t = "";
	let n = 0;
	let r = 0,
		c2 = 0,
		c3 = 0;
	while(n < e.length){
		r = e.charCodeAt(n);
		if(r < 128){
			t += String.fromCharCode(r);
			n++;
		}else if(r > 191 && r < 224){
			c2 = e.charCodeAt(n + 1);
			t += String.fromCharCode((r & 31) << 6 | c2 & 63);
			n += 2;
		}else {
			c2 = e.charCodeAt(n + 1);
			c3 = e.charCodeAt(n + 2);
			t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
			n += 3;
		}
	}
	return t
};

const utf8Encode = (e) => {
	e = e.replace(/\r\n/g, "n");
	let t = "";
	for(let n = 0; n < e.length; n++){
		let r = e.charCodeAt(n);
		if(r < 128){
			t += String.fromCharCode(r);
		}else if(r > 127 && r < 2048){
			t += String.fromCharCode(r >> 6 | 192);
			t += String.fromCharCode(r & 63 | 128);
		}else {
			t += String.fromCharCode(r >> 12 | 224);
			t += String.fromCharCode(r >> 6 & 63 | 128);
			t += String.fromCharCode(r & 63 | 128);
		}
	}
	return t;
};

/**
 * 获取u8字符串长度(一个中文字按照3个字数计算)
 * @param str
 * @returns {number}
 */
const getUTF8StrLen = (str)=>{
	let realLength = 0;
	let len = str.length;
	let charCode = -1;
	for(let i = 0; i < len; i++){
		charCode = str.charCodeAt(i);
		if(charCode >= 0 && charCode <= 128){
			realLength += 1;
		}else {
			realLength += 3;
		}
	}
	return realLength;
};

const DEFAULT_RANDOM_STRING = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890';

/**
 * 产生随机字符串
 * @param {Number} length
 * @param {String} sourceStr
 * @returns {String}
 */
const randomString = (length = 6, sourceStr = DEFAULT_RANDOM_STRING)=>{
	let codes = '';
	for(let i = 0; i < length; i++){
		let rnd =Math.round(Math.random()*(sourceStr.length - 1));
		codes += sourceStr.substring(rnd, rnd + 1);
	}
	return codes;
};

/**
 * 字符串转成首字母大写
 * @param {String} str
 * @param {Boolean} capitalize_first 是否将第一个单词首字母大写
 * @return {string}
 */
const strToPascalCase = (str, capitalize_first = false)=>{
	let words = [];
	str.replace(/[-_\s+]/g, ' ').split(' ').forEach((word, idx) => {
		words.push((idx === 0 && !capitalize_first) ? word : capitalize(word));
	});
	return words.join('');
};

/**
 * @param s
 * @return {string}
 */
const capitalize = (s) => {
	if(typeof s !== 'string'){
		return ''
	}
	return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * 检测是否为数值
 * @param val
 * @return {boolean}
 */
const isNum = (val)=>{
	return !isNaN(val);
};

const TRIM_BOTH = 0;
const TRIM_LEFT = 1;
const TRIM_RIGHT = 2;
const trim = (str, chars = '', dir = TRIM_BOTH)=>{
	if(chars.length){
		let regLeft = new RegExp('^['+regQuote(chars)+']+'),
		regRight = new RegExp('['+regQuote(chars)+']+$');
		return dir === TRIM_LEFT ? str.replace(regLeft, '') : (dir === TRIM_RIGHT ? str.replace(regRight, '') : str.replace(regLeft, '').replace(regRight, ''));
	}else {
		return dir === TRIM_BOTH ? str.trim() : (dir === TRIM_LEFT ? str.trimStart() : dir === str.trimEnd());
	}
};

/**
 * 块元素
 * @type {string[]}
 */
const BLOCK_TAGS = [
	'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'p', 'div', 'address', 'pre', 'form',
	'table', 'li', 'ol', 'ul', 'tr', 'td', 'caption', 'blockquote', 'center','legend',
	'dl', 'dt', 'dd', 'dir', 'fieldset', 'noscript', 'noframes', 'menu', 'isindex', 'samp',
	'nav','header', 'aside', 'dialog','section', 'footer','article'
];

const REMOVABLE_TAGS = [
	'style', 'comment', 'select', 'option', 'script', 'title', 'head', 'button',
];

/**
 * Convert html to plain text
 * @param {String} html
 * @returns {string}
 */
const html2Text = (html)=>{
	//remove removable tags
	REMOVABLE_TAGS.forEach(tag=>{
		html = html.replace(new RegExp(tag, 'ig'), '');
	});

	//remove text line break
	html = html.replace(/[\r|\n]/g, '');

	//convert block tags to line break
	html = html.replace(/<(\w+)([^>]*)>/g, function(ms, tag, tail){
		if(BLOCK_TAGS.includes(tag.toLowerCase())){
			return "\n";
		}
		return "";
	});

	//remove tag's postfix
	html = html.replace(/<\/(\w+)([^>]*)>/g, function(ms, tag, tail){
		return "";
	});

	//remove other tags, likes <img>, input, etc...
	html = html.replace(/<[^>]+>/g, '');

	//convert entity by names
	let entityNamesMap = [
		[/&nbsp;/ig, ' '],
		[/&lt;/ig, '<'],
		[/&gt;/ig, '>'],
		[/&quot;/ig, '"'],
		[/&apos;/ig, '\''],
	];
	entityNamesMap.forEach(([matchReg, replacement])=>{
		html = html.replace(matchReg, replacement);
	});

	//convert entity dec code
	html = html.replace(/&#(\d+);/, function(ms, dec){
		return String.fromCharCode(dec);
	});

	//replace last &amp;
	html = html.replace(/&amp;/ig, '&');

	//trim head & tail space
	html = html.trim();

	return html;
};

/**
 * 数值转为CSS可用样式
 * @param {Number|String} h
 * @returns {string}
 */
const dimension2Style = h => {
	if(isNum(h)){
		return h + 'px';
	}
	return h+'';
};

/**
 * CSS 选择器转义
 * @param {String} str
 * @returns {String}
 */
const cssSelectorEscape = (str)=>{
	return (window.CSS && CSS.escape) ? CSS.escape(str) : str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
};

/**
 * HTML实例转字符串
 * @param {string} entity
 * @returns {string}
 */
const entityToString = (entity) => {
	let entities = entity.split(';');
	entities.pop();
	return entities.map(item => String.fromCharCode(
		item[2] === 'x' ? parseInt(item.slice(3), 16) : parseInt(item.slice(2)))).join('')
};

let _helper_div;
const decodeHTMLEntities = (str) => {
	if(!_helper_div){
		_helper_div = document.createElement('div');
	}
	// strip script/html tags
	str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
	str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
	_helper_div.innerHTML = str;
	str = _helper_div.textContent;
	_helper_div.textContent = '';
	return str;
};


/**
 * 转义HTML
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = str => {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
		.replace(/[\r\n]/g, '<br/>');
};

/**
 * 反转义HTML
 * @param {String} html
 * @returns {string}
 */
const unescapeHtml = (html)=>{
	return String(html)
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/<br.*>/, "\n");
};

/**
 * 转义HTML到属性值
 * @param {String} s
 * @param preserveCR
 * @returns {string}
 */
const escapeAttr = (s, preserveCR = '') => {
	preserveCR = preserveCR ? '&#13;' : '\n';
	return ('' + s) /* Forces the conversion to string. */
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
		.replace(/[\r\n]/g, preserveCR);
};

const stringToEntity = (str, radix) => {
	let arr = str.split('');
	radix = radix || 0;
	return arr.map(item =>
		`&#${(radix ? 'x' + item.charCodeAt(0).toString(16) : item.charCodeAt(0))};`).join('')
};

/**
 * 高亮文本
 * @param {String} text 文本
 * @param {String} kw 关键字
 * @param {String} replaceTpl 替换模板
 * @returns {void|string|*}
 */
const highlightText = (text, kw, replaceTpl = '<span class="matched">%s</span>') => {
	if(!kw){
		return text;
	}
	return text.replace(new RegExp(regQuote(kw), 'ig'), match => {
		return replaceTpl.replace('%s', match);
	});
};

const getViewWidth = () => {
	return window.innerWidth;
};

const getViewHeight = () => {
	return window.innerHeight;
};

/**
 * @param {HTMLElement} dom
 */
const hide = (dom) => {
	dom.style.display = 'none';
};

/**
 * @param {HTMLElement} dom
 * @param dom
 */
const show = (dom) => {
	dom.style.display = '';
};

/**
 * @param {HTMLElement} dom
 * @param toShow
 */
const toggle = (dom, toShow) => {
	toShow ? show(dom) : hide(dom);
};

/**
 * 获取节点相对于文档顶部定位
 * @param target
 * @return {{top: number, left: number}}
 */
const getDomOffset = (target) => {
	let rect = target.getBoundingClientRect();
	return {
		width: rect.width,
		height: rect.height,
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		x: rect.x,
		y: rect.y,
	}
};

/**
 * 主动触发事件
 * @param {HTMLElement} el
 * @param event
 */
const fireEvent = (el, event) => {
	if("createEvent" in document){
		let evo = document.createEvent("HTMLEvents");
		evo.initEvent(event, false, true);
		el.dispatchEvent(evo);
	}else {
		el.fireEvent("on" + event);
	}
};

/**
 * 判断元素是否为按钮
 * @param {HTMLElement} el
 */
const isButton = (el) => {
	return el.tagName === 'BUTTON' ||
		(el.tagName === 'INPUT' && ['button', 'reset', 'submit'].includes(el.getAttribute('type')));
};

/**
 * 获取最近上级节点
 * @param {HTMLElement} dom
 * @param {String} selector 匹配上级节点选择器
 * @return {(() => (HTMLElement | null))|ParentNode|ActiveX.IXMLDOMNode|null}
 */
const matchParent = (dom, selector) => {
	let p = dom.parentNode;
	while(p && p !== document){
		if(p.matches(selector)){
			return p;
		}
		p = p.parentNode;
	}
	return null;
};

/**
 * 检测child节点是否在container节点列表里面
 * @param {HTMLElement|HTMLElement[]|String} contains
 * @param {HTMLElement} child
 * @param {Boolean} includeEqual 是否包括等于关系
 * @returns {boolean}
 */
const domContained = (contains, child, includeEqual = false) => {
	if(typeof contains === 'string'){
		contains = document.querySelectorAll(contains);
	}else if(Array.isArray(contains));else if(typeof contains === 'object'){
		contains = [contains];
	}
	for(let i = 0; i < contains.length; i++){
		if((includeEqual ? contains[i] === child : false) ||
			contains[i].compareDocumentPosition(child) & 16){
			return true;
		}
	}
	return false;
};

/**
 * 绑定按钮触发（包括鼠标点击、键盘回车、键盘空格）
 * @param {HTMLElement} button
 * @param {CallableFunction} payload
 * @param {Boolean} cancelBubble
 */
const buttonActiveBind = (button, payload, cancelBubble = false) => {
	button.addEventListener('click', payload, cancelBubble);
	button.addEventListener('keyup', e => {
		if(e.keyCode === KEYS.Space || e.keyCode === KEYS.Enter){
			payload.call(button, e);
		}
	}, cancelBubble);
};

/**
 * 获取中间对齐布局
 * @param width
 * @param height
 * @param {Object} containerDimension
 * @param {Number} containerDimension.left
 * @param {Number} containerDimension.top
 * @param {Number} containerDimension.width
 * @param {Number} containerDimension.height
 * @return {Array} dimension [dimension.left, dimension.top]
 */
const keepRectCenter = (width, height, containerDimension = {
	left: 0,
	top: 0,
	width: window.innerWidth,
	height: window.innerHeight
}) => {
	return [
		Math.max((containerDimension.width - width) / 2 + containerDimension.left, 0),
		Math.max((containerDimension.height - height) / 2 + containerDimension.top, 0)
	];
};

/**
 *
 * @param target
 * @param container
 */
const keepDomInContainer = (target, container = document.body) => {
	keepRectInContainer({
		left: target.left,
		top: target.top,
		width: target.clientWidth,
		height: target.clientHeight,
	}, {}, posAbs = true);
};

/**
 * 保持对象尽量在容器内部，优先保证上边、左边显示
 * @param {Object} objDim
 * @param {Number} objDim.left
 * @param {Number} objDim.top
 * @param {Number} objDim.width
 * @param {Number} objDim.height
 * @param {Object} ctnDim
 * @param {Number} ctnDim.left
 * @param {Number} ctnDim.top
 * @param {Number} ctnDim.width
 * @param {Number} ctnDim.height
 * {Array} dimension [dimension.left, dimension.top]
 */
const keepRectInContainer = (objDim, ctnDim = {
	left: 0,
	top: 0,
	width: window.innerWidth,
	height: window.innerHeight
}) => {
	let ret = {left: objDim.left, top: objDim.top};

	//oversize
	if(objDim.width > ctnDim.width || objDim.height > ctnDim.height){
		return ret;
	}

	//右边超出
	if((objDim.width + objDim.left) > (ctnDim.width + ctnDim.left)){
		ret.left = objDim.left - ((objDim.width + objDim.left) - (ctnDim.width + ctnDim.left));
	}

	//底边超出
	if((objDim.height + objDim.top) > (ctnDim.height + ctnDim.top)){
		ret.top = objDim.top - ((objDim.height + objDim.top) - (ctnDim.height + ctnDim.top));
	}

	//优先保证左边露出
	if(objDim.left < ctnDim.left){
		ret.left = ctnDim.left;
	}

	//优先保证上边露出
	if(objDim.top < ctnDim.top){
		ret.top = ctnDim.top;
	}
	return ret;
};

/**
 * 获取对象宽、高
 * 通过设置 visibility 方式进行获取
 * @param {HTMLElement} dom
 * @return {{width: number, height: number}}
 */
const getDomDimension = (dom) => {
	let org_visibility = dom.style.visibility;
	let org_display = dom.style.display;
	let width, height;

	dom.style.visibility = 'hidden';
	dom.style.display = '';
	width = dom.clientWidth;
	height = dom.clientHeight;
	dom.style.visibility = org_visibility;
	dom.style.display = org_display;
	return {width, height};
};

/**
 * 矩形相交（包括边重叠情况）
 * @param {Object} rect1
 * @param {Object} rect2
 * @returns {boolean}
 */
const rectAssoc = (rect1, rect2) => {
	if(rect1.left <= rect2.left){
		return (rect1.left + rect1.width) >= rect2.left && (
			between(rect2.top, rect1.top, rect1.top + rect1.height) ||
			between(rect2.top + rect2.height, rect1.top, rect1.top + rect1.height) ||
			rect2.top >= rect1.top && rect2.height >= rect1.height
		);
	}else {
		return (rect2.left + rect2.width) >= rect1.left && (
			between(rect1.top, rect2.top, rect2.top + rect2.height) ||
			between(rect1.top + rect1.height, rect2.top, rect2.top + rect2.height) ||
			rect1.top >= rect2.top && rect1.height >= rect2.height
		);
	}
};


/**
 * isElement
 * @param {*} obj
 * @returns {boolean}
 */
const isElement = (obj) => {
	try{
		//Using W3 DOM2 (works for FF, Opera and Chrome)
		return obj instanceof HTMLElement;
	}catch(e){
		//Browsers not supporting W3 DOM2 don't have HTMLElement and
		//an exception is thrown and we end up here. Testing some
		//properties that all elements have. (works on IE7)
		return (typeof obj === "object") &&
			(obj.nodeType === 1) && (typeof obj.style === "object") &&
			(typeof obj.ownerDocument === "object");
	}
};

let _c = {};

/**
 * 挂载css文件
 * @param {String} file
 * @param {Boolean} forceReload 是否强制重新挂载，缺省不重复挂载
 */
const loadCss = (file, forceReload = false) => {
	if(!forceReload && _c[file]){
		return _c[file];
	}
	_c[file] = new Promise((resolve, reject) => {
		let link = document.createElement('link');
		link.rel = "stylesheet";
		link.href = file;
		link.onload = () => {
			resolve();
		};
		link.onerror = () => {
			reject();
		};
		document.head.append(link);
	});
	return _c[file];
};

/**
 * 加载script脚本
 * @param {String} src 脚本地址
 * @param {Boolean} forceReload 是否强制重新加载，缺省为去重加载
 * @return {Promise}
 */
const loadScript = (src, forceReload = false) => {
	if(!forceReload && _c[src]){
		return _c[src];
	}
	_c[src] = new Promise((resolve, reject) => {
		let script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			resolve();
		};
		script.onerror = () => {
			reject();
		};
		document.head.append(script);
	});
	return _c[src];
};

/**
 * insert style sheet in head
 * @param {String} styleSheetStr
 * @param {String} id
 * @return {HTMLStyleElement}
 */
const insertStyleSheet = (styleSheetStr, id = '', doc = document) => {
	let style = doc.createElement('style');
	doc.head.appendChild(style);
	style.innerHTML = styleSheetStr;
	if(id){
		style.id = id;
	}
	return style;
};

/**
 * 获取DOM节点视觉呈现信息
 * @param win
 * @returns {{
 *  screenLeft: number,
 *  screenTop: number,
 *  visibleWidth: number,
 *  visibleHeight: number,
 *  horizonScroll: number,
 *  documentWidth: number,
 *  documentHeight: number,
 *  }}
 */
const getRegion = (win = window) => {
	let info = {};
	let doc = win.document;
	info.screenLeft = win.screenLeft ? win.screenLeft : win.screenX;
	info.screenTop = win.screenTop ? win.screenTop : win.screenY;

	//no ie
	if(win.innerWidth){
		info.visibleWidth = win.innerWidth;
		info.visibleHeight = win.innerHeight;
		info.horizenScroll = win.pageXOffset;
		info.verticalScroll = win.pageYOffset;
	}else {
		//IE + DOCTYPE defined || IE4, IE5, IE6+no DOCTYPE
		let tmp = (doc.documentElement && doc.documentElement.clientWidth) ?
			doc.documentElement : doc.body;
		info.visibleWidth = tmp.clientWidth;
		info.visibleHeight = tmp.clientHeight;
		info.horizenScroll = tmp.scrollLeft;
		info.verticalScroll = tmp.scrollTop;
	}

	let tag = (doc.documentElement && doc.documentElement.scrollWidth) ?
		doc.documentElement : doc.body;
	info.documentWidth = Math.max(tag.scrollWidth, info.visibleWidth);
	info.documentHeight = Math.max(tag.scrollHeight, info.visibleHeight);
	return info;
};

/**
 * 检测矩形是否在指定布局内部
 * @param rect
 * @param layout
 * @returns {*}
 */
const rectInLayout = (rect, layout) => {
	return between(rect.top, layout.top, layout.top + layout.height) && between(rect.left, layout.left, layout.left + layout.width) //左上角
		&& between(rect.top + rect.height, layout.top, layout.top + layout.height) && between(rect.left + rect.width, layout.left, layout.left + layout.width); //右下角
};

/**
 * 设置dom样式
 * @param {HTMLElement} dom
 * @param {Object} style 样式对象
 */
const setStyle = (dom, style = {}) => {
	for(let key in style){
		key = strToPascalCase(key);
		dom.style[key] = dimension2Style(style[key]);
	}
};

/**
 * 创建HTML节点
 * @param {String} html
 * @param {HTMLElement|null} parentNode 父级节点
 * @returns {HTMLElement|HTMLElement[]}
 */
const createDomByHtml = (html, parentNode = null) => {
	let tpl = document.createElement('template');
	html = html.trim();
	tpl.innerHTML = html;
	let nodes = [];
	if(parentNode){
		tpl.content.childNodes.forEach(node => {
			nodes.push(parentNode.appendChild(node));
		});
	}else {
		nodes = tpl.content.childNodes;
	}
	return nodes.length === 1 ? nodes[0] : nodes;
};

/**
 * 强制重绘元素
 * @param {HTMLElement} element
 * @param {Number} delay
 */
function repaint(element, delay = 0){
	setTimeout(() => {
		try{
			// eslint-disable-next-line no-param-reassign
			element.hidden = true;

			// eslint-disable-next-line no-unused-expressions
			element.offsetHeight;

			// eslint-disable-next-line no-param-reassign
			element.hidden = false;
		}catch(_){
			// Do nothing
		}
	}, delay);
}

/**
 * 进入全屏模式
 * @param {HTMLElement} element
 */
const enterFullScreen = (element) => {
	if(element.requestFullscreen){
		return element.requestFullscreen();
	}
	if(element.webkitRequestFullScreen){
		return element.webkitRequestFullScreen();
	}
	if(element.mozRequestFullScreen){
		element.mozRequestFullScreen();
	}
	if(element.msRequestFullScreen){
		element.msRequestFullScreen();
	}
	throw "Browser no allow full screen";
};

/**
 * 退出全屏
 * @returns {Promise<void>}
 */
const exitFullScreen = () => {
	return document.exitFullscreen();
};

/**
 * 切换全屏
 * @param element
 * @returns {Promise<unknown>}
 */
const toggleFullScreen = (element) => {
	return new Promise((resolve, reject) => {
		if(!isInFullScreen()){
			enterFullScreen(element).then(resolve).catch(reject);
		}else {
			exitFullScreen().then(resolve).catch(reject);
		}
	})
};

/**
 * 检测是否正在全屏
 * @returns {boolean}
 */
const isInFullScreen = () => {
	return !!document.fullscreenElement;
};

let CURRENT_WINDOW;

/**
 * @param win
 */
const setContextWindow = (win) => {
	CURRENT_WINDOW = win;
};

/**
 * 获取当前上下文 文档，缺省为获取top
 * @return {Document}
 */
const getContextDocument = () => {
	let win = getContextWindow();
	return win.document;
};

/**
 * 获取上下文窗口
 * @return {Window}
 */
const getContextWindow = () => {
	if(CURRENT_WINDOW){
		return CURRENT_WINDOW;
	}
	let win;
	try{
		win = window;
		while(win != win.parent){
			win = win.parent;
		}
	}catch(err){
		console.warn('context window assign fail:', err);
	}
	return win || window;
};

const NS$1 = 'WebCom-';
const VAR_PREFIX = '--' + NS$1;
const ICON_FONT = NS$1 + 'iconfont';

//css 样式变量名定义
const CSS_VAR_COLOR = VAR_PREFIX + 'color';
const CSS_VAR_COLOR_LIGHTEN = VAR_PREFIX + 'color-lighten';
const CSS_VAR_DISABLE_COLOR = VAR_PREFIX + 'disable-color';
const CSS_VAR_BACKGROUND_COLOR = VAR_PREFIX + 'background-color';
const CSS_VAR_PANEL_SHADOW = VAR_PREFIX + 'panel-shadow';
const CSS_VAR_PANEL_BORDER = VAR_PREFIX + 'panel-border';
const CSS_VAR_PANEL_BORDER_COLOR = VAR_PREFIX + 'panel-border-color';
const CSS_VAR_PANEL_RADIUS = VAR_PREFIX + 'panel-radius';
const CSS_VAR_FULL_SCREEN_BACKDROP_FILTER = VAR_PREFIX + 'full-screen-backdrop-filter';
const CSS_VAR_FULL_SCREEN_BACKGROUND_COLOR = VAR_PREFIX + 'full-screen-background-color';

insertStyleSheet(`
@font-face {
	font-family: '${ICON_FONT}';  /* Project id 3359671 */
	src: url('//at.alicdn.com/t/c/font_3359671_nf3191wyc8m.woff2?t=1689178723299') format('woff2'),
       url('//at.alicdn.com/t/c/font_3359671_nf3191wyc8m.woff?t=1689178723299') format('woff'),
       url('//at.alicdn.com/t/c/font_3359671_nf3191wyc8m.ttf?t=1689178723299') format('truetype');
}
:root {
	${CSS_VAR_COLOR}:#333;
	${CSS_VAR_COLOR_LIGHTEN}:#666;
	${CSS_VAR_DISABLE_COLOR}:#aaa;
	${CSS_VAR_BACKGROUND_COLOR}:#fff;
	
	${CSS_VAR_PANEL_SHADOW}:1px 1px 5px #bcbcbcb3;
	${CSS_VAR_PANEL_BORDER_COLOR}:#ccc;
	${CSS_VAR_PANEL_BORDER}:1px solid var(${CSS_VAR_PANEL_BORDER_COLOR});
	${CSS_VAR_PANEL_RADIUS}:3px;
	
	${CSS_VAR_FULL_SCREEN_BACKDROP_FILTER}:blur(4px);
	${CSS_VAR_FULL_SCREEN_BACKGROUND_COLOR}:#33333342;
}`, NS$1+'style');

const Theme = {
	Namespace: NS$1,
	CssVarPrefix: VAR_PREFIX,
	CssVar: {
		'COLOR': CSS_VAR_COLOR,
		'CSS_LIGHTEN': CSS_VAR_COLOR_LIGHTEN,
		'DISABLE_COLOR': CSS_VAR_DISABLE_COLOR,
		'BACKGROUND_COLOR': CSS_VAR_BACKGROUND_COLOR,
		'PANEL_SHADOW': CSS_VAR_PANEL_SHADOW,
		'PANEL_BORDER': CSS_VAR_PANEL_BORDER,
		'PANEL_BORDER_COLOR': CSS_VAR_PANEL_BORDER_COLOR,
		'PANEL_RADIUS': CSS_VAR_PANEL_RADIUS,
		'FULL_SCREEN_BACKDROP_FILTER': CSS_VAR_FULL_SCREEN_BACKDROP_FILTER,
		'FULL_SCREEN_BACKGROUND_COLOR': CSS_VAR_FULL_SCREEN_BACKGROUND_COLOR,
	},
	IconFont: ICON_FONT,
	TipIndex: 10, //功能提示类(指向具体元素)
	MaskIndex: 100, //遮罩(（全局或指定面板遮罩类）
	DialogIndex: 1000, //对话框等窗口类垂直索引
	FullScreenModeIndex: 10000, //全屏类（全屏类
	ContextIndex: 100000, //右键菜单
	ToastIndex: 1000000, //消息提示（顶部呈现）
};

const COM_ID$4 = Theme.Namespace + 'toast';

const TOAST_CLS_MAIN = Theme.Namespace + 'toast';
const rotate_animate = Theme.Namespace + '-toast-rotate';
const fadeIn_animate = Theme.Namespace + '-toast-fadein';
const fadeOut_animate = Theme.Namespace + '-toast-fadeout';
const FADEIN_TIME = 200;
const FADEOUT_TIME = 500;

insertStyleSheet(`
	@keyframes ${rotate_animate} {
	    0% {transform:scale(1.4) rotate(0deg);}
	    100% {transform:scale(1.4) rotate(360deg);}
	}
	@keyframes ${fadeIn_animate} {
		0% { opacity: 0; }
		100% { opacity: 1; } 
	}
	@keyframes ${fadeOut_animate} {
		0% { opacity:1;}
		100% { opacity: 0} 
	}
	.${TOAST_CLS_MAIN}-wrap{position:fixed; top:5px; width:100%; height:0; text-align:center; z-index:${Theme.ToastIndex};}
	.${TOAST_CLS_MAIN}>div {margin-bottom:0.5rem;}
	.${TOAST_CLS_MAIN} .ctn{display:inline-block;border-radius:3px;padding:.5rem 1rem .5rem 2.8rem; text-align:left; line-height:1.5rem; background-color:var(${Theme.CssVar.BACKGROUND_COLOR});color:var(${Theme.CssVar.COLOR});box-shadow:var(${Theme.CssVar.PANEL_SHADOW}); animation:${fadeIn_animate} ${FADEIN_TIME}ms}
	.${TOAST_CLS_MAIN} .ctn:before {content:"";font-family:${Theme.IconFont}; position:absolute; font-size:1.4rem; margin-left:-1.8rem;}
	.${TOAST_CLS_MAIN}-hide .ctn {animation:${fadeOut_animate} ${FADEOUT_TIME}ms; animation-fill-mode:forwards}
	.${TOAST_CLS_MAIN}-info .ctn:before {content:"\\e77e";color: gray;}
	.${TOAST_CLS_MAIN}-warning .ctn:before {content:"\\e673"; color:orange}
	.${TOAST_CLS_MAIN}-success .ctn:before {content:"\\e78d"; color:#007ffc}
	.${TOAST_CLS_MAIN}-error .ctn:before {content: "\\e6c6"; color:red;} 
	.${TOAST_CLS_MAIN}-loading .ctn:before {content:"\\e635";color:gray;animation: 1.5s linear infinite ${rotate_animate};animation-play-state: inherit;transform:scale(1.4);will-change: transform}
`, COM_ID$4 + '-style');

let toastWrap = null;

const getWrapper = () => {
	if(!toastWrap){
		toastWrap = document.createElement('div');
		document.body.appendChild(toastWrap);
		toastWrap.className = TOAST_CLS_MAIN + '-wrap';
	}
	return toastWrap;
};

class Toast{
	static TYPE_INFO = 'info';
	static TYPE_SUCCESS = 'success';
	static TYPE_WARNING = 'warning';
	static TYPE_ERROR = 'error';
	static TYPE_LOADING = 'loading';

	/**
	 * 各种类型提示默认隐藏时间
	 */
	static DEFAULT_TIME_MAP = {
		[Toast.TYPE_INFO]: 1500,
		[Toast.TYPE_SUCCESS]: 1500,
		[Toast.TYPE_WARNING]: 2000,
		[Toast.TYPE_ERROR]: 2500,
		[Toast.TYPE_LOADING]: 0,
	};

	message = '';
	type = Toast.TYPE_INFO;
	timeout = Toast.DEFAULT_TIME_MAP[this.type];

	dom = null;

	/**
	 * @param {String} message
	 * @param {String} type
	 * @param {Number} timeout 超时时间，0表示不关闭
	 */
	constructor(message, type = null, timeout = null){
		this.message = message;
		this.type = type || Toast.TYPE_SUCCESS;
		this.timeout = timeout === null ? Toast.DEFAULT_TIME_MAP[this.type] : timeout;
	}

	/**
	 * 显示提示
	 * @param {String} message
	 * @param {String} type
	 * @param {Number} timeout 超时时间，0表示不关闭
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @returns
	 */
	static showToast = (message, type = null, timeout = null, timeoutCallback = null) => {
		let toast = new Toast(message, type, timeout);
		toast.show(timeoutCallback);
		return toast;
	}

	/**
	 * 显示[提示]
	 * @param {String} message
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @return {Toast}
	 */
	static showInfo = (message, timeoutCallback = null) => {
		return this.showToast(message, Toast.TYPE_INFO, this.DEFAULT_TIME_MAP[Toast.TYPE_INFO], timeoutCallback);
	}

	/**
	 * 显示[成功]
	 * @param {String} message
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @return {Toast}
	 */
	static showSuccess = (message, timeoutCallback = null) => {
		return this.showToast(message, Toast.TYPE_SUCCESS, this.DEFAULT_TIME_MAP[Toast.TYPE_SUCCESS], timeoutCallback);
	}

	/**
	 * 显示[告警]
	 * @param {String} message
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @return {Toast}
	 */
	static showWarning = (message, timeoutCallback = null) => {
		return this.showToast(message, Toast.TYPE_WARNING, this.DEFAULT_TIME_MAP[Toast.TYPE_WARNING], timeoutCallback);
	}

	/**
	 * 显示[错误]
	 * @param {String} message
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @return {Toast}
	 */
	static showError = (message, timeoutCallback = null) => {
		return this.showToast(message, Toast.TYPE_ERROR, this.DEFAULT_TIME_MAP[Toast.TYPE_ERROR], timeoutCallback);
	}

	/**
	 * 显示[加载中]
	 * @param {String} message
	 * @param {Function} timeoutCallback 超时关闭回调
	 * @return {Toast}
	 */
	static showLoading = (message, timeoutCallback = null) => {
		return this.showToast(message, Toast.TYPE_LOADING, this.DEFAULT_TIME_MAP[Toast.TYPE_LOADING], timeoutCallback);
	}

	/**
	 * 延期显示 loading（推荐使用）
	 * 在一些业务后台能够快速响应场景，不显示loading过程能够提升用户体验
	 * @param {String} message
	 * @param {Number} delayMicroseconds 延迟显示
	 * @param {Function} timeoutCallback
	 * @return {Toast}
	 */
	static showLoadingLater = (message, delayMicroseconds = 200, timeoutCallback = null) => {
		let time = Toast.DEFAULT_TIME_MAP[Toast.TYPE_LOADING];
		let toast = new Toast(message, Toast.TYPE_LOADING, time);
		toast.show(timeoutCallback);
		hide(toast.dom);
		setTimeout(() => {
			toast.dom && show(toast.dom);
		}, delayMicroseconds);
		return toast;
	}

	/**
	 * 显示提示
	 * @param {Function} onTimeoutClose 超时关闭回调
	 */
	show(onTimeoutClose = null){
		let wrapper = getWrapper();
		show(wrapper);
		this.dom = document.createElement('span');
		wrapper.appendChild(this.dom);
		this.dom.className = `${TOAST_CLS_MAIN} ${TOAST_CLS_MAIN}-` + this.type;
		this.dom.innerHTML = `<span class="ctn">${this.message}</span><div></div>`;
		if(this.timeout){
			setTimeout(() => {
				this.hide(true);
				onTimeoutClose && onTimeoutClose();
			}, this.timeout);
		}
	}

	/**
	 * 隐藏提示信息
	 * @param {Boolean} fadeOut 是否使用渐隐式淡出
	 */
	hide(fadeOut = false){
		//稍微容错下，避免setTimeout后没有父节点
		if(!this.dom || !document.body.contains(this.dom)){
			return;
		}
		if(fadeOut){
			this.dom.classList.add(TOAST_CLS_MAIN + '-hide');
			setTimeout(() => {
				this.hide(false);
			}, FADEOUT_TIME);
			return;
		}
		this.dom.parentNode.removeChild(this.dom);
		this.dom = null;
		let wrapper = getWrapper();
		if(!wrapper.childNodes.length){
			hide(wrapper);
		}
	}
}

window[COM_ID$4] = Toast;
let CONTEXT_WINDOW$2 = getContextWindow();
let ToastClass = CONTEXT_WINDOW$2[COM_ID$4] || Toast;

/**
 * 解析文件扩展名
 * @param {string} fileName
 * @return {string}
 */
const resolveFileExtension = fileName => {
	if(fileName.indexOf('.')<0){
		return '';
	}
	let segList = fileName.split('.');
	return segList[segList.length-1];
};

/**
 * 获取文件名
 * @param {string} fileName
 * @return {string}
 */
const resolveFileName = (fileName)=>{
	fileName = fileName.replace(/.*?[/|\\]/ig, '');
	return fileName.replace(/\.[^.]*$/g, "");
};

const CODE_TIMEOUT = 508;
const CODE_ABORT = 509;
const DEFAULT_TIMEOUT = 10000;

/**
 * HTTP请求方法
 * @type {{TRACE: string, HEAD: string, DELETE: string, POST: string, GET: string, CONNECT: string, OPTIONS: string, PUT: string}}
 */
const HTTP_METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
	OPTIONS: 'OPTIONS',
	HEAD: 'HEAD',
	CONNECT: 'CONNECT',
	TRACE: 'TRACE',
};

/**
 * 请求格式
 * @type {{FORM: string, JSON: string}}
 */
const REQUEST_FORMAT = {
	JSON: 'JSON',
	FORM: 'FORM',
};

/**
 * 请求格式对应的 Content-Type
 * @type {{}}
 */
const REQUEST_CONTENT_TYPE_MAP = {
	[REQUEST_FORMAT.JSON]: 'application/json',
	[REQUEST_FORMAT.FORM]: 'application/x-www-form-urlencoded',
};

/**
 * 请求数据格式处理
 * @type {{}}
 */
const REQUEST_DATA_HANDLE_MAP = {
	[REQUEST_FORMAT.JSON]: (data, method) => {
		if(method === HTTP_METHOD.GET){
			return '';
		}
		return JSON.stringify(data);
	},
	[REQUEST_FORMAT.FORM]: (data, method) => {
		if(method === HTTP_METHOD.GET){
			return '';
		}
		return QueryString.stringify(data);
	}
};

/**
 * 响应格式
 * @type {{XML: string, JSON: string, HTML: string, TEXT: string}}
 */
const RESPONSE_FORMAT = {
	JSON: 'JSON',
	XML: 'XML',
	HTML: 'HTML',
	TEXT: 'TEXT',
};

/**
 * 响应格式对应的 Accept 头
 * @type {{}}
 */
const RESPONSE_ACCEPT_TYPE_MAP = {
	[RESPONSE_FORMAT.JSON]: 'application/json',
	[RESPONSE_FORMAT.XML]: 'text/xml',
	[RESPONSE_FORMAT.HTML]: 'text/html',
	[RESPONSE_FORMAT.TEXT]: 'text/plain',
};

/**
 * 合并请求参数
 * @param {String} uri
 * @param {String|Object} data
 * @returns {*}
 */
const mergerUriParam = (uri, data) => {
	return uri + (uri.indexOf('?') >= 0 ? '&' : '?') + QueryString.stringify(data);
};

const setHash = data => {
	location.href = location.href.replace(/#.*$/g, '') + '#' + QueryString.stringify(data);
};

const getHash = () => {
	return location.hash ? location.hash.substring(1) : '';
};

/**
 * JSON方式请求
 * @param {String} url
 * @param {Object|String} data 数据，当前仅支持对象或queryString
 * @param {String} method
 * @param {Object} option
 * @param {String} option.timeout 请求超时时间（ms）超过指定时间将主动断开链接，0 表示不设置超时时间。
 * @param {String} option.timeoutCallback 超时回调
 * @param {String} option.requestFormat 请求类型（FORM_DATA|JSON） 默认为 REQUEST_FORMAT.JSON 格式
 * @param {String} option.responseFormat 响应类型（JSON）默认为 RESPONSE_FORMAT.JSON 格式，暂不支持其他类型
 * @return {Promise<unknown>}
 */
const requestJSON = (url, data, method = HTTP_METHOD.GET, option = {}) => {
	return method === HTTP_METHOD.GET ? Net.getJSON(url, data, option) : Net.postJSON(url, data, option);
};

/**
 * XHR 网络请求
 */
class Net {
	cgi = null; //请求接口
	data = null; //请求数据
	option = {
		method: HTTP_METHOD.GET, //请求方法
		timeout: DEFAULT_TIMEOUT, //超时时间(毫秒)(超时将纳入onError处理)
		requestFormat: REQUEST_FORMAT.FORM, //请求数据格式
		responseFormat: RESPONSE_FORMAT.TEXT, //响应数据格式
		headers: {}, //请求头部信息
	};
	xhr = null;
	onError = new BizEvent(); //(error,code)
	onResponse = new BizEvent(); //(body)
	onStateChange = new BizEvent(); //(state) http 状态码
	onProgress = new BizEvent(); //(percent)

	/**
	 * 构造器
	 * @param {String} cgi
	 * @param {String|*} data
	 * @param {Object} option
	 */
	constructor(cgi, data, option = {}){
		this.cgi = cgi;
		this.data = data;
		this.option = {
			...this.option,
			...option
		};
		this.xhr = new XMLHttpRequest();
		this.xhr.open(this.option.method, this.cgi, true);
		this.xhr.addEventListener("progress", e => {
			if(e.lengthComputable){
				this.onProgress.fire(e.loaded / e.total);
			}else {
				this.onProgress.fire(null);
			}
		});
		this.xhr.onreadystatechange = () => {
			this.onStateChange.fire(this.xhr.status);
		};
		this.xhr.addEventListener("load", () => {
			let ret;
			switch(option.responseFormat){
				case RESPONSE_FORMAT.JSON:
					ret = JSON.parse(this.xhr.responseText);
					break;
				case RESPONSE_FORMAT.XML:
				case RESPONSE_FORMAT.TEXT:
				case RESPONSE_FORMAT.HTML:
				default:
					ret = this.xhr.responseText;
					break;
			}
			this.onResponse.fire(ret);
		});
		this.xhr.addEventListener("error", () => {
			this.onError.fire(this.xhr.statusText, this.xhr.status);
		});
		this.xhr.addEventListener("abort", () => {
			this.onError.fire('Request aborted.', CODE_ABORT);
		});
		this.xhr.setRequestHeader('content-type', REQUEST_CONTENT_TYPE_MAP[this.option.requestFormat]);
		this.xhr.setRequestHeader('Accept', RESPONSE_ACCEPT_TYPE_MAP[this.option.responseFormat]);
		for(let key in this.option.headers){
			this.xhr.setRequestHeader(key, this.option.headers[key]);
		}
		if(this.option.timeout){
			setTimeout(() => {
				this.onError.fire('Request timeout', CODE_TIMEOUT);
			}, this.option.timeout);
		}
	}

	/**
	 * 发送请求
	 */
	send(){
		let data = this.data ? REQUEST_DATA_HANDLE_MAP[this.option.requestFormat](this.data) : null;
		this.xhr.send(data);
	}

	/**
	 * 终止请求
	 */
	abort(){
		this.xhr.abort();
	}

	static get(cgi, data, option = {}){
		option.method = option.method || HTTP_METHOD.GET;
		return Net.request(cgi, data, option);
	}

	static getJSON(cgi, data, option = {}){
		option.requestFormat = option.requestFormat || REQUEST_FORMAT.JSON;
		option.responseFormat = option.responseFormat || RESPONSE_FORMAT.JSON;
		return Net.get(cgi, data, option);
	}

	static post(cgi, data, option = {}){
		option.method = option.method || HTTP_METHOD.POST;
		return Net.request(cgi, data, option);
	}

	static postJSON(cgi, data, option = {}){
		option.requestFormat = option.requestFormat || REQUEST_FORMAT.JSON;
		option.responseFormat = option.responseFormat || RESPONSE_FORMAT.JSON;
		return Net.post(cgi, data, option);
	}

	static request(cgi, data, option = {}){
		return new Promise((resolve, reject) => {
			let req = new Net(cgi, data, option);
			req.onResponse.listen(ret=>{
				resolve(ret);
			});
			req.onError.listen(error=>{
				reject(error);
			});
			req.send();
		});
	}
}

/**
 * 文件下载
 * 注意：在浏览器中如果非同域，自定义保存名称无效
 * @param src 文件地址
 * @param save_name 保存名称（包含扩展名，为空表示自动从src中提取）
 */
const downloadFile = (src, save_name) => {
	if(!save_name){
		save_name = resolveFileName(src) + '.' + resolveFileExtension(src);
	}
	let link = document.createElement('a');
	link.href = src;
	link.download = save_name;
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);
};

const QueryString = {
	parse(str){
		if(str[0] === '?'){
			str = str.substring(1);
		}
		let retObj = {};
		let qs = str.split('&');
		qs.forEach(q => {
			let [k, v] = q.split('=');
			if(!k.length){
				return;
			}
			retObj[decodeURIComponent(k)] = decodeURIComponent(v);
		});
		return retObj;
	},

	stringify(data){
		if(typeof (data) === 'undefined' || typeof (data) !== 'object'){
			return data
		}
		let query = [];
		for(let param in data){
			if(data.hasOwnProperty(param)){
				if(data[param] === null){
					continue; //null数据不提交
				}
				if(typeof (data[param]) === 'object' && data[param].length){
					data[param].forEach(item => {
						query.push(encodeURI(param + '=' + item));
					});
				}else if(typeof (data[param]) === 'object');else {
					query.push(encodeURI(param + '=' + data[param]));
				}
			}
		}
		return query.join('&')
	}
};

/**
 * open link without referer
 * @param link
 * @returns {boolean}
 */
const openLinkWithoutReferer = (link) => {
	let instance = window.open("about:blank");
	instance.document.write("<meta http-equiv=\"refresh\" content=\"0;url=" + link + "\">");
	instance.document.close();
	return false;
};

let _guid = 0;
const guid = (prefix = '') => {
	return 'guid_' + (prefix || randomString(6)) + (++_guid);
};

/**
 * 获取当前函数所在script路径
 * @return {string|null}
 */
const getCurrentScript = function(){
	let error = new Error()
		, source
		, currentStackFrameRegex = new RegExp(getCurrentScript.name + "\\s*\\((.*):\\d+:\\d+\\)")
		, lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/);
	if((source = currentStackFrameRegex.exec(error.stack.trim()))){
		return source[1];
	}else if((source = lastStackFrameRegex.exec(error.stack.trim())) && source[1] !== ""){
		return source[1];
	}else if(error['fileName'] !== undefined){
		return error['fileName'];
	}
	return null;
};

/**
 * 节流
 * 规定在一个单位时间内，只能触发一次函数。如果这个函数单位时间内触发多次函数，只有一次生效。
 * @param fn
 * @param intervalMiSec
 * @return {(function(): void)|*}
 */
const throttle = (fn, intervalMiSec) => {
	let context, args;
	let previous = 0;
	return function(){
		let now = +new Date();
		context = this;
		args = arguments;
		if(now - previous > intervalMiSec){
			fn.apply(context, args);
			previous = now;
		}
	}
};

/**
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
 * @param fn
 * @param intervalMiSec
 * @return {(function(): void)|*}
 */
const debounce = (fn, intervalMiSec) => {
	let timeout;
	return function(){
		let context = this;
		let args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			fn.apply(context, args);
		}, intervalMiSec);
	}
};

const CURRENT_FILE = '/Lang/Util.js';
const ENTRY_FILE = '/index.js';

/**
 * 获取当前库脚本调用地址（这里默认当前库只有两种调用形式：独立模块调用以及合并模块调用）
 * @return {string}
 */
const getLibEntryScript = () => {
	let script = getCurrentScript();
	if(!script){
		throw "Get script failed";
	}
	if(script.indexOf(CURRENT_FILE) >= 0){
		return script.replace(CURRENT_FILE, ENTRY_FILE);
	}
	return script;
};

/**
 * 加载当前库模块
 * @return {Promise<*>}
 */
const getLibModule = async () => {
	let script = getLibEntryScript();
	return await import(script);
};

/**
 * 获取顶部窗口模块（如果没有顶部窗口，则获取当前窗口模块）
 * @type {(function(): Promise<*>)|undefined}
 */
const getLibModuleTop = (() => {
	if(top === window){
		return getLibModule;
	}
	if(top.WEBCOM_GET_LIB_MODULE){
		return top.WEBCOM_GET_LIB_MODULE;
	}
	throw "No WebCom library script loaded detected.";
})();

/**
 * 清理版本，去除无用字符
 * @param {String} version
 * @return {Number[]}
 */
const normalizeVersion = (version) => {
	let trimmed = version ? version.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1") : '',
		pieces = trimmed.split('.'),
		partsLength,
		parts = [],
		value,
		piece,
		num,
		i;
	for(i = 0; i < pieces.length; i += 1){
		piece = pieces[i].replace(/\D/g, '');
		num = parseInt(piece, 10);
		if(isNaN(num)){
			num = 0;
		}
		parts.push(num);
	}
	partsLength = parts.length;
	for(i = partsLength - 1; i >= 0; i -= 1){
		value = parts[i];
		if(value === 0){
			parts.length -= 1;
		}else {
			break;
		}
	}
	return parts;
};

/**
 * 版本比较
 * @param {String} version1
 * @param {String} version2
 * @param {Number} index
 * @return {number|number}
 */
const versionCompare = (version1, version2, index) => {
	let stringLength = index + 1,
		v1 = normalizeVersion(version1),
		v2 = normalizeVersion(version2);
	if(v1.length > stringLength){
		v1.length = stringLength;
	}
	if(v2.length > stringLength){
		v2.length = stringLength;
	}
	let size = Math.min(v1.length, v2.length), i;
	for(i = 0; i < size; i += 1){
		if(v1[i] !== v2[i]){
			return v1[i] < v2[i] ? -1 : 1;
		}
	}
	if(v1.length === v2.length){
		return 0;
	}
	return (v1.length < v2.length) ? -1 : 1;
};

window.WEBCOM_GET_LIB_MODULE = getLibModule;
window.WEBCOM_GET_SCRIPT_ENTRY = getLibEntryScript;

/**
 * array_column
 * @param arr
 * @param col_name
 * @returns {Array}
 */
const arrayColumn = (arr, col_name) => {
	let data = [];
	for(let i in arr){
		data.push(arr[i][col_name]);
	}
	return data;
};

/**
 * @param arr
 * @param val
 * @return {string|null}
 */
const arrayIndex = (arr, val) => {
	for(let i in arr){
		if(arr[i] === val){
			return i;
		}
	}
	return null;
};

/**
 * @param obj1
 * @param obj2
 * @return {false|this is string[]}
 */
const isEquals = (obj1, obj2) => {
	let keys1 = Object.keys(obj1);
	let keys2 = Object.keys(obj2);
	//return true when the two json has same length and all the properties has same value key by key
	return keys1.length === keys2.length && Object.keys(obj1).every(key => obj1[key] === obj2[key]);
};

/**
 * 数组去重
 * @param {Array} arr
 * @returns {*}
 */
const arrayDistinct = (arr) => {
	let tmpMap = new Map();
	return arr.filter(item => {
		if(!tmpMap.has(item)){
			tmpMap.set(item, true);
			return true;
		}
	});
};

/**
 * array group
 * @param arr
 * @param by_key
 * @param limit limit one child
 * @returns {*}
 */
const arrayGroup = (arr, by_key, limit) => {
	if(!arr || !arr.length){
		return arr;
	}
	let tmp_rst = {};
	arr.forEach(item => {
		let k = item[by_key];
		if(!tmp_rst[k]){
			tmp_rst[k] = [];
		}
		tmp_rst[k].push(item);
	});
	if(!limit){
		return tmp_rst;
	}
	let rst = [];
	for(let i in tmp_rst){
		rst[i] = tmp_rst[i][0];
	}
	return rst;
};

/**
 * 按照对象 KEY 排序
 * @param {Object} obj
 * @return {{}}
 */
const sortByKey = (obj) => {
	return Object.keys(obj).sort().reduce(function(result, key){
		result[key] = obj[key];
		return result;
	}, {});
};

/**
 * 数组分块
 * @param {Array} list 数据
 * @param {Number} size 每块大小
 * @return {Array[]}
 */
const chunk = (list, size) => {
	let len = list.length;
	if(size < 1 || !len){
		return [];
	}
	if(size > len){
		return [list];
	}
	let res = [];
	let integer = Math.floor(len / size);
	let rest = len % size;
	for(let i = 1; i <= integer; i++){
		res.push(list.splice(0, size));
	}
	if(rest){
		res.push(list.splice(0, rest));
	}
	return res;
};

/**
 * @param path
 * @param value
 * @param srcObj
 * @param glue
 * @return {*}
 */
const objectPushByPath = (path, value, srcObj = {}, glue = '-') => {
	let segments = path.split(glue),
		cursor = srcObj,
		segment,
		i;

	for(i = 0; i < segments.length - 1; ++i){
		segment = segments[i];
		cursor = cursor[segment] = cursor[segment] || {};
	}

	return cursor[segments[i]] = value;
};

/**
 * 检测元素是否可以输入（包含checkbox、radio类）
 * @param {HTMLElement} el
 * @returns {boolean}
 */
const inputAble = el => {
	if(el.disabled || //禁用
		el.readOnly || //只读
		el.tagName === 'BUTTON' || //按钮
		(el.tagName === 'INPUT' && ['hidden', 'button','submit', 'reset'].includes(el.type)) //隐藏表单、按钮、提交按钮、重置按钮
	){
		return false;
	}
	return true;
};

/**
 * 获取form元素值。
 * 该函数过滤元素disabled情况，但不判断name是否存在
 * 针对多重选择，提取数据格式为数组
 * @param {HTMLFormElement} el
 * @returns {String|Array|null} 元素值，发生错误时返回null
 */
const getElementValue = (el) => {
	if(el.disabled){
		return null;
	}
	if(el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')){
		return el.checked ? el.value : null;
	}
	if(el.tagName === 'SELECT' && el.multiple){
		let vs = [];
		el.querySelectorAll('option[selected]').forEach(item => {
			vs.push(item.value);
		});
		return vs;
	}
	return el.value;
};

/**
 * 表单元素同步变更
 * 该方法会检测元素数据合法性（表单校验）
 * @param {HTMLElement} dom
 * @param {Function} getter 函数执行返回 Promise，返回null时，不填充input
 * @param {Function} setter 函数执行返回 Promise，checkbox、radio类型元素未选择时，返回null，设置失败元素将还原初始值
 */
const formSync = (dom, getter, setter) => {
	let els = getAvailableElements(dom);
	els.forEach(function(el){
		let name = el.name;
		let current_val = getElementValue(el);
		el.disabled = true;
		getter(name).then(v => {
			el.disabled = false;
			if(el.type === 'radio' || el.type === 'checkbox'){
				el.checked = el.value == v;
				current_val = v;
			}else if(v !== null){
				el.value = v;
				current_val = v;
			}
		});
		el.addEventListener('change', e => {
			el.disabled = true;
			if(!el.checkValidity()){
				el.reportValidity();
				return;
			}
			let val = el.value;
			if((el.type === 'radio' || el.type === 'checkbox') && !el.checked){
				val = null;
			}
			setter(el.name, val).then(() => {
				el.disabled = false;
			}, () => {
				if(el.type === 'radio' || el.type === 'checkbox'){
					el.checked = el.value == current_val;
				}else if(current_val !== null){
					el.value = current_val;
				}
			});
		});
	});
};


/**
 * 获取指定容器下所有可用表单元素
 * @param {HTMLElement} dom
 * @param {Boolean} ignore_empty_name 是否忽略没有name属性的元素，缺省为必须校验
 * @return {HTMLFormElement[]}
 */
const getAvailableElements = (dom, ignore_empty_name = false) => {
	let els = dom.querySelectorAll('input,textarea,select');
	return Array.from(els).filter(el => {
		return !isButton(el) && !el.disabled && (ignore_empty_name || el.name);
	});
};

/**
 * 表单元素校验
 * @param {HTMLElement} dom
 * @param {Boolean} name_validate 是否校验名称必填
 * @return boolean 是否校验通过
 */
const formValidate = (dom, name_validate = false) => {
	let els = getAvailableElements(dom, !name_validate);
	let pass = true;
	Array.from(els).every(el => {
		if(!el.checkValidity()){
			el.reportValidity();
			pass = false;
			return false;
		}
		return true;
	});
	return pass;
};

/**
 * 获取指定DOM节点下表单元素包含的表单数据，并以Body String方式组装。
 * 该函数过滤表单元素处于 disabled、缺少name等不合理情况
 * @param {HTMLElement} dom 表单节点或普通HTML容器节点
 * @param {Boolean} validate 是否校验表单
 * @returns {String} 如果校验失败，则返回null
 */
const formSerializeString = (dom, validate= true)=>{
	let data_list = getFormDataAvailable(dom, validate);
	let data_string_list = [];
	data_list.forEach(item => {
		let [name, value] = item;
		data_string_list.push(encodeURIComponent(name) + '=' + encodeURIComponent(String(value)));
	});
	return data_string_list.join('&');
};

/**
 * 序列化PHP表单到JSON
 * PHP 表单元素名称允许使用中括号来表示多级数组
 * @param {HTMLElement} dom 表单节点或普通HTML容器节点
 * @param {Boolean} validate 是否校验表单
 * @return {Object}
 */
const serializePhpFormToJSON = (dom, validate = true)=>{
	let data_list = getFormDataAvailable(dom, validate);
	let json_obj = {};
	data_list.forEach(item => {
		let [name, value] = item;
		if(name.indexOf('[') < 0){
			json_obj[name] = value;
			return;
		}
		let name_path = name.replace(/\[]$/, '.0').replace(/]/g, '').replace(/\[/g, '.');
		objectPushByPath(name_path, value, json_obj, '.');
	});
	return json_obj;
};

/**
 * 获取表单可用数据，以数组方式返回
 * 注意：该数组包含 [name, value]，其中 name 可重复。
 * @param {HTMLElement} dom 表单节点或普通HTML容器节点
 * @param {Boolean} validate 是否校验表单
 * @return {Array[]}
 */
const getFormDataAvailable = (dom, validate = true) => {
	if(validate && !formValidate(dom)){
		return [];
	}
	let els = getAvailableElements(dom);
	let data_list = [];
	els.forEach(el=>{
		let name = el.name;
		let value = getElementValue(el);
		if(value !== null){
			data_list.push([name, value]);
		}
	});
	return data_list;
};

/**
 * 获取指定DOM节点下表单元素包含的表单数据，并以JSON方式组装。
 * 注意：同名表单项以JS数组方式组装，PHP方法名称中中括号将被作为变量名一部分使用
 * @param {HTMLElement} dom 表单节点或普通HTML容器节点
 * @param {Boolean} validate 是否校验表单
 * @returns {Object} JSON数据
 */
const formSerializeJSON = (dom, validate = true) => {
	let json_obj = {};
	let data_list = getFormDataAvailable(dom, validate);
	let name_counts = {};
	data_list.forEach(item=>{
		let [name, value] = item;
		if(name_counts[name] === undefined){
			name_counts[name] = 1;
		} else {
			name_counts[name]++;
		}
	});
	data_list.forEach(item => {
		let [name, value] = item;
		if(name_counts[name] > 1){
			if(json_obj[name] === undefined){
				json_obj[name] = [value];
			}else {
				json_obj[name].push(value);
			}
		}else {
			json_obj[name] = value;
		}
	});
	return json_obj;
};

/**
 * 转换表单数据对象到JSON对象
 * @example convertFormDataToObject({name:"hello", age:"10", isBoy:0, ext:"{city:'shenzhen'}"}, {name:"", age:0, isBoy:true, ext:{}})，
 * 结果返回： {name:"hello", age:10, isBoy:false, ext:{city:shenzhen}}
 * @param {Object} formDataMap 数据对象（从表单获取到的数据都是字符串类型的）
 * @param {Object} formatSchema 格式定义对象，如： {name:"Jack", age:10, isBoy:true}
 * @param {Boolean} mustExistsInSchema 是否必须存在格式定义中
 * @return {Object}
 */
const convertFormDataToObject = (formDataMap, formatSchema, mustExistsInSchema = true) => {
	let ret = {};
	for(let key in formDataMap){
		let value = formDataMap[key];
		let define = formatSchema[key];
		if(define === undefined){
			if(mustExistsInSchema){
				continue;
			}
			ret[key] = value;
			continue;
		}
		switch(typeof (define)){
			case 'string':
				ret[key] = value;
				break;
			case 'boolean':
				ret[key] = value === '1' || value === 'true';
				break;
			case 'number':
				ret[key] = parseInt(value, 10);
				break;
			case 'object':
				ret[key] = value ? JSON.parse(value) : {};
				break;
			default:
				throw "format schema no supported";
		}
	}
	return ret;
};

let _form_data_cache_init = {};
let _form_data_cache_new = {};
let _form_us_msg = {};
let _form_us_sid_attr_key = Theme.Namespace+'form-unsaved-sid';

/**
 * 绑定页面离开时，表单未保存警告
 * @param {HTMLFormElement} form
 * @param {String} alertMsg
 */
const bindFormUnSavedUnloadAlert = (form, alertMsg = '您的表单尚未保存，是否确认离开？')=>{
	if(form.getAttribute(_form_us_sid_attr_key)){
		return;
	}
	let us_sid = guid();
	_form_us_msg[us_sid] = alertMsg;
	form.setAttribute(_form_us_sid_attr_key, us_sid);
	window.addEventListener('beforeunload', (e) => {
		if(!document.body.contains(form)){
			return "";
		}
		let msg = validateFormChanged(form);
		console.log('unchanged msg', msg);
		if(msg){
			e.preventDefault();
			e.returnValue = msg;
			return msg;
		}
	});
	let els = getAvailableElements(form, true);
	els.forEach(el=>{
		el.addEventListener('input', ()=>{
			_form_data_cache_new[us_sid] = formSerializeJSON(form, false);
		});
	});
	resetFormChangedState(form);
};

/**
 * 校验表单内容是否变更
 * @param {HTMLFormElement} form
 * @return {boolean|String}
 */
const validateFormChanged = (form) => {
	let us_sid = form.getAttribute(_form_us_sid_attr_key);
	if(!us_sid){
		throw "Form no init by bindFormUnSavedAlert()";
	}
	if(!isEquals(_form_data_cache_init[us_sid], _form_data_cache_new[us_sid])){
		return _form_us_msg[us_sid];
	}
	return false;
};

/**
 * 重置表单未保存提示状态
 * @param {HTMLFormElement} form
 */
const resetFormChangedState = (form) => {
	let us_sid = form.getAttribute(_form_us_sid_attr_key);
	if(!us_sid){
		throw "Form no init by bindFormUnSavedAlert()";
	}
	_form_data_cache_init[us_sid] = _form_data_cache_new[us_sid] = formSerializeJSON(form, false);
};

/**
 * 转换对象为表单元素数值
 * @param {Object} objectMap
 * @param {Array} boolMapping
 * @return {Object}
 */
const convertObjectToFormData = (objectMap, boolMapping = ["1", "0"]) => {
	let ret = {};
	for(let key in objectMap){
		let value = objectMap[key];
		switch(typeof (value)){
			case 'string':
			case 'number':
				ret[key] = String(value);
				break;
			case 'boolean':
				ret[key] = value ? boolMapping[0] : boolMapping[1];
				break;
			case 'object':
				ret[key] = JSON.stringify(value);
				break;
			default:
				throw "format schema no supported";
		}
	}
	return ret;
};

/**
 * 构建 HTML Input:hidden 标签
 * @param {Object} maps {key:value}
 * @return {string}
 */
const buildHtmlHidden = (maps)=>{
	let html = '';
	for(let key in maps){
		let val = maps[key] === null ? '' : maps[key];
		html += `<input type="hidden" name="${escapeAttr(key)}" value="${escapeAttr(val)}"/>`;
	}
	return html;
};

/**
 * 异步组件
 * 参数：
 * ACAsync.FORM_DATA_PACKAGE_TYPE 设置数据打包方式，如后端是PHP，为兼容PHP数组识别语法，请使用：PACKAGE_TYPE_STRING 方式打包
 * 缺省为 PACKAGE_TYPE_JSON 方式打包
 * node[data-async-url] | a[href] | form[action] 请求url
 * node[data-async-method] | form[method] 请求方法，缺省为GET
 * node[data-async-data] | form{*} 请求数据
 */
class ACAsync {
	static REQUEST_FORMAT = REQUEST_FORMAT.JSON;

	//默认成功回调处理函数
	static COMMON_SUCCESS_RESPONSE_HANDLE = (rsp) => {
		let next = () => {
			if(rsp.forward_url){
				parent.location.href = rsp.forward_url;
			}else {
				parent.location.reload();
			}
		};
		rsp.message ? ToastClass.showSuccess(rsp.message, next) : next();
	};

	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let url, data, method,
				onsuccess = param.onsuccess || ACAsync.COMMON_SUCCESS_RESPONSE_HANDLE;
			if(node.tagName === 'FORM'){
				url = node.action;
				data = ACAsync.REQUEST_FORMAT === REQUEST_FORMAT.JSON ? formSerializeJSON(node) : formSerializeString(node);
				method = node.method.toLowerCase() === 'post' ? 'post' : 'get';
			}else if(node.tagName === 'A'){
				url = node.href;
				method = 'get';
			}

			//优先使用参数传参
			url = param.url || url;
			method = param.method || method || 'get';
			data = param.data || data;

			let loader = ToastClass.showLoadingLater('正在请求中，请稍候···');
			requestJSON(url, data, method, {requestFormat:ACAsync.REQUEST_FORMAT}).then(rsp => {
				if(rsp.code === 0){
					onsuccess(rsp);
					resolve();
				}else {
					ToastClass.showError(rsp.message || '系统错误');
					console.error('Request Error:', url, data, method, rsp);
				}
			}, err => {
				ToastClass.showError(err);
				console.error('Request Error:', err);
			}).finally(()=>{
				loader && loader.hide();
			});
		})
	}
}

let default_masker = null;
let CSS_CLASS = Theme.Namespace + '-masker';

const showMasker = (masker) => {
	if(!masker){
		masker = createDomByHtml(`<div class="${CSS_CLASS}"></div>`, document.body);
	}
	masker.style.display = '';
	return masker;
};

const hideMasker = (masker) => {
	masker && (masker.style.display = 'none');
};

const Masker = {
	zIndex: Theme.MaskIndex,
	show: () => {
		default_masker = showMasker(default_masker);
	},
	hide: () => {
		hideMasker(default_masker);
	},
	instance: () => {
		let new_masker;
		return {
			show: () => {
				new_masker = showMasker(new_masker);
			},
			hide: () => {
				hideMasker(new_masker);
			}
		}
	}
};

insertStyleSheet(`
.${CSS_CLASS} {
	position:fixed;
	top:0;left:0;
	right:0;
	bottom:0;
	background:var(${Theme.CssVar.FULL_SCREEN_BACKGROUND_COLOR});
	backdrop-filter:var(${Theme.CssVar.FULL_SCREEN_BACKDROP_FILTER});
	z-index:${Masker.zIndex}}
`, Theme.Namespace + 'masker-style');

const COM_ID$3 = Theme.Namespace + 'dialog';
const DLG_CLS_PREF = COM_ID$3;
const DLG_CLS_TI = DLG_CLS_PREF + '-ti';
const DLG_CLS_CTN = DLG_CLS_PREF + '-ctn';
const DLG_CLS_OP = DLG_CLS_PREF + '-op';
const DLG_CLS_TOP_CLOSE = DLG_CLS_PREF + '-close';
const DLG_CLS_BTN = DLG_CLS_PREF + '-btn';

const IFRAME_ID_ATTR_FLAG = 'data-dialog-flag';

const STATE_ACTIVE = 'active'; //激活状态。如果是存在模态对话框，只允许唯一一个激活，如果没有模态对话框情况，允许多个同时激活
const STATE_DISABLED = 'disabled'; //禁用状态。存在模态框情况下，全局只允许唯一一个激活，其余均为禁用状态
const STATE_HIDDEN = 'hidden'; //隐藏状态。通过主动调用hide方法使得对话框隐藏

const DIALOG_TYPE_ATTR_KEY = 'data-dialog-type';
const TYPE_IFRAME = 'iframe';
const TYPE_ALERT = 'alert';
const TYPE_PROMPT = 'prompt';
const TYPE_CONFIRM = 'confirm';

/**
 * Content Type
 * @type {string}
 */
const DLG_CTN_TYPE_IFRAME = DLG_CLS_PREF + '-ctn-iframe';
const DLG_CTN_TYPE_HTML = DLG_CLS_PREF + '-ctn-html';

insertStyleSheet(`
	.${DLG_CLS_PREF} {display:block; border-radius:var(${Theme.CssVar.PANEL_RADIUS}); overflow:hidden; padding:0; box-sizing:border-box; width:calc(100% - 2 * 5em); background-color:var(${Theme.CssVar.BACKGROUND_COLOR}); color:var(${Theme.CssVar.COLOR}); z-index:${Theme.DialogIndex};position:absolute;}
	.${DLG_CLS_PREF} .${DLG_CLS_PREF}-ti {user-select:none; box-sizing:border-box; line-height:1; padding:0.75em 2.5em 0.75em 0.75em; font-weight:normal;color:var(${Theme.CssVar.CSS_LIGHTEN})}
	.${DLG_CLS_PREF} .${DLG_CLS_TOP_CLOSE} {position:absolute; display:flex; align-items:center; line-height:1; width:2.5em; height:2.5em; overflow:hidden; opacity:0.6; cursor:pointer; right:0; top:0;box-sizing:border-box; text-align:center;}
	.${DLG_CLS_PREF} .${DLG_CLS_TOP_CLOSE}:after {content:"\\e61a"; font-size:0.9em; font-family:${Theme.IconFont}; line-height:1; display:block; flex:1}
	.${DLG_CLS_PREF} .${DLG_CLS_TOP_CLOSE}:hover {opacity:1;}
	.${DLG_CLS_PREF} .${DLG_CLS_CTN} {overflow-y:auto}
	.${DLG_CLS_PREF} .${DLG_CLS_OP} {padding:.75em 0.5em; text-align:right;}
	.${DLG_CLS_PREF} .${DLG_CLS_BTN} {margin-right:0.5em;}
	.${DLG_CLS_PREF}.full-dialog .${DLG_CLS_CTN} {max-height:calc(100vh - 100px); overflow-y:auto}
	.${DLG_CLS_PREF}[data-dialog-state="${STATE_ACTIVE}"] {box-shadow:1px 1px 25px 0px #44444457; border-color:#ccc;}
	.${DLG_CLS_PREF}[data-dialog-state="${STATE_ACTIVE}"] .dialog-ti {color:#333}
	.${DLG_CLS_PREF}[data-dialog-state="${STATE_DISABLED}"]:before {content:""; position:absolute; z-index:9999999999; width:100%; height:100%;}
	.${DLG_CLS_PREF}[data-dialog-state="${STATE_DISABLED}"] * {opacity:0.85 !important; user-select:none;}
	
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_IFRAME}"] iframe {width:100%; border:none; display:block;}
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_ALERT}"] .${DLG_CLS_CTN},
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_CONFIRM}"] .${DLG_CLS_CTN} {padding:1em;}
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_PROMPT}"] .${DLG_CLS_CTN} {padding:0.5em 1em;}
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_PROMPT}"] .${DLG_CLS_CTN} label {padding-bottom:0.5em; display:block;}
	.${DLG_CLS_PREF}[${DIALOG_TYPE_ATTR_KEY}="${TYPE_PROMPT}"] .${DLG_CLS_CTN} input[type=text] {width:100%; box-sizing:border-box;}
	
`, COM_ID$3 + '-style');

/**
 * 绑定ESC按键事件关闭最上一层可关闭的对话框
 */
document.addEventListener('keyup', e => {
	if(e.keyCode === KEYS.Esc){
		let current = DialogManager.getFrontDialog();
		if(current && current.config.showTopCloseButton){
			DialogManager.close(current);
			return false;
		}
	}
});

/** @var Dialog[] **/
let DIALOG_COLLECTION = [];

/**
 * 对话框层级比较函数（层级高的排上面）
 * @param {Dialog} dialog1
 * @param {Dialog} dialog2
 * @return {number}
 */
const sortZIndex = (dialog1, dialog2) => {
	return dialog1.zIndex - dialog2.zIndex;
};

/**
 * 获取非隐藏的模态对话框列表
 * 顺序由底到上排列
 * @param {Dialog|null} excludedDialog 排除在外的对话框
 * @return {Dialog[]}
 */
const getModalDialogs = (excludedDialog = null) => {
	let list = DIALOG_COLLECTION.filter(d => {
		return d.state !== STATE_HIDDEN && d.config.modal && (!excludedDialog || d !== excludedDialog);
	});
	return list.sort(sortZIndex);
};

/**
 * 获取非隐藏的普通对话框列表
 * 顺序由底到上排列
 * @param {Dialog|null} excludedDialog 排除在外的对话框
 * @return {Dialog[]}
 */
const getNoModalDialogs = (excludedDialog = null) => {
	let list = DIALOG_COLLECTION.filter(d => {
		return d.state !== STATE_HIDDEN && !d.config.modal && (!excludedDialog || d !== excludedDialog);
	});
	return list.sort(sortZIndex);
};

/**
 * 获取所有非隐藏对话框
 * 顺序由底到上排列
 * @param {Dialog|null} excludedDialog 排除在外的对话框
 * @return {*[]}
 */
const getAllAvailableDialogs = (excludedDialog = null) => {
	let modalDialogs = getModalDialogs(excludedDialog);
	let noModalDialogs = getNoModalDialogs(excludedDialog);
	return noModalDialogs.concat(modalDialogs);
};

/**
 * 设置对话框状态
 * @param {Dialog} dlg
 * @param {String} state
 */
const setState = (dlg, state) => {
	dlg.state = state;
	dlg.dom.setAttribute('data-dialog-state', state);
	dlg.dom.style.display = state === STATE_HIDDEN ? 'none' : '';
};

/**
 * 设置对话框zIndex
 * @param {Dialog} dlg
 * @param {Number|String} zIndex
 */
const setZIndex = (dlg, zIndex) => {
	dlg.zIndex = dlg.dom.style.zIndex = String(zIndex);
};

const setType = (dlg, type) => {
	dlg.dom.setAttribute('data-dialog-type', type);
};

/**
 * 对话框管理器
 */
const DialogManager = {
	register(dlg){
		DIALOG_COLLECTION.push(dlg);
	},

	/**
	 * 激活并显示对话框
	 * @param {Dialog} dlg
	 */
	show(dlg){
		if(dlg.config.showMasker){
			Masker.show();
		}
		dlg.state = STATE_DISABLED; //避免 getModal* 获取不到当前对话框

		let modalDialogs = getModalDialogs(dlg);
		let noModalDialogs = getNoModalDialogs(dlg);
		if(dlg.config.modal){
			noModalDialogs.forEach(d => {
				setState(d, STATE_DISABLED);
			});
			modalDialogs.forEach(d => {
				setState(d, STATE_DISABLED);
			});
			setZIndex(dlg, Dialog.DIALOG_INIT_Z_INDEX + noModalDialogs.length + modalDialogs.length);
			setState(dlg, STATE_ACTIVE);
		}else {
			modalDialogs.forEach((d, idx) => {
				setZIndex(d, dlg.zIndex + idx + 1);
			});
			setZIndex(dlg, Dialog.DIALOG_INIT_Z_INDEX + noModalDialogs.length);
			setState(dlg, modalDialogs.length ? STATE_DISABLED : STATE_ACTIVE);
		}
		dlg.onShow.fire();
	},

	/**
	 * 关闭对话框
	 * @param {Dialog} dlg
	 * @param {Boolean} destroy 是否摧毁
	 */
	close: (dlg, destroy = true) => {
		if(dlg.onClose.fire() === false){
			console.warn('dialog close cancel by onClose events');
			return false;
		}
		let modalDialogs = getModalDialogs(dlg);
		let noModalDialogs = getNoModalDialogs(dlg);
		modalDialogs.forEach((d, idx) => {
			setZIndex(d, Dialog.DIALOG_INIT_Z_INDEX + noModalDialogs.length + idx);
		});
		//active last modal dialog
		if(modalDialogs.length){
			setState(modalDialogs[modalDialogs.length - 1], STATE_ACTIVE);
		}
		noModalDialogs.forEach((d, idx) => {
			setZIndex(d, Dialog.DIALOG_INIT_Z_INDEX + idx);
			setState(d, modalDialogs.length ? STATE_DISABLED : STATE_ACTIVE);
		});
		if(destroy){
			DIALOG_COLLECTION = DIALOG_COLLECTION.filter(d => d !== dlg);
			dlg.dom.parentNode.removeChild(dlg.dom);
		}else {
			setState(dlg, STATE_HIDDEN);
		}
		getAllAvailableDialogs().length || Masker.hide();
	},

	/**
	 * 隐藏对话框
	 * @param dlg
	 * @returns {boolean}
	 */
	hide(dlg){
		return this.close(dlg, false);
	},

	/**
	 * 获取当前激活的对话框
	 * @returns {Dialog|null}
	 */
	getFrontDialog(){
		let dialogs = getAllAvailableDialogs();
		return dialogs[dialogs.length - 1];
	},

	/**
	 * 尝试设置指定窗口前置
	 * @param {Dialog} dlg
	 * @return {boolean}
	 */
	trySetFront(dlg){
		let modalDialogs = getModalDialogs();
		let currentFrontDialog = this.getFrontDialog();

		if(currentFrontDialog === dlg){
			return true;
		}

		//模态模式下，不允许通过该方法切换对话框，
		//只有在对话框 show、hide的情况下自动调整层级
		if(modalDialogs.length){
			return false;
		}

		let otherNoModalDialogs = getNoModalDialogs(dlg);
		otherNoModalDialogs.forEach((d, idx) => {
			setZIndex(d, Dialog.DIALOG_INIT_Z_INDEX + idx);
		});
		setZIndex(dlg, Dialog.DIALOG_INIT_Z_INDEX + otherNoModalDialogs.length);
	},

	/**
	 * 关闭全部对话框
	 */
	closeAll(){
		DIALOG_COLLECTION.forEach(dlg => {
			dlg.dom?.parentNode.removeChild(dlg.dom);
		});
		DIALOG_COLLECTION = [];
		Masker.hide();
	},

	/**
	 * 根据ID查找对话框
	 * @param id
	 * @returns {Dialog}
	 */
	findById(id){
		return DIALOG_COLLECTION.find(dlg => {
			return dlg.id === id
		});
	}
};

const resolveContentType = (content) => {
	if(typeof (content) === 'object' && content.src){
		return DLG_CTN_TYPE_IFRAME;
	}
	return DLG_CTN_TYPE_HTML;
};

/**
 * 构造DOM结构
 * @param {Dialog} dlg
 */
const domConstruct = (dlg) => {
	let html = `
		<div class="${DLG_CLS_PREF}" 
			id="${dlg.id}" 
			style="${dlg.state === STATE_HIDDEN ? 'display:none' : ''}; ${dlg.config.width ? 'width:' + dimension2Style(dlg.config.width) : ''}">
		${dlg.config.title ? `<div class="${DLG_CLS_TI}">${dlg.config.title}</div>` : ''}
		${dlg.config.showTopCloseButton ? `<span class="${DLG_CLS_TOP_CLOSE}" title="关闭" tabindex="0"></span>` : ''}
	`;

	let style = [];
	if(dlg.config.minContentHeight){
		style.push('min-height:' + dimension2Style(dlg.config.minContentHeight));
	}
	if(dlg.config.maxContentHeight){
		style.push('max-height:' + dimension2Style(dlg.config.maxContentHeight));
	}

	html += `<div class="${DLG_CLS_CTN} ${resolveContentType(dlg.config.content)}" style="${style.join(';')}">${renderContent(dlg)}</div>`;
	if(dlg.config.buttons.length){
		html += `<div class="${DLG_CLS_OP}">`;
		dlg.config.buttons.forEach(button => {
			html += `<input type="button" class="${DLG_CLS_BTN}" ${button.default ? 'autofocus' : ''} tabindex="0" value="${escapeAttr(button.title)}">`;
		});
		html += '</div>';
	}
	html += '</div>';
	dlg.dom = createDomByHtml(html, document.body);

	//update content height
	if(dlg.config.height){
		adjustHeight(dlg, dlg.config.height);
	}

	updatePosition$1(dlg);

	if(resolveContentType(dlg.config.content) === DLG_CTN_TYPE_IFRAME){
		setType(dlg, TYPE_IFRAME);
	}

	//bind iframe content
	if(!dlg.config.height && resolveContentType(dlg.config.content) === DLG_CTN_TYPE_IFRAME){
		let iframe = dlg.dom.querySelector('iframe');
		let obs;
		try{
			let upd = () => {
				let bdy = iframe.contentWindow.document.body;
				if(bdy){
					let h = bdy.scrollHeight || bdy.clientHeight || bdy.offsetHeight;
					adjustHeight(dlg, h);
					updatePosition$1(dlg);
				}
			};
			iframe.addEventListener('load', () => {
				obs = new MutationObserver(upd);
				obs.observe(iframe.contentWindow.document.body, {attributes: true, subtree: true, childList: true});
				upd();
			});
		}catch(err){
			try{
				obs && obs.disconnect();
			}catch(err){
				console.error('observer disconnect fail', err);
			}
			console.warn('iframe content upd', err);
		}
	}
	dlg.dom.style.display = 'none';
};

/**
 * 事件绑定
 * @param {Dialog} dlg
 */
const eventBind = (dlg) => {
	//bind dialog active
	dlg.dom.addEventListener('mousedown', () => {
		dlg.state === STATE_ACTIVE && DialogManager.trySetFront(dlg);
	});

	//bind buttons event
	for(let i in dlg.config.buttons){
		let cb = dlg.config.buttons[i].callback || dlg.close;
		let btn = dlg.dom.querySelectorAll(`.${DLG_CLS_OP} .${DLG_CLS_BTN}`)[i];
		btn.addEventListener('click', cb.bind(dlg), false);
	}

	//bind move
	if(dlg.config.moveAble){
		let start_move = false;
		let last_click_offset = null;
		dlg.dom.querySelector('.' + DLG_CLS_TI).addEventListener('mousedown', (e) => {
			if(e.currentTarget && domContained(dlg.dom, e.currentTarget, true)){
				start_move = true;
				last_click_offset = {x: e.clientX - dlg.dom.offsetLeft, y: e.clientY - dlg.dom.offsetTop};
			}
		});
		document.body.addEventListener('mouseup', () => {
			start_move = false;
			last_click_offset = null;
		});
		document.body.addEventListener('mousemove', (e) => {
			if(start_move && last_click_offset){
				dlg.dom.style.left = Math.max(e.clientX - last_click_offset.x, 0) + 'px';
				dlg.dom.style.top = Math.max(e.clientY - last_click_offset.y, 0) + 'px';
			}
		});
	}

	//bind top close button event
	if(dlg.config.showTopCloseButton){
		let close_btn = dlg.dom.querySelector(`.${DLG_CLS_TOP_CLOSE}`);
		buttonActiveBind(close_btn, dlg.close.bind(dlg));
	}

	//bind window resize un-move-able dialog
	!dlg.config.moveAble && window.addEventListener('resize', () => {
		updatePosition$1(dlg);
	});
};

/**
 * 更新对话框位置
 * @param {Dialog} dlg
 */
const updatePosition$1 = (dlg) => {
	let _hidden = dlg.state === STATE_HIDDEN;
	let ml, mt;
	if(!_hidden){
		[ml, mt] = keepRectCenter(dlg.dom.offsetWidth, dlg.dom.offsetHeight);
	}else {
		dlg.dom.style.visibility = 'hidden';
		dlg.dom.style.display = 'block';
		[ml, mt] = keepRectCenter(dlg.dom.offsetWidth, dlg.dom.offsetHeight);
		dlg.dom.style.display = 'none';
		dlg.dom.style.visibility = 'visible';
	}
	dlg.dom.style.top = mt + 'px';
	dlg.dom.style.left = ml + 'px';
};

/**
 * 更新
 * @param {Dialog} dlg
 * @param {Number} h
 */
const adjustHeight = (dlg, h) => {
	let ctn = dlg.dom.querySelector(`.${DLG_CLS_CTN}`);
	ctn.style.height = dimension2Style(h);
	if(resolveContentType(dlg.config.content) === DLG_CTN_TYPE_IFRAME){
		let iframe = dlg.dom.querySelector('iframe');
		iframe.style.height = dimension2Style(h);
	}
};

/**
 * 渲染内容区域
 * @param {Dialog} dlg
 * @returns {string}
 */
const renderContent = (dlg) => {
	switch(resolveContentType(dlg.config.content)){
		case DLG_CTN_TYPE_IFRAME:
			return `<iframe src="${dlg.config.content.src}" ${IFRAME_ID_ATTR_FLAG}="${dlg.id}"></iframe>`;

		case DLG_CTN_TYPE_HTML:
			return dlg.config.content;

		default:
			console.error('Content type error', dlg.config.content);
			throw 'Content type error';
	}
};

const CUSTOM_EVENT_BUCKS = {
	/** id: {event: []} **/
};

class Dialog {
	static CONTENT_MIN_HEIGHT = 30; //最小高度
	static DEFAULT_WIDTH = 500; //默认宽度
	static DIALOG_INIT_Z_INDEX = Theme.DialogIndex;

	//对话框ID，缺省为自动生成
	id = null;

	/** @var {HTMLElement} dom **/
	dom = null;

	state = STATE_HIDDEN;
	zIndex = Theme.DialogIndex;

	onClose = new BizEvent(true);
	onShow = new BizEvent(true);

	config = {
		title: '', //对话框标题
		content: '',
		modal: false, //是否为模态窗口
		width: Dialog.DEFAULT_WIDTH,
		height: null, //高度，缺省为自动高度
		maxContentHeight: null, //最大内容区高度，默认为标题和空隙预留50px
		minContentHeight: Dialog.CONTENT_MIN_HEIGHT,
		moveAble: true, //是否可移动
		showMasker: true, //是否显示遮罩，如果是模态对话框，会强制显示遮罩
		buttons: [/** {title:'', default:true, callback }**/], //对话框配置按钮列表
		showTopCloseButton: true, //是否显示顶部关闭窗口
	};

	/**
	 * @param {Object} config
	 * @param {String|Null} config.id 为对话框指定ID
	 * @param {String} config.title 对话框标题
	 * @param {String} config.content 对话框内容，允许提交 {src:"http://"} 格式，渲染为iframe
	 * @param {Boolean} config.modal 是否为模态对话框
	 * @param {Number} config.width 宽度
	 * @param {Number} config.height 高度
	 * @param {Number} config.maxHeight 最大高度
	 * @param {Boolean} config.moveAble 是否可以移动
	 * @param {Array} config.buttons 按钮列表
	 * @param {Boolean} config.buttons.default 单个按钮对象中是否作为默认按钮（默认聚焦）
	 * @param {String} config.buttons.title 按钮标题
	 * @param {Function} config.buttons.callback 按钮点击后回调，缺省为关闭对话框
	 * @param {Boolean} config.showTopCloseButton 是否显示对话框右上角关闭按钮，如果显示按钮则支持ESC关闭对话框
	 */
	constructor(config = {}){
		this.config = Object.assign(this.config, config);
		this.id = this.id || 'dialog-' + Math.random();
		if(!this.config.showMasker && this.config.modal){
			console.warn('已矫正：模态窗口强制显示遮罩');
		}
		this.config.showMasker = this.config.modal || this.config.showMasker;
		domConstruct(this);
		eventBind(this);
		DialogManager.register(this);
	}

	show(){
		DialogManager.show(this);
	}

	hide(){
		DialogManager.hide(this);
	}

	close(){
		DialogManager.close(this);
	}

	fireCustomEvent(event, ...args){
		if(CUSTOM_EVENT_BUCKS[this.id] && CUSTOM_EVENT_BUCKS[this.id][event]){
			CUSTOM_EVENT_BUCKS[this.id][event].fire(...args);
		}
	}

	listenCustomEvent(event, callback){
		if(CUSTOM_EVENT_BUCKS[this.id] === undefined){
			CUSTOM_EVENT_BUCKS[this.id] = {};
		}
		if(CUSTOM_EVENT_BUCKS[this.id][event] === undefined){
			CUSTOM_EVENT_BUCKS[this.id][event] = new BizEvent();
		}
		CUSTOM_EVENT_BUCKS[this.id][event].listen(callback);
	}

	updatePosition(){
		updatePosition$1(this);
	}

	/**
	 * 显示对话框
	 * @param {String} title
	 * @param {String} content
	 * @param {Object} config
	 * @param {String|Null} config.id
	 * @param {Boolean} config.modal
	 * @param {Number} config.width
	 * @param {Number} config.height
	 * @param {Number} config.maxHeight
	 * @param {Boolean} config.moveAble
	 * @param {Array} config.buttons
	 * @param {Boolean} config.buttons.default
	 * @param {String} config.buttons.title
	 * @param {Function} config.buttons.callback
	 * @param {Boolean} config.showTopCloseButton
	 * @returns {Dialog}
	 */
	static show(title, content, config){
		let p = new Dialog({title, content, ...config});
		p.show();
		return p;
	}

	/**
	 * 确认框
	 * @param {String} title
	 * @param {String} content
	 * @param {Object} opt
	 * @returns {Promise<unknown>}
	 */
	static confirm(title, content, opt = {}){
		return new Promise((resolve, reject) => {
			let p = new Dialog({
				title,
				content,
				buttons: [
					{
						title: '确定', default: true, callback: () => {
							p.close();
							resolve();
						}
					},
					{
						title: '取消', callback: () => {
							p.close();
							reject && reject();
						}
					}
				],
				showTopCloseButton: false,
				...opt
			});
			setType(p, TYPE_CONFIRM);
			p.show();
		});
	}

	/**
	 * 提示框
	 * @param {String} title
	 * @param {String} content
	 * @param {Object} opt
	 * @returns {Promise<unknown>}
	 */
	static alert(title, content, opt = {}){
		return new Promise(resolve => {
			let p = new Dialog({
				title,
				content,
				buttons: [{
					title: '确定', default: true, callback: () => {
						p.close();
						resolve();
					}
				},],
				showTopCloseButton: false,
				...opt
			});
			setType(p, TYPE_ALERT);
			p.show();
		});
	}

	/**
	 * 输入提示框
	 * @param {String} title
	 * @param {Object} option
	 * @param {String} option.initValue
	 * @returns {Promise<unknown>}
	 */
	static prompt(title, option = {initValue: ""}){
		return new Promise((resolve, reject) => {
			let input_id = guid(Theme.Namespace + '-prompt-input');
			let input = null;
			let p = new Dialog({
				title: '请输入',
				content: `<label for="${input_id}">${title}</label><input type="text" id="${input_id}" value="${escapeAttr(option.initValue || '')}"/>`,
				buttons: [
					{
						title: '确定', default: true, callback: () => {
							if(resolve(input.value) === false){
								return false;
							}
							p.close();
						}
					},
					{title: '取消'}
				],
				showTopCloseButton: true,
				...option
			});
			input = p.dom.querySelector('input[type=text]');
			setType(p, TYPE_PROMPT);
			p.onClose.listen(reject);
			p.onShow.listen(() => {
				input.focus();
				input.addEventListener('keydown', e => {
					if(e.keyCode === KEYS.Enter){
						if(resolve(input.value) === false){
							return false;
						}
						p.close();
					}
				});
			});
			p.show();
		});
	}
}

/**
 * 获取当前页面（iframe）所在的对话框
 * @returns {Promise}
 */
const getCurrentFrameDialog = () => {
	return new Promise((resolve, reject) => {
		if(!window.parent || !window.frameElement){
			reject('no in iframe');
			return;
		}
		if(!parent[COM_ID$3].DialogManager){
			reject('No dialog manager found.');
			return;
		}
		let id = window.frameElement.getAttribute(IFRAME_ID_ATTR_FLAG);
		if(!id){
			reject("ID no found in iframe element");
		}
		let dlg = parent[COM_ID$3].DialogManager.findById(id);
		if(dlg){
			resolve(dlg);
		}else {
			reject('no dlg find:' + id);
		}
	});
};
if(!window[COM_ID$3]){
	window[COM_ID$3] = {};
}

window[COM_ID$3].Dialog = Dialog;
window[COM_ID$3].DialogManager = DialogManager;

let CONTEXT_WINDOW$1 = getContextWindow();
let DialogClass = CONTEXT_WINDOW$1[COM_ID$3].Dialog || Dialog;
let DialogManagerClass = CONTEXT_WINDOW$1[COM_ID$3].DialogManager || DialogManager;

/**
 * 对话框组件
 * 参数：
 * node[data-dialog-url] iframe对话框页面地址
 * node[data-content] 对话框内容
 * a[title] | node[text] 对话框标题
 */
class ACDialog {
	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let title, url, content;

			if(node.tagName === 'A'){
				url = node.href || url;
				title = node.title || title;
			}
			if(node.innerText){
				title = cutString(node.innerText, 30);
			}

			title = param.title || title;
			url = param.url || url;
			content = param.content || content;
			if(url){
				content = {src: url};
			}
			DialogClass.show(title || '对话框', content, param);
			resolve();
		})
	}
}

/**
 * 确认对话框
 * 参数：
 * node[data-confirm-title] 标题，缺省为”确认“
 * node[data-confirm-message] 内容
 */
class ACConfirm {
	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let title = param.title;
			let message = param.message;
			DialogClass.confirm(title || '确认', message).then(resolve, reject);
		});
	}
}

const GUID_BIND_KEY = Theme.Namespace+'-tip-guid';
const NS = Theme.Namespace + 'tip';
const DEFAULT_DIR = 11;
const TRY_DIR_MAP = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let TIP_COLLECTION = {};

insertStyleSheet(`
	.${NS}-container-wrap {position:absolute; filter:drop-shadow(var(${Theme.CssVar.PANEL_SHADOW})); --tip-arrow-size:10px; --tip-gap:calc(var(--tip-arrow-size) * 0.7071067811865476); --tip-mgr:calc(var(--tip-gap) - var(--tip-arrow-size) / 2); color:var(${Theme.CssVar.COLOR}); z-index:${Theme.TipIndex};}
	.${NS}-arrow {display:block; background-color:var(${Theme.CssVar.BACKGROUND_COLOR}); clip-path:polygon(0% 0%, 100% 100%, 0% 100%); width:var(--tip-arrow-size); height:var(--tip-arrow-size); position:absolute; z-index:1}
	.${NS}-close {display:block; overflow:hidden; width:15px; height:20px; position:absolute; right:7px; top:10px; text-align:center; cursor:pointer; font-size:13px; opacity:.5}
	.${NS}-close:hover {opacity:1}
	.${NS}-content {border-radius:var(${Theme.CssVar.PANEL_RADIUS}); background-color:var(${Theme.CssVar.BACKGROUND_COLOR}); padding:1em;  max-width:30em; word-break:break-all}
	
	/** top **/
	.${NS}-container-wrap[data-tip-dir="11"],
	.${NS}-container-wrap[data-tip-dir="0"],
	.${NS}-container-wrap[data-tip-dir="1"]{padding-top:var(--tip-gap)}
	.${NS}-container-wrap[data-tip-dir="11"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="0"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="1"] .${NS}-arrow{top:var(--tip-mgr); transform:rotate(135deg);}
	.${NS}-container-wrap[data-tip-dir="11"] .${NS}-arrow{left:calc(25% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="0"] .${NS}-arrow{left:calc(50% - var(--tip-gap));background:orange;}
	.${NS}-container-wrap[data-tip-dir="1"] .${NS}-arrow{left:calc(75% - var(--tip-gap));}
	
	/** left **/
	.${NS}-container-wrap[data-tip-dir="8"],
	.${NS}-container-wrap[data-tip-dir="9"],
	.${NS}-container-wrap[data-tip-dir="10"]{padding-left:var(--tip-gap)}
	.${NS}-container-wrap[data-tip-dir="8"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="9"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="10"] .${NS}-close{top:3px;}
	.${NS}-container-wrap[data-tip-dir="8"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="9"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="10"] .${NS}-arrow{left:var(--tip-mgr); transform:rotate(45deg);}
	.${NS}-container-wrap[data-tip-dir="8"] .${NS}-arrow{top:calc(75% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="9"] .${NS}-arrow{top:calc(50% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="10"] .${NS}-arrow{top:calc(25% - var(--tip-gap));}
	
	/** bottom **/
	.${NS}-container-wrap[data-tip-dir="5"],
	.${NS}-container-wrap[data-tip-dir="6"],
	.${NS}-container-wrap[data-tip-dir="7"]{padding-bottom:var(--tip-gap)}
	.${NS}-container-wrap[data-tip-dir="5"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="6"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="7"] .${NS}-close{top:3px;}
	.${NS}-container-wrap[data-tip-dir="5"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="6"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="7"] .${NS}-arrow{bottom:var(--tip-mgr); transform:rotate(-45deg);}
	.${NS}-container-wrap[data-tip-dir="5"] .${NS}-arrow{right: calc(25% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="6"] .${NS}-arrow{right: calc(50% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="7"] .${NS}-arrow{right: calc(75% - var(--tip-gap));}
	
	/** right **/
	.${NS}-container-wrap[data-tip-dir="2"],
	.${NS}-container-wrap[data-tip-dir="3"],
	.${NS}-container-wrap[data-tip-dir="4"]{padding-right:var(--tip-gap)}
	.${NS}-container-wrap[data-tip-dir="2"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="3"] .${NS}-close,
	.${NS}-container-wrap[data-tip-dir="4"] .${NS}-close{right:13px;top:3px;}
	.${NS}-container-wrap[data-tip-dir="2"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="3"] .${NS}-arrow,
	.${NS}-container-wrap[data-tip-dir="4"] .${NS}-arrow{right:var(--tip-mgr);transform: rotate(-135deg);}
	.${NS}-container-wrap[data-tip-dir="2"] .${NS}-arrow{top:calc(25% - var(--tip-gap))}
	.${NS}-container-wrap[data-tip-dir="3"] .${NS}-arrow{top:calc(50% - var(--tip-gap));}
	.${NS}-container-wrap[data-tip-dir="4"] .${NS}-arrow{top:calc(75% - var(--tip-gap))}
`, Theme.Namespace + 'tip-style');

/**
 * 绑定事件
 * @param {Tip} tip
 */
let bindEvent = (tip)=>{
	if(tip.option.showCloseButton){
		let close_btn = tip.dom.querySelector(`.${NS}-close`);
		close_btn.addEventListener('click', () => {tip.hide();}, false);
		document.addEventListener('keyup', (e) => {
			if(e.keyCode === KEYS.Esc){
				tip.hide();
			}
		}, false);
	}
};

/**
 * 自动计算方位
 * @param {Tip} tipObj
 * @returns {number}
 */
let calDir = (tipObj)=>{
	let tipWidth = tipObj.dom.offsetWidth;
	let tipHeight = tipObj.dom.offsetHeight;
	let relateNodeHeight = tipObj.relateNode.offsetHeight;
	let relateNodeWidth = tipObj.relateNode.offsetWidth;
	let relateNodeOffset = getDomOffset(tipObj.relateNode);

	let viewRegion = getRegion();

	for(let i = 0; i < TRY_DIR_MAP.length; i++){
		let [offsetLeft, offsetTop] = calcTipPositionByDir(TRY_DIR_MAP[i], tipWidth, tipHeight, relateNodeHeight, relateNodeWidth);
		let rect = {
			left: relateNodeOffset.left + offsetLeft,
			top: relateNodeOffset.top + offsetTop,
			width: tipWidth,
			height: tipHeight
		};
		let layout_rect = {
			left: document.body.scrollLeft,
			top: document.body.scrollTop,
			width: viewRegion.visibleWidth,
			height: viewRegion.visibleHeight
		};
		if(rectInLayout(rect, layout_rect)){
			return TRY_DIR_MAP[i];
		}
	}
	return DEFAULT_DIR;
};

/**
 * 根据给定方位，计算出 tip 面板相对于关联节点的左上角的偏移信息
 * @param {Number} dir
 * @param {Number} tipWidth
 * @param {Number} tipHeight
 * @param {Number} relateNodeHeight
 * @param {Number} relateNodeWidth
 * @returns {[Number, Number]} offsetLeft offsetTop
 */
let calcTipPositionByDir = function(dir, tipWidth, tipHeight, relateNodeHeight, relateNodeWidth){
	let offset = {
		11: [-tipWidth * 0.25 + relateNodeWidth / 2, relateNodeHeight],
		0: [-tipWidth * 0.5 + relateNodeWidth / 2, relateNodeHeight],
		1: [-tipWidth * 0.75 + relateNodeWidth / 2, relateNodeHeight],
		2: [-tipWidth, -tipHeight * 0.25 + relateNodeHeight / 2],
		3: [-tipWidth, -tipHeight * 0.5 + relateNodeHeight / 2],
		4: [-tipWidth, -tipHeight * 0.75 + relateNodeHeight / 2],
		5: [-tipWidth * 0.75 + relateNodeWidth / 2, -tipHeight],
		6: [-tipWidth * 0.5 + relateNodeWidth / 2, -tipHeight],
		7: [-tipWidth * 0.25 + relateNodeWidth / 2, -tipHeight],
		8: [relateNodeWidth, -tipHeight * 0.75 + relateNodeHeight / 2],
		9: [relateNodeWidth, -tipHeight * 0.5 + relateNodeHeight / 2],
		10: [relateNodeWidth, -tipHeight * 0.25 + relateNodeHeight / 2]
	};
	return offset[dir];
};

/**
 * @param {Tip} tipObj
 * 更新位置信息
 */
const updatePosition = (tipObj)=>{
	let direction = tipObj.option.direction;
	let tipWidth = tipObj.dom.offsetWidth;
	let tipHeight = tipObj.dom.offsetHeight;
	let relateNodePos = getDomOffset(tipObj.relateNode);
	let rh = tipObj.relateNode.offsetHeight;
	let rw = tipObj.relateNode.offsetWidth;
	if(direction === 'auto'){
		direction = calDir(tipObj);
	}
	tipObj.dom.setAttribute('data-tip-dir',direction);
	let [offsetLeft, offsetTop] = calcTipPositionByDir(direction, tipWidth, tipHeight, rh, rw);
	tipObj.dom.style.left = dimension2Style(relateNodePos.left + offsetLeft);
	tipObj.dom.style.top = dimension2Style(relateNodePos.top + offsetTop);
};

class Tip {
	id = null;
	relateNode = null;

	/** @var {HTMLElement} dom **/
	dom = null;
	option = {
		showCloseButton: true,
		width: 'auto',
		direction: 'auto',
	};

	onShow = new BizEvent(true);
	onHide = new BizEvent(true);
	onDestroy = new BizEvent(true);

	constructor(content, relateNode, opt = {}){
		this.id = guid();
		this.relateNode = relateNode;
		this.option = Object.assign(this.option, opt);

		this.dom = createDomByHtml(
			`<div class="${NS}-container-wrap" style="display:none; ${this.option.width ? 'width:'+dimension2Style(this.option.width) : ''}">
				<s class="${NS}-arrow"></s>
				${this.option.showCloseButton ? `<span class="${NS}-close">&#10005;</span>` : ''}
				<div class="${NS}-content">${content}</div>
			</div>`);
		bindEvent(this);
		TIP_COLLECTION[this.id] = this;
	}

	/**
	 * 设置提示内容
	 * @param {String} html
	 */
	setContent(html){
		this.dom.querySelector(`.${NS}-content`).innerHTML = html;
		updatePosition(this);
	}

	/**
	 * 去重判断，避免onShow时间多次触发
	 */
	show(){
		if(!document.contains(this.dom)){
			document.body.appendChild(this.dom);
		}
		show(this.dom);
		updatePosition(this);
		this.onShow.fire(this);
	}

	hide(){
		hide(this.dom);
		this.onHide.fire(this);
	}

	destroy(){
		this.dom.parentNode.removeChild(this.dom);
		this.onDestroy.fire();
		for(let i in TIP_COLLECTION){
			if(TIP_COLLECTION[i] === this){
				delete(TIP_COLLECTION[i]);
			}
		}
	}

	/**
	 * 快速显示Tip
	 * @param {String} content
	 * @param {HTMLElement} relateNode
	 * @param option
	 * @returns {Tip}
	 */
	static show(content, relateNode, option = {}){
		let tip = new Tip(content, relateNode, option);
		tip.show();
		return tip;
	}

	/**
	 * 隐藏所有Tip
	 */
	static hideAll(){
		for(let i in TIP_COLLECTION){
			TIP_COLLECTION[i].hide();
		}
	}

	/**
	 * 绑定节点
	 * @param {String} content
	 * @param {HTMLElement} relateNode
	 * @param {Object} option
	 * @return {Tip}
	 */
	static bindNode(content, relateNode, option = {triggerType:'hover'}){
		let guid = relateNode.getAttribute(GUID_BIND_KEY);
		let tipObj = TIP_COLLECTION[guid];
		if(!tipObj){
			tipObj = new Tip(content, relateNode, option);
			relateNode.setAttribute(GUID_BIND_KEY, tipObj.id);

			let tm = null;
			let hide = ()=>{
				tm && clearTimeout(tm);
				tm = setTimeout(()=>{
					tipObj.hide();
				}, 10);
			};
			let show = ()=>{
				tm && clearTimeout(tm);
				tipObj.show();
			};
			switch(option.triggerType){
				case 'hover':
					relateNode.addEventListener('mouseover', show);
					relateNode.addEventListener('mouseout', hide);
					tipObj.dom.addEventListener('mouseout', hide);
					tipObj.dom.addEventListener('mouseover', show);
					break;

				case 'click':
					relateNode.addEventListener('click', ()=>{
						let isShow = tipObj.dom.style.display !== 'none';
						!isShow ? show() : hide();
					});
					document.addEventListener('click', e=>{
						if(!domContained(relateNode, e.target, true) && !domContained(tipObj.dom, e.target, true)){
							hide();
						}
					});
					break;
				default:
					throw "option.triggerType no supported:" + option.triggerType;
			}
		}
		return tipObj;
	}

	/**
	 * 通过异步获取数据方式绑定显示Tip
	 * @param {HTMLElement} relateNode
	 * @param {Function} dataFetcher Promise 对象，resolve返回 html 字符串
	 * @param {Object} option
	 */
	static bindAsync(relateNode, dataFetcher, option = {}){
		let guid = relateNode.getAttribute(`data-${GUID_BIND_KEY}`);
		let tipObj = TIP_COLLECTION[guid];
		if(!tipObj){
			let loading = false;
			tipObj = Tip.bindNode('loading...', relateNode, option);
			tipObj.onShow.listen(() => {
				if(loading){
					return;
				}
				loading = true;
				dataFetcher().then(rspHtml => {
					tipObj.setContent(rspHtml);
				}, error => {
					tipObj.setContent(error);
				}).finally(()=>{
					loading = false;
				});
			});
		}
	};
}

/**
 * 提示信息
 * 参数：
 * node[data-tip-content] | node[title] 提示内容，必填
 * node[data-tip-triggertype] 提示方式，缺省为 hover 触发
 */
class ACTip {
	static init(node, option){
		let {content, triggertype = 'hover'} = option;
		return new Promise((resolve, reject) => {
			if(!content && node.title){
				content = node.title;
				node.title = '';
			}
			if(!content){
				reject('content required');
				return;
			}
			Tip.bindNode(content, node, {triggerType:triggertype});
			resolve();
		});
	}
}

const DOMAIN_DEFAULT = 'default';

const trans = (text, domain = DOMAIN_DEFAULT) => {
	return text;
};

/**
 * copy text
 * @param {String} text
 * @param {Boolean} silent 是否在不兼容是进行提醒
 * @returns {boolean} 是否复制成功
 */
const copy = (text, silent = false) => {
	let txtNode = createDomByHtml('<textarea readonly="readonly">', document.body);
	txtNode.style.cssText = 'position:absolute; left:-9999px;';
	let y = window.pageYOffset || document.documentElement.scrollTop;
	txtNode.addEventListener('focus', function(){
		window.scrollTo(0, y);
	});
	txtNode.value = text;
	txtNode.select();
	try{
		let succeeded = document.execCommand('copy');
		!silent && ToastClass.showSuccess(trans('复制成功'));
		return succeeded;
	}catch(err){
		console.error(err);
		DialogClass.prompt('复制失败，请手工复制', {initValue:text});
	} finally{
		txtNode.parentNode.removeChild(txtNode);
	}
	return false;
};

/**
 * Copy formatted html content
 * @param html
 * @param silent
 */
const copyFormatted = (html, silent = false) => {
	// Create container for the HTML
	let container = createDomByHtml(`
		<div style="position:fixed; pointer-events:none; opacity:0;">${html}</div>
	`, document.body);

	// Detect all style sheets of the page
	let activeSheets = Array.prototype.slice.call(document.styleSheets)
		.filter(function(sheet){
			return !sheet.disabled;
		});

	// Copy to clipboard
	window.getSelection().removeAllRanges();

	let range = document.createRange();
	range.selectNode(container);
	window.getSelection().addRange(range);

	document.execCommand('copy');
	for(let i = 0; i < activeSheets.length; i++){
		activeSheets[i].disabled = true;
	}
	document.execCommand('copy');
	for(let i = 0; i < activeSheets.length; i++){
		activeSheets[i].disabled = false;
	}
	document.body.removeChild(container);
	!silent && ToastClass.showSuccess(trans('复制成功'));
};

/**
 * 复制内容
 * 参数：
 * *[data-copy-content]
 * *[data-copy-type] type 为 html 时表示复制内容为HTML
 */
class ACCopy {
	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let content = param.content;
			let type = param.type || 'html';
			if(!content){
				throw "复制内容为空";
			}
			type === 'html' ? copyFormatted(content) : copy(content);
			resolve();
		});
	}
}

/**
 * 对象触发时显示提示信息
 * 参数：
 * node[data-toast-message]
 * node[data-toast-type] type 为 Toast.type 类型
 */
class ACToast {
	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let message = param.message || '提示信息';
			let type = param.type || ToastClass.TYPE_INFO;
			ToastClass.showToast(message, type, ToastClass.DEFAULT_TIME_MAP[type], resolve);
		});
	}
}

const BASE64_KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * base64 解码
 * @param {*} text
 * @returns
 */
const base64Decode = (text) => {
	let t = "";
	let n, r, i;
	let s, o, u, a;
	let f = 0;
	text = text.replace(/\+\+[++^A-Za-z0-9+/=]/g, "");
	while(f < text.length){
		s = BASE64_KEY_STR.indexOf(text.charAt(f++));
		o = BASE64_KEY_STR.indexOf(text.charAt(f++));
		u = BASE64_KEY_STR.indexOf(text.charAt(f++));
		a = BASE64_KEY_STR.indexOf(text.charAt(f++));
		n = s << 2 | o >> 4;
		r = (o & 15) << 4 | u >> 2;
		i = (u & 3) << 6 | a;
		t = t + String.fromCharCode(n);
		if(u !== 64){
			t = t + String.fromCharCode(r);
		}
		if(a !== 64){
			t = t + String.fromCharCode(i);
		}
	}
	t = utf8Decode(t);
	return t
};

/**
 * URL 安全模式进行 base64 编码
 * @param {String} text
 * @return {string}
 */
const base64UrlSafeEncode = (text) => {
	return utf8Encode(text)
		.replace('+', '-')
		.replace('/', '_');
};

/**
 * text 转 base64
 * @param {String} text
 * @return {string}
 * @constructor
 */
const Base64Encode = (text) => {
	let t = "";
	let n, r, i, s, o, u, a;
	let f = 0;
	text = utf8Encode(text);
	while(f < text.length){
		n = text.charCodeAt(f++);
		r = text.charCodeAt(f++);
		i = text.charCodeAt(f++);
		s = n >> 2;
		o = (n & 3) << 4 | r >> 4;
		u = (r & 15) << 2 | i >> 6;
		a = i & 63;
		if(isNaN(r)){
			u = a = 64;
		}else if(isNaN(i)){
			a = 64;
		}
		t = t + BASE64_KEY_STR.charAt(s) + BASE64_KEY_STR.charAt(o) + BASE64_KEY_STR.charAt(u) + BASE64_KEY_STR.charAt(a);
	}
	return t
};

/**
 * 转换blob数据到base64
 * @param {Blob} blob
 * @returns {Promise<unknown>}
 */
const convertBlobToBase64 = async (blob) => {
	return await blobToBase64(blob);
};

/**
 * 转换blob数据到Base64
 * @param {Blob} blob
 * @returns {Promise<unknown>}
 */
const blobToBase64 = blob => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
});

/**
 * 通过 src 加载图片
 * @param {String} src
 * @returns {Promise<HTMLImageElement>}
 */
const loadImgBySrc = (src)=>{
	return new Promise((resolve, reject) => {
		let img = new Image;
		img.onload = ()=>{
			resolve(img);
		};
		img.onabort = ()=>{
			reject('Image loading abort');
		};
		img.onerror = ()=>{
			reject('Image load failure');
		};
		img.src = src;
	});
};

/**
 * 从 img.srcset 属性中解析出最高分辨率突破
 * @param {String} srcset_str
 * @return {string}
 */
const getHighestResFromSrcSet = (srcset_str) => {
	return srcset_str
		.split(",")
		.reduce(
			(acc, item) => {
				let [url, width] = item.trim().split(" ");
				width = parseInt(width);
				if(width > acc.width) return {width, url};
				return acc;
			},
			{width: 0, url: ""}
		).url;
};

/**
 * 通过ImageSrc获取base64（网络请求模式）
 * @param src
 * @returns {Promise<unknown>}
 */
const getBase64BySrc = (src)=>{
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', src, true);
		xhr.responseType = 'blob';
		xhr.onload = function(){
			if(this.status === 200){
				let blob = this.response;
				convertBlobToBase64(blob).then(base64 => {
					resolve(base64);
				}).catch(error => {
					reject(error);
				});
			}
		};
		xhr.onerror = function() {
			reject('Error:'+this.statusText);
		};
		xhr.onabort = function(){
			reject('Request abort');
		};
		xhr.send();
	});
};

/**
 * 通过 Image 获取base64数据
 * @param img
 * @returns {string|string|*|string|null}
 */
const getBase64ByImg = (img) => {
	if(!img.src){
		return null;
	}
	if(img.src.indexOf('data:') === 0){
		return img.src;
	}
	let canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	return canvas.toDataURL("image/png")
};

/**
 * 通过缩放+定位将图片放置在指定容器中间
 * @param {Number} contentWidth
 * @param {Number} contentHeight
 * @param {Number} containerWidth
 * @param {Number} containerHeight
 * @param {Number} spacing
 * @param {Boolean} zoomIn 是否在图片小于容器时放大，默认不放大
 * @returns {{top: number, left: number, width: number, height: number}|{top: number, left: number, width, height}}
 */
const scaleFixCenter$1 = ({
   contentWidth,
   contentHeight,
   containerWidth,
   containerHeight,
   spacing = 0,
   zoomIn = false}) => {
	if(contentWidth <= containerWidth && contentHeight <= containerHeight && !zoomIn){
		return {
			width: contentWidth,
			height: contentHeight,
			left: (containerWidth - contentWidth) / 2,
			top: (containerHeight - contentHeight) / 2
		};
	}
	let ratioX = containerWidth / contentWidth;
	let ratioY = containerHeight / contentHeight;

	let ratio = Math.min(ratioX, ratioY);
	return {
		width: contentWidth * ratio - spacing * 2,
		height: contentHeight * ratio - spacing * 2,
		left: (containerWidth - contentWidth * ratio) / 2 + spacing,
		top: (containerHeight - contentHeight * ratio) / 2 + spacing,
	}
};

/**
 * 获取图像元素平均色彩
 * @param {HTMLImageElement} imgEl
 * @return {{r: number, b: number, g: number}}
 */
const getAverageRGB = (imgEl) => {
	let blockSize = 5, // only visit every 5 pixels
		defaultRGB = {r: 0, g: 0, b: 0}, // for non-supporting envs
		canvas = document.createElement('canvas'),
		context = canvas.getContext && canvas.getContext('2d'),
		data, width, height,
		i = -4,
		length,
		rgb = {r: 0, g: 0, b: 0},
		count = 0;

	if(!context){
		return defaultRGB;
	}

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
	context.drawImage(imgEl, 0, 0);

	try{
		data = context.getImageData(0, 0, width, height);
	}catch(e){
		/* security error, img on diff domain */
		return defaultRGB;
	}

	length = data.data.length;
	while((i += blockSize * 4) < length){
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);
	return rgb;
};

const json_decode = (v) => {
	return v === null ? null : JSON.parse(v);
};

const json_encode = (v) => {
	return JSON.stringify(v);
};

let callbacks = [];
let handler_callbacks = (key, newVal, oldVal)=>{
	callbacks.forEach(cb=>{cb(key, newVal, oldVal);});
};

let ls_listen_flag = false;

/**
 * 基于LocalStorage的设置项存储
 * localStorage中按照 key-value 方式进行存储，value支持数据类型
 */
class LocalStorageSetting {
	namespace = '';
	settingKeys = [];
	constructor(defaultSetting, namespace = ''){
		this.namespace = namespace;
		this.settingKeys = Object.keys(defaultSetting);
		for(let key in defaultSetting){
			let v = this.get(key);
			if(v === null){
				this.set(key, defaultSetting[key]);
			}
		}
	}

	/**
	 * 获取配置
	 * @param {String} key
	 * @return {null|any}
	 */
	get(key){
		let v = localStorage.getItem(this.namespace+key);
		if(v === null){
			return null;
		}
		return json_decode(v);
	}

	/**
	 * 设置配置
	 * @param {String} key
	 * @param {any} value
	 */
	set(key, value){
		handler_callbacks(key, value, this.get(key));
		localStorage.setItem(this.namespace+key, json_encode(value));
	}

	/**
	 * 移除指定配置
	 * @param {String} key
	 */
	remove(key){
		handler_callbacks(key, null, this.get(key));
		localStorage.removeItem(this.namespace+key);
	}

	/**
	 * 配置更新回调（包含配置变更、配置删除）
	 * @param {Function} callback (key, newValue, oldValue)
	 */
	onUpdated(callback){
		callbacks.push(callback);
		if(!ls_listen_flag){
			ls_listen_flag = true;
			window.addEventListener('storage', e => {
				if(!this.namespace || e.key.indexOf(this.namespace) === 0){
					handler_callbacks(e.key.substring(this.namespace.length), json_decode(e.newValue), json_decode(e.oldValue));
				}
			});
		}
	}

	/**
	 * 遍历
	 * @param {Function} payload (key, value)
	 */
	each(payload){
		this.settingKeys.forEach(k=>{
			payload(k, this.get(k));
		});
	}

	/**
	 * 移除所有
	 */
	removeAll(){
		this.settingKeys.forEach(k=>{
			this.remove(k);
		});
	}

	/**
	 * 获取所有
	 * @return {Object} {key:value}
	 */
	getAll(){
		let obj = {};
		this.settingKeys.forEach(k=>{
			obj[k] = this.get(k);
		});
		return obj;
	}
}

let CTX_CLASS_PREFIX = Theme.Namespace + 'context-menu';
let CTX_Z_INDEX = Theme.ContextIndex;
let LAST_MENU_EL = null;

insertStyleSheet(`
	.${CTX_CLASS_PREFIX} {z-index:${CTX_Z_INDEX}; position:fixed;}
	.${CTX_CLASS_PREFIX},
	.${CTX_CLASS_PREFIX} ul {position:absolute; padding: 0.5em 0; list-style:none; backdrop-filter:var(${Theme.CssVar.FULL_SCREEN_BACKDROP_FILTER}); box-shadow:var(${Theme.CssVar.PANEL_SHADOW});border-radius:var(${Theme.CssVar.PANEL_RADIUS});background:var(${Theme.CssVar.BACKGROUND_COLOR});min-width:12em; display:none;}
	.${CTX_CLASS_PREFIX} ul {left:100%; top:0;}
	.${CTX_CLASS_PREFIX} li:not([disabled]):hover>ul {display:block;}
	.${CTX_CLASS_PREFIX} li[role=menuitem] {padding:0 1em; line-height:1; position:relative; min-height:2em; display:flex; align-items:center; background: transparent;user-select:none;opacity: 0.5; cursor:default;}
	.${CTX_CLASS_PREFIX} li[role=menuitem]>* {flex:1; line-height:1}
	.${CTX_CLASS_PREFIX} li[role=menuitem]:not([disabled]) {cursor:pointer; opacity:1;}
	.${CTX_CLASS_PREFIX} li[role=menuitem]:not([disabled]):hover {background-color: #eeeeee9c;text-shadow: 1px 1px 1px white;opacity: 1;}
	.${CTX_CLASS_PREFIX} .has-child:after {content:"\\e73b"; font-family:${Theme.IconFont}; zoom:0.7; position:absolute; right:0.5em; color:var(${Theme.CssVar.DISABLE_COLOR});}
	.${CTX_CLASS_PREFIX} .has-child:not([disabled]):hover:after {color:var(${Theme.CssVar.COLOR})}
	.${CTX_CLASS_PREFIX} .sep {margin:0.25em 0.5em;border-bottom:1px solid #eee;}
	.${CTX_CLASS_PREFIX} .caption {padding-left: 1em;opacity: 0.7;user-select: none;display:flex;align-items: center;}
	.${CTX_CLASS_PREFIX} .caption:after {content:"";flex:1;border-bottom: 1px solid #ccc;margin: 0 0.5em;padding-top: 3px;}
	.${CTX_CLASS_PREFIX} li i {--size:1.2em; display:block; width:var(--size); height:var(--size); max-width:var(--size); margin-right:0.5em;} /** icon **/
	.${CTX_CLASS_PREFIX} li i:before {font-size:var(--size)}
`);

const buildItem = (item) => {
	if(item === '-'){
		return '<li class="sep"></li>';
	}
	return `<li role="menuitem" class="${Array.isArray(item[1]) ? 'has-child':''}" ${item[2] ? 'disabled="disabled"' : ''}>${item[0]}` +
		(Array.isArray(item[1]) ? '<ul>' + item[1].reduce((retVal, subItem, idx) => {
			return retVal + buildItem(subItem);
		}, '') + '</ul>' : '')
		+ `</li>`;
};

/**
 * 显示菜单
 * @param {Array} commands [{title, payload, disabled=false}, {title, [submenus], disabled], '-',...]
 * @param {HTMLElement} container
 */
const showMenu = (commands, container = null) => {
	hideLastMenu();
	let menu = createDomByHtml(`
		<ul class="${CTX_CLASS_PREFIX}">
			${commands.reduce((lastVal, item, idx) => {
				return lastVal + buildItem(item);
			}, '')}
		</ul>`, container || document.body);
	eventDelegate(menu, '[role=menuitem]', 'click', target => {
		let idx = arrayIndex(menu.querySelectorAll('li'), target);
		let [title, cmd, disabled] = commands[idx];
		if(disabled){
			return;
		}
		if(!cmd || cmd() !== false){ //cmd 可以通过返回false阻止菜单关闭
			hideLastMenu();
		}
	});

	menu.addEventListener('contextmenu', e => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	//简单避开全局 click 隐藏当前菜单
	setTimeout(() => {
		LAST_MENU_EL = menu;
	}, 0);
	menu.style.display = 'block';
	return menu;
};

/**
 * 隐藏最后一个菜单
 */
const hideLastMenu = () => {
	if(LAST_MENU_EL){
		LAST_MENU_EL.parentNode.removeChild(LAST_MENU_EL);
		LAST_MENU_EL = null;
	}
};

/**
 * 绑定对象显示定制右键菜单
 * @param {HTMLElement} target
 * @param {Array} commands
 */
const bindTargetContextMenu = (target, commands) => {
	target.addEventListener('contextmenu', e => {
		let context_menu_el = showMenu(commands, document.body);
		let menu_dim = getDomDimension(context_menu_el);
		let dim = keepRectInContainer({
			left: e.clientX,
			top: e.clientY,
			width: menu_dim.width,
			height: menu_dim.height
		});
		context_menu_el.addEventListener('contextmenu', e => {
			e.preventDefault();
			return false;
		});
		context_menu_el.style.left = dimension2Style(dim.left);
		context_menu_el.style.top = dimension2Style(dim.top);
		e.preventDefault();
		return false;
	});
};

document.addEventListener('click', e => {
	if(LAST_MENU_EL && !domContained(LAST_MENU_EL, e.target, true)){
		hideLastMenu();
	}
});
document.addEventListener('keyup', e => {
	if(LAST_MENU_EL && e.keyCode === KEYS.Esc){
		e.stopImmediatePropagation();
		e.preventDefault();
		hideLastMenu();
		return false;
	}
});

const COM_ID$2 = Theme.Namespace + 'com-image-viewer';
const CONTEXT_WINDOW = getContextWindow();
if(!CONTEXT_WINDOW[COM_ID$2]){
	CONTEXT_WINDOW[COM_ID$2] = {};
}

const DOM_CLASS = COM_ID$2;

const DEFAULT_VIEW_PADDING = 20;
const MAX_ZOOM_IN_RATIO = 2; //最大显示比率
const MIN_ZOOM_OUT_SIZE = 50; //最小显示像素

const THUMB_WIDTH = 50;

const ZOOM_IN_RATIO = 0.8; //缩小比率
const ZOOM_OUT_RATIO = 1.2; //放大比率

const ATTR_W_BIND_KEY = 'data-original-width';
const ATTR_H_BIND_KEY = 'data-original-height';

const DISABLED_ATTR_KEY = 'data-disabled';

const GRID_IMG_BG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEXv7+////9mUzfqAAAAFElEQVQIW2NksN/ISAz+f9CBGAwAxtEddZlnB4IAAAAASUVORK5CYII=';

const BASE_INDEX = Theme.FullScreenModeIndex;
const OP_INDEX = BASE_INDEX + 1;
const OPTION_DLG_INDEX = BASE_INDEX + 2;

const IMG_PREVIEW_MODE_SINGLE = 1;
const IMG_PREVIEW_MODE_MULTIPLE = 2;

const IMG_PREVIEW_MS_SCROLL_TYPE_NONE = 0;
const IMG_PREVIEW_MS_SCROLL_TYPE_SCALE = 1;
const IMG_PREVIEW_MS_SCROLL_TYPE_NAV = 2;

let PREVIEW_DOM = null;
let CURRENT_MODE = 0;

//id, title, payload
const CMD_CLOSE = ['close', '关闭', () => {
	destroy();
}];
const CMD_NAV_TO = ['nav_to', '关闭', (target) => {
	navTo(target.getAttribute('data-dir') !== '1');
}];
const CMD_SWITCH_TO = ['switch_to', '关闭', (target) => {
	switchTo(target.getAttribute('data-index'));
}];
const CMD_THUMB_SCROLL_PREV = ['thumb_scroll_prev', '关闭', () => {
	thumbScroll();
}];
const CMD_THUMB_SCROLL_NEXT = ['thumb_scroll_next', '关闭', () => {
	thumbScroll();
}];
const CMD_ZOOM_OUT = ['zoom_out', '放大', () => {
	zoom(ZOOM_OUT_RATIO);
	return false
}];
const CMD_ZOOM_IN = ['zoom_in', '缩小', () => {
	zoom(ZOOM_IN_RATIO);
	return false
}];
const CMD_ZOOM_ORG = ['zoom_org', '原始比例', () => {
	zoom(null);
	return false
}];
const CMD_ROTATE_LEFT = ['rotate_left', '左旋90°', () => {
	rotate(-90);
	return false
}];
const CMD_ROTATE_RIGHT = ['rotate_right', '右旋90°', () => {
	rotate(90);
	return false
}];
const CMD_VIEW_ORG = ['view_org', '查看原图', () => {
	viewOriginal();
}];
const CMD_DOWNLOAD = ['download', '下载图片', () => {
	downloadFile(srcSetResolve(IMG_SRC_LIST[IMG_CURRENT_INDEX]).original);
}];
const CMD_OPTION = ['option', '选项', () => {
	showOptionDialog();
}];

//srcset支持格式请使用 srcSetResolve 进行解析使用，规则如下
// ① src或[src]: 只有一种图源模式；
// ② [src1,src2]，1为缩略图，2为大图、原图；
// ③ [src1,src2,src3] 1为缩略图，2为大图，3为原图
let IMG_SRC_LIST = [/** srcset1, srcset2 **/];
let IMG_CURRENT_INDEX = 0;

const DEFAULT_SETTING = {
	mouse_scroll_type: IMG_PREVIEW_MS_SCROLL_TYPE_NAV,
	allow_move: true,
	show_thumb_list: false,
	show_toolbar: true,
	show_context_menu: true,
};
let LocalSetting = new LocalStorageSetting(DEFAULT_SETTING, Theme.Namespace + 'com-image-viewer/');

/**
 * 解析图片src集合
 * @param {Array|String} srcSet
 * @return {{normal: string, original: string, thumb: string}}
 */
const srcSetResolve = srcSet => {
	srcSet = typeof (srcSet) === 'string' ? [srcSet] : srcSet;
	return {
		thumb: srcSet[0],
		normal: srcSet[1] || srcSet[0],
		original: srcSet[2] || srcSet[1] || srcSet[0]
	};
};

insertStyleSheet(`
	 @keyframes ${Theme.Namespace}spin{
		100%{transform:rotate(360deg);}
	}
	.${DOM_CLASS}{position:fixed;z-index:${BASE_INDEX};width:100%;height:100%;overflow:hidden;top:0;left:0;}
	.${DOM_CLASS} .civ-closer{position:absolute; z-index:${OP_INDEX}; background-color:#cccccc87; color:white; right:20px; top:10px; border-radius:3px; cursor:pointer; font-size:0; line-height:1; padding:5px;}
	.${DOM_CLASS} .civ-closer:before{font-family:"${Theme.IconFont}", serif; content:"\\e61a"; font-size:20px;}
	.${DOM_CLASS} .civ-closer:hover{background-color:#eeeeee75;}
	.${DOM_CLASS} .civ-nav-btn{padding:10px; z-index:${OP_INDEX}; transition:all 0.1s linear; border-radius:3px; opacity:0.8; color:white; background-color:#8d8d8d6e; position:fixed; top:calc(50% - 25px); cursor:pointer;}
	.${DOM_CLASS} .civ-nav-btn[disabled]{color:gray; cursor:default !important;}
	.${DOM_CLASS} .civ-nav-btn:not([disabled]):hover{opacity:1;}
	.${DOM_CLASS} .civ-nav-btn:before{font-family:"${Theme.IconFont}"; font-size:20px;}
	.${DOM_CLASS} .civ-prev{left:10px}
	.${DOM_CLASS} .civ-prev:before{content:"\\e6103"}
	.${DOM_CLASS} .civ-next{right:10px}
	.${DOM_CLASS} .civ-next:before{content:"\\e73b";}

	.${DOM_CLASS} .civ-view-option {position:absolute;display:flex;--opt-btn-size:1.5rem;background-color: #6f6f6f26;backdrop-filter:blur(4px);padding:0.25em 0.5em;left:50%;transform:translate(-50%, 0);z-index:${OP_INDEX};gap: 0.5em;border-radius:4px;}
	.${DOM_CLASS} .civ-opt-btn {cursor:pointer;flex:1;user-select:none;width: var(--opt-btn-size);height: var(--o pt-btn-size);overflow: hidden; color: white;padding: 0.2em;border-radius: 4px;transition: all 0.1s linear;opacity: 0.7;}
	.${DOM_CLASS} .civ-opt-btn:before {font-family:"${Theme.IconFont}";font-size: var(--opt-btn-size);display: block;width: 100%;height: 100%;}
	.${DOM_CLASS} .civ-opt-btn:hover {background-color: #ffffff3b;opacity: 1;}
	
	.${DOM_CLASS}-icon:before {content:""; font-family:"${Theme.IconFont}"; font-style:normal;}
	.${DOM_CLASS}-icon-${CMD_ZOOM_OUT[0]}:before {content: "\\e898";}
	.${DOM_CLASS}-icon-${CMD_ZOOM_IN[0]}:before {content:"\\e683"} 
	.${DOM_CLASS}-icon-${CMD_ZOOM_ORG[0]}:before {content:"\\e64a"} 
	.${DOM_CLASS}-icon-${CMD_ROTATE_LEFT[0]}:before {content:"\\e7be"} 
	.${DOM_CLASS}-icon-${CMD_ROTATE_RIGHT[0]}:before {content:"\\e901"} 
	.${DOM_CLASS}-icon-${CMD_VIEW_ORG[0]}:before {content:"\\e7de"} 
	.${DOM_CLASS}-icon-${CMD_DOWNLOAD[0]}:before {content:"\\e839"} 
	.${DOM_CLASS}-icon-${CMD_OPTION[0]}:before {content:"\\e9cb";}

	.${DOM_CLASS} .civ-nav-wrap{position:absolute;opacity: 0.8;transition:all 0.1s linear;background-color: #ffffff26;bottom:10px;left:50%;transform:translate(-50%, 0);z-index:${OP_INDEX};display: flex;padding: 5px 6px;max-width: calc(100% - 100px);min-width: 100px;border-radius: 5px;backdrop-filter: blur(4px);box-shadow: 1px 1px 30px #6666666b;}
	.${DOM_CLASS} .civ-nav-wrap:hover {opacity:1}
	.${DOM_CLASS} .civ-nav-list-wrap {width: calc(100% - 40px);overflow:hidden;}
	.${DOM_CLASS} .civ-nav-list-prev,
	.${DOM_CLASS} .civ-nav-list-next {flex: 1;width:20px;cursor: pointer;opacity: 0.5;line-height: 48px;transition: all 0.1s linear;}
	.${DOM_CLASS} .civ-nav-list-prev:hover,
	.${DOM_CLASS} .civ-nav-list-next:hover {opacity:1}
	.${DOM_CLASS} .civ-nav-list-prev:before,
	.${DOM_CLASS} .civ-nav-list-next:before{font-family:"${Theme.IconFont}";font-size:18px;}
	.${DOM_CLASS} .civ-nav-list-prev {}
	.${DOM_CLASS} .civ-nav-list-next {right: -20px;}
	.${DOM_CLASS} .civ-nav-list-prev:before{content:"\\e6103"}
	.${DOM_CLASS} .civ-nav-list-next:before{content:"\\e73b";}
	.${DOM_CLASS} .civ-nav-list{height: 50px;}
	.${DOM_CLASS} .civ-nav-thumb{width: 50px;height: 100%;transition:all 0.1s linear;overflow:hidden;display:inline-block;box-sizing:border-box;margin-right: 5px;opacity: 0.6;border: 4px solid transparent;cursor: pointer;}
	.${DOM_CLASS} .civ-nav-thumb.active,
	.${DOM_CLASS} .civ-nav-thumb:hover {border: 3px solid white;opacity: 1;}
	.${DOM_CLASS} .civ-nav-thumb img{width:100%; height:100%; object-fit:cover;}

	.${DOM_CLASS} .civ-ctn{height:100%; width:100%; position:absolute; top:0; left:0;}
	.${DOM_CLASS} .civ-error{margin-top:calc(50% - 60px);}
	.${DOM_CLASS} .civ-loading{--loading-size:50px; position:absolute; left:50%; top:50%; margin:calc(var(--loading-size) / 2) 0 0 calc(var(--loading-size) / 2)}
	.${DOM_CLASS} .civ-loading:before{content:"\\e635"; font-family:"${Theme.IconFont}" !important; animation:${Theme.Namespace}spin 3s infinite linear; font-size:var(--loading-size); color:#ffffff6e; display:block; width:var(--loading-size); height:var(--loading-size); line-height:var(--loading-size)}
	.${DOM_CLASS} .civ-img{height:100%; display:block; box-sizing:border-box; position:relative;}
	.${DOM_CLASS} .civ-img img{position:absolute; left:50%; top:50%; transition:width 0.1s, height 0.1s, transform 0.1s; transform:translate(-50%, -50%); box-shadow:1px 1px 20px #898989; background:url('${GRID_IMG_BG}')}

	.${DOM_CLASS}[data-ip-mode="1"] .civ-nav-btn,
	.${DOM_CLASS}[data-ip-mode="1"] .civ-nav-wrap{display:none;}

	.${DOM_CLASS}-option-list {padding: 1em 2em 2em;display: block;list-style: none;font-size:1rem;}
	.${DOM_CLASS}-option-list>li {margin-bottom: 1em;padding-left: 5em;}
	.${DOM_CLASS}-option-list>li:last-child {margin:0;}
	.${DOM_CLASS}-option-list>li>label:first-child {display:block;float: left;width: 5em;margin-left: -5em;user-select:none;}
	.${DOM_CLASS}-option-list>li>label:not(:first-child) {display:block;user-select:none;margin-bottom: 0.25em;}

	.${DOM_CLASS}-tools-menu {position:fixed;background: white;padding: 5px 0;min-width: 150px;border-radius: 4px;box-shadow: 1px 1px 10px #3e3e3e94;}
	.${DOM_CLASS}-tools-menu>li {padding: 0.45em 1em;}
	.${DOM_CLASS}-tools-menu>li:hover {background: #eee;cursor: pointer;user-select: none;}

	.${DOM_CLASS}[show_thumb_list="false"] .civ-nav-wrap,
	.${DOM_CLASS}[show_toolbar="false"] .civ-view-option {display:none;}
`, Theme.Namespace + 'img-preview-style');

/**
 * 销毁组件
 */
const destroy = () => {
	if(!PREVIEW_DOM){
		return;
	}
	PREVIEW_DOM.parentNode.removeChild(PREVIEW_DOM);
	PREVIEW_DOM = null;
	Masker.hide();
	window.removeEventListener('resize', onWinResize);
	document.removeEventListener('keyup', bindKeyUp);
	document.removeEventListener('keydown', bindKeyDown);
};

/**
 * 更新导航按钮状态
 */
const updateNavState = () => {
	let prev = PREVIEW_DOM.querySelector('.civ-prev');
	let next = PREVIEW_DOM.querySelector('.civ-next');
	let total = IMG_SRC_LIST.length;
	if(IMG_CURRENT_INDEX === 0){
		prev.setAttribute(DISABLED_ATTR_KEY, '1');
	}else {
		prev.removeAttribute(DISABLED_ATTR_KEY);
	}
	if(IMG_CURRENT_INDEX === (total - 1)){
		next.setAttribute(DISABLED_ATTR_KEY, '1');
	}else {
		next.removeAttribute(DISABLED_ATTR_KEY);
	}

	updateThumbNavState();
};

const updateThumbNavState = () => {
	PREVIEW_DOM.querySelectorAll(`.civ-nav-list .civ-nav-thumb`).forEach(item => item.classList.remove('active'));
	PREVIEW_DOM.querySelector(`.civ-nav-list .civ-nav-thumb[data-index="${IMG_CURRENT_INDEX}"]`).classList.add('active');
};

const listenSelector = (parentNode, selector, event, handler) => {
	parentNode.querySelectorAll(selector).forEach(target => {
		target.addEventListener(event, handler);
	});
};

const scaleFixCenter = ({
	                        contentWidth,
	                        contentHeight,
	                        containerWidth,
	                        containerHeight,
	                        spacing = 0,
	                        zoomIn = false
                        }) => {
	if(contentWidth <= containerWidth && contentHeight <= containerHeight && !zoomIn){
		return {
			width: contentWidth,
			height: contentHeight
		};
	}
	let ratioX = containerWidth / contentWidth;
	let ratioY = containerHeight / contentHeight;

	let ratio = Math.min(ratioX, ratioY);
	return {
		width: contentWidth * ratio - spacing * 2,
		height: contentHeight * ratio - spacing * 2
	};
};

/**
 * 绑定图片移动
 * @param {HTMLImageElement} img
 */
const bindImgMove = (img) => {
	let moving = false;
	let lastOffset = {};
	img.addEventListener('mousedown', e => {
		moving = true;
		lastOffset = {
			clientX: e.clientX,
			clientY: e.clientY,
			marginLeft: parseInt(img.style.marginLeft || 0, 10),
			marginTop: parseInt(img.style.marginTop || 0, 10)
		};
		e.preventDefault();
	});
	if(LocalSetting.get('show_context_menu')){
		let context_commands = [];
		CONTEXT_MENU_OPTIONS.forEach(cmdInfo => {
			if(cmdInfo === '-'){
				context_commands.push('-');
			}else {
				let [cmd_id, title, payload] = cmdInfo;
				context_commands.push([`<i class="${DOM_CLASS}-icon ${DOM_CLASS}-icon-${cmd_id}"></i>` + title, payload]);
			}
		});
		bindTargetContextMenu(img, context_commands);
	}

	['mouseup', 'mouseout'].forEach(ev => {
		img.addEventListener(ev, e => {
			moving = false;
		});
	});
	img.addEventListener('mousemove', e => {
		if(moving && LocalSetting.get('allow_move')){
			img.style.marginLeft = dimension2Style(lastOffset.marginLeft + (e.clientX - lastOffset.clientX));
			img.style.marginTop = dimension2Style(lastOffset.marginTop + (e.clientY - lastOffset.clientY));
		}
	});
};

/**
 * 显示图片
 * @param {Number} img_index
 */
const showImgSrc = (img_index = 0) => {
	return new Promise((resolve, reject) => {
		let imgItem = srcSetResolve(IMG_SRC_LIST[img_index]);
		let loading = PREVIEW_DOM.querySelector('.civ-loading');
		let err = PREVIEW_DOM.querySelector('.civ-error');
		let img_ctn = PREVIEW_DOM.querySelector('.civ-img');
		img_ctn.innerHTML = '';
		Masker.show();
		show(loading);
		hide(err);
		loadImgBySrc(imgItem.normal).then(img => {
			setStyle(img, scaleFixCenter({
				contentWidth: img.width,
				contentHeight: img.height,
				containerWidth: img_ctn.offsetWidth,
				containerHeight: img_ctn.offsetHeight,
				spacing: DEFAULT_VIEW_PADDING
			}));
			hide(loading);
			img_ctn.innerHTML = '';
			img.setAttribute(ATTR_W_BIND_KEY, img.width);
			img.setAttribute(ATTR_H_BIND_KEY, img.height);
			bindImgMove(img);
			img_ctn.appendChild(img);
			resolve(img);
		}, error => {
			hide(loading);
			err.innerHTML = `图片加载失败，<a href="${imgItem.normal}" target="_blank">查看详情(${error})</a>`;
			show(err);
			reject(err);
		});
	});
};

const constructDom = () => {
	let nav_thumb_list_html = '';
	if(CURRENT_MODE === IMG_PREVIEW_MODE_MULTIPLE){
		nav_thumb_list_html = `
		<div class="civ-nav-wrap">
			<span class="civ-nav-list-prev" data-cmd="${CMD_THUMB_SCROLL_PREV[0]}"></span>
			<div class="civ-nav-list-wrap">
				<div class="civ-nav-list" style="width:${THUMB_WIDTH * IMG_SRC_LIST.length}px">
				${IMG_SRC_LIST.reduce((preStr, item, idx) => {
			return preStr + `<span class="civ-nav-thumb" data-cmd="${CMD_SWITCH_TO[0]}" data-index="${idx}"><img src="${srcSetResolve(item).thumb}"/></span>`;
		}, "")}
				</div>
			</div>
			<span class="civ-nav-list-next" data-cmd="${CMD_THUMB_SCROLL_NEXT[0]}"></span>
		</div>`;
	}

	let option_html = `
	<span class="civ-view-option">
		${TOOLBAR_OPTIONS.reduce((lastVal, cmdInfo, idx) => {
		return lastVal + `<span class="civ-opt-btn ${DOM_CLASS}-icon ${DOM_CLASS}-icon-${cmdInfo[0]}" data-cmd="${cmdInfo[0]}" title="${cmdInfo[1]}"></span>`;
	}, "")}
	</span>`;

	PREVIEW_DOM = createDomByHtml(`
		<div class="${DOM_CLASS}" data-ip-mode="${CURRENT_MODE}">
			<span class="civ-closer" data-cmd="${CMD_CLOSE[0]}" title="ESC to close">close</span>
			<span class="civ-nav-btn civ-prev" data-cmd="${CMD_NAV_TO[0]}" data-dir="0"></span>
			<span class="civ-nav-btn civ-next" data-cmd="${CMD_NAV_TO[0]}" data-dir="1"></span>
			${option_html}
			${nav_thumb_list_html}
			<div class="civ-ctn">
				<span class="civ-loading"></span>
				<span class="civ-error"></span>
				<span class="civ-img"></span>
			</div>
		</div>
	`, document.body);

	LocalSetting.each((k, v) => {
		PREVIEW_DOM.setAttribute(k, JSON.stringify(v));
	});
	LocalSetting.onUpdated((k, v) => {
		PREVIEW_DOM && PREVIEW_DOM.setAttribute(k, JSON.stringify(v));
	});

	//bind close click & space click
	eventDelegate(PREVIEW_DOM, '[data-cmd]', 'click', target => {
		let cmd = target.getAttribute('data-cmd');
		if(target.getAttribute(DISABLED_ATTR_KEY)){
			return false;
		}
		let cmdInfo = getCmdViaID(cmd);
		if(cmdInfo){
			return cmdInfo[2](target);
		}
		throw "no command found.";
	});

	PREVIEW_DOM.querySelector('.civ-ctn').addEventListener('click', e => {
		if(e.target.tagName !== 'IMG'){
			destroy();
		}
	});

	//bind scroll zoom
	listenSelector(PREVIEW_DOM, '.civ-ctn', 'mousewheel', e => {
		switch(LocalSetting.get('mouse_scroll_type')){
			case IMG_PREVIEW_MS_SCROLL_TYPE_SCALE:
				zoom(e.wheelDelta > 0 ? ZOOM_OUT_RATIO : ZOOM_IN_RATIO);
				break;
			case IMG_PREVIEW_MS_SCROLL_TYPE_NAV:
				navTo(e.wheelDelta > 0);
				break;
		}
		e.preventDefault();
		return false;
	});

	//bind resize
	window.addEventListener('resize', onWinResize);
	document.addEventListener('keydown', bindKeyDown);
	document.addEventListener('keyup', bindKeyUp);
};

const bindKeyUp = (e) => {
	if(e.keyCode === KEYS.Esc){
		destroy();
	}
};

const bindKeyDown = (e) => {
	if(e.keyCode === KEYS.LeftArrow){
		navTo(true);
	}
	if(e.keyCode === KEYS.RightArrow){
		navTo(false);
	}
};

let resize_tm = null;
const onWinResize = () => {
	resize_tm && clearTimeout(resize_tm);
	resize_tm = setTimeout(() => {
		resetView();
	}, 50);
};

/**
 * 重置视图
 */
const resetView = () => {
	let img = PREVIEW_DOM.querySelector('.civ-img img');
	if(!img){
		return;
	}
	let container = PREVIEW_DOM.querySelector('.civ-img');
	setStyle(img, scaleFixCenter({
		contentWidth: img.getAttribute(ATTR_W_BIND_KEY),
		contentHeight: img.getAttribute(ATTR_H_BIND_KEY),
		containerWidth: container.offsetWidth,
		containerHeight: container.offsetHeight,
		spacing: DEFAULT_VIEW_PADDING
	}));
	setStyle(img, {marginLeft: 0, marginTop: 0});
};

/**
 * 图片切换
 * @param {Boolean} toPrev 是否切换到上一张
 * @return {boolean}
 */
const navTo = (toPrev = false) => {
	let total = IMG_SRC_LIST.length;
	if((toPrev && IMG_CURRENT_INDEX === 0) || (!toPrev && IMG_CURRENT_INDEX === (total - 1))){
		return false;
	}
	toPrev ? IMG_CURRENT_INDEX-- : IMG_CURRENT_INDEX++;
	showImgSrc(IMG_CURRENT_INDEX);
	updateNavState();
};

const switchTo = (index) => {
	IMG_CURRENT_INDEX = index;
	showImgSrc(IMG_CURRENT_INDEX);
	updateNavState();
};

const thumbScroll = (toPrev) => {
	PREVIEW_DOM.querySelector('.civ-nav-list');
};

/**
 * 缩放
 * @param {Number} ratioOffset 缩放比率(原尺寸百分比）
 */
const zoom = (ratioOffset) => {
	let img = PREVIEW_DOM.querySelector('.civ-img img');
	let origin_width = img.getAttribute(ATTR_W_BIND_KEY);
	let origin_height = img.getAttribute(ATTR_H_BIND_KEY);

	if(ratioOffset === null){
		ratioOffset = 1;
		img.style.left = dimension2Style(parseInt(img.style.left, 10) * ratioOffset);
		img.style.top = dimension2Style(parseInt(img.style.top, 10) * ratioOffset);
		img.style.width = dimension2Style(parseInt(origin_width, 10) * ratioOffset);
		img.style.height = dimension2Style(parseInt(origin_height, 10) * ratioOffset);
		return;
	}

	let width = parseInt(img.style.width, 10) * ratioOffset;
	let height = parseInt(img.style.height, 10) * ratioOffset;

	//zoom in ratio limited
	if(ratioOffset > 1 && width > origin_width && ((width / origin_width) > MAX_ZOOM_IN_RATIO || (height / origin_height) > MAX_ZOOM_IN_RATIO)){
		console.warn('zoom in limited');
		return;
	}

	//限制任何一边小于最小值
	if(ratioOffset < 1 && width < origin_width && (width < MIN_ZOOM_OUT_SIZE || height < MIN_ZOOM_OUT_SIZE)){
		console.warn('zoom out limited');
		return;
	}

	img.style.left = dimension2Style(parseInt(img.style.left, 10) * ratioOffset);
	img.style.top = dimension2Style(parseInt(img.style.top, 10) * ratioOffset);
	img.style.width = dimension2Style(parseInt(img.style.width, 10) * ratioOffset);
	img.style.height = dimension2Style(parseInt(img.style.height, 10) * ratioOffset);
};

const rotate = (degreeOffset) => {
	let img = PREVIEW_DOM.querySelector('.civ-img img');
	let rotate = parseInt(img.getAttribute('data-rotate') || 0, 10);
	let newRotate = rotate + degreeOffset;
	img.setAttribute('data-rotate', newRotate);
	img.style.transform = `translate(-50%, -50%) rotate(${newRotate}deg)`;
};

const viewOriginal = () => {
	window.open(srcSetResolve(IMG_SRC_LIST[IMG_CURRENT_INDEX]).original);
};

const showOptionDialog = () => {
	let html = `
<ul class="${DOM_CLASS}-option-list">
	<li>
		<label>界面：</label>
		<label>
			<input type="checkbox" name="show_toolbar" value="1">显示顶部操作栏
		</label>
		<label>
			<input type="checkbox" name="show_thumb_list" value="1">显示底部缩略图列表（多图模式）
		</label>
	</li>	
	<li>
		<label>鼠标滚轮：</label>
		<label><input type="radio" name="mouse_scroll_type" value="${IMG_PREVIEW_MS_SCROLL_TYPE_NAV}">切换前一张、后一张图片</label>
		<label><input type="radio" name="mouse_scroll_type" value="${IMG_PREVIEW_MS_SCROLL_TYPE_SCALE}">缩放图片</label>
		<label><input type="radio" name="mouse_scroll_type" value="${IMG_PREVIEW_MS_SCROLL_TYPE_NONE}">无动作</label>
	</li>
	<li>
		<label>移动：</label>
		<label><input type="checkbox" name="allow_move" value="1">允许移动图片</label>
	</li>
</ul>
	`;
	let dlg = DialogClass.show('设置', html, {
		showMasker: false,
		modal: false
	});
	dlg.dom.style.zIndex = OPTION_DLG_INDEX + "";
	dlg.onClose.listen(() => {
		setTimeout(() => {
			if(PREVIEW_DOM){
				Masker.show();
			}
		}, 0);
	});
	let lsSetterTip = null;
	formSync(dlg.dom, (name) => {
		return new Promise((resolve, reject) => {
			let tmp = convertObjectToFormData({[name]: LocalSetting.get(name)});
			resolve(tmp[name]);
		});
	}, (name, value) => {
		return new Promise((resolve, reject) => {
			let obj = convertFormDataToObject({[name]: value}, DEFAULT_SETTING);
			LocalSetting.set(name, obj[name]);
			lsSetterTip && lsSetterTip.hide();
			lsSetterTip = ToastClass.showSuccess('设置已保存');
			resolve();
		});
	});
};

const ALL_COMMANDS = [
	CMD_CLOSE,
	CMD_NAV_TO,
	CMD_SWITCH_TO,
	CMD_THUMB_SCROLL_PREV,
	CMD_THUMB_SCROLL_NEXT,
	CMD_ZOOM_OUT,
	CMD_ZOOM_IN,
	CMD_ZOOM_ORG,
	CMD_ROTATE_LEFT,
	CMD_ROTATE_RIGHT,
	CMD_VIEW_ORG,
	CMD_DOWNLOAD,
	CMD_OPTION,
];

const TOOLBAR_OPTIONS = [
	CMD_ZOOM_OUT,
	CMD_ZOOM_IN,
	CMD_ZOOM_ORG,
	CMD_ROTATE_LEFT,
	CMD_ROTATE_RIGHT,
	CMD_VIEW_ORG,
	CMD_DOWNLOAD,
	CMD_OPTION
];

const CONTEXT_MENU_OPTIONS = [
	CMD_ZOOM_OUT,
	CMD_ZOOM_IN,
	CMD_ZOOM_ORG,
	'-',
	CMD_ROTATE_LEFT,
	CMD_ROTATE_RIGHT,
	'-',
	CMD_VIEW_ORG,
	CMD_DOWNLOAD,
	'-',
	CMD_OPTION
];

/**
 * 获取命令信息
 * @param {String} id
 * @return {null|Object}
 */
const getCmdViaID = (id) => {
	for(let k in ALL_COMMANDS){
		let [_id] = ALL_COMMANDS[k];
		if(id === _id){
			return ALL_COMMANDS[k];
		}
	}
	return null;
};


/**
 * 初始化
 * @param {Object} option
 * @param {Number} option.mode 显示模式：IMG_PREVIEW_MODE_SINGLE 单图模式，IMG_PREVIEW_MODE_MULTIPLE 多图模式
 * @param {String[]} option.srcList 图片列表，单图或者多图模式都需要以数组方式传参
 * @param {Boolean} option.showToolbar 是否显示选项条（缺省使用默认配置）
 * @param {Boolean} option.showThumbList [多图模式]是否显示缩略图列表（缺省使用默认配置）
 * @param {Number|0} option.mouse_scroll_type 鼠标滚动控制类型：IMG_PREVIEW_MS_SCROLL_TYPE_NONE，IMG_PREVIEW_MS_SCROLL_TYPE_SCALE，IMG_PREVIEW_MS_SCROLL_TYPE_NAV（缺省使用默认配置）
 * @param {Number|0} option.startIndex [多图模式]开始图片索引
 * @param {Boolean} option.preloadSrcList [多图模式]是否预加载列表
 */
const init = ({
	              mode,
	              srcList,
	              mouse_scroll_type = IMG_PREVIEW_MS_SCROLL_TYPE_NAV,
	              startIndex = 0,
	              showContextMenu = null,
	              showToolbar = null,
	              showThumbList = null,
	              preloadSrcList = null,
              }) => {
	destroy();
	CURRENT_MODE = mode;
	IMG_SRC_LIST = srcList;
	IMG_CURRENT_INDEX = startIndex;

	mouse_scroll_type !== null && LocalSetting.set('mouse_scroll_type', mouse_scroll_type);
	showThumbList !== null && LocalSetting.set('show_thumb_list', showThumbList);
	showToolbar !== null && LocalSetting.set('show_toolbar', showToolbar);
	showContextMenu !== null && LocalSetting.set('show_context_menu', showContextMenu);

	constructDom();
	showImgSrc(IMG_CURRENT_INDEX).finally(() => {
		if(preloadSrcList){
			srcList.forEach(src => {
				new Image().src = src;
			});
		}
	});
	if(mode === IMG_PREVIEW_MODE_MULTIPLE){
		updateNavState();
	}
};

/**
 * 显示单张图片预览
 * @param {String} imgSrc
 * @param {Object} option
 */
const showImgPreview = CONTEXT_WINDOW[COM_ID$2]['showImgPreview'] || function(imgSrc, option = {}){
	init({mode: IMG_PREVIEW_MODE_SINGLE, srcList: [imgSrc], ...option});
};

/**
 * 显示多图预览
 * @param {String[]} imgSrcList
 * @param {Number} startIndex
 * @param {Object} option
 */
const showImgListPreview = CONTEXT_WINDOW[COM_ID$2]['showImgListPreview'] || function(imgSrcList, startIndex = 0, option = {}){
	init({mode: IMG_PREVIEW_MODE_MULTIPLE, srcList: imgSrcList, startIndex, ...option});
};

/**
 * 通过绑定节点显示图片预览
 * @param {String} nodeSelector 触发绑定的节点选择器，可以是img本身节点，也可以是其他代理节点
 * @param {String} triggerEvent
 * @param {String|Function} srcFetcher 获取大图src的选择器，或者函数，如果是函数传入第一个参数为触发节点
 * @param {Object} option
 */
const bindImgPreviewViaSelector = (nodeSelector = 'img', triggerEvent = 'click', srcFetcher = 'src', option = {}) => {
	let nodes = document.querySelectorAll(nodeSelector);
	let imgSrcList = [];
	if(!nodes.length){
		console.warn('no images found');
		return;
	}
	Array.from(nodes).forEach((node, idx) => {
		switch(typeof (srcFetcher)){
			case 'function':
				imgSrcList.push(srcFetcher(node));
				break;
			case 'string':
				imgSrcList.push(node.getAttribute(srcFetcher));
				break;
			default:
				throw "No support srcFetcher types:" + typeof (srcFetcher);
		}
		node.addEventListener(triggerEvent, e => {
			if(nodes.length > 1){
				showImgListPreview(imgSrcList, idx, option);
			}else {
				showImgPreview(imgSrcList[0], option);
			}
		});
	});
};

window[COM_ID$2] = {
	showImgPreview,
	showImgListPreview,
	bindImgPreviewViaSelector,
};

let showImgPreviewFn = CONTEXT_WINDOW[COM_ID$2]['showImgPreview'] || showImgPreview;
let showImgListPreviewFn = CONTEXT_WINDOW[COM_ID$2]['showImgListPreview'] || showImgListPreview;

const resolveSrc = (node) => {
	let src = node.dataset.src;
	//src获取优先级：param.src > img[data-src] > img[srcset] > img[src]
	if(node.tagName === 'IMG'){
		if(!src && node.srcset){
			src = getHighestResFromSrcSet(node.srcset) || node.src;
		}
	}else if(!src && node.tagName === 'A'){
		src = node.href;
	}
	return src;
};

/**
 * 图片预览
 */
class ACPreview {
	static active(node, param = {}){
		return new Promise((resolve, reject) => {
			let src = param.src || resolveSrc(node);
			let selector = param.selector;
			if(!src){
				console.warn('image preview src empty', node);
				return;
			}
			if(selector){
				let index = 0, imgSrcList = [];
				document.querySelectorAll(selector).forEach((n, idx) => {
					if(node === n){
						index = idx;
					}
					imgSrcList.push(resolveSrc(n));
				});
				showImgListPreviewFn(imgSrcList, index);
			}else {
				showImgPreviewFn(src);
			}
			resolve();
		});
	}
}

const COM_ID$1 = Theme.Namespace + 'select';
const CLASS_PREFIX$1 = COM_ID$1;

insertStyleSheet(`
	.${CLASS_PREFIX$1}-panel{
		${Theme.CssVarPrefix}sel-panel-max-width:20em;
		${Theme.CssVarPrefix}sel-list-max-height:15em;
		${Theme.CssVarPrefix}sel-item-matched-color:orange;
		${Theme.CssVarPrefix}sel-item-matched-font-weight:bold;
		${Theme.CssVarPrefix}sel-item-hover-bg:#eeeeee;
		${Theme.CssVarPrefix}sel-item-selected-bg:#abc9e140;
		
		max-width:var(${Theme.CssVarPrefix}sel-panel-max-width);
		background-color:var(${Theme.CssVar.BACKGROUND_COLOR});
		border:var(${Theme.CssVar.PANEL_BORDER});
		padding:.2em 0;
		box-sizing:border-box;
		box-shadow:var(${Theme.CssVar.PANEL_SHADOW});
		border-radius:var(${Theme.CssVar.PANEL_RADIUS});
		position:absolute;
		z-index:1;
	}
	
	.${CLASS_PREFIX$1}-panel .${CLASS_PREFIX$1}-search{padding:0.5em;}
	.${CLASS_PREFIX$1}-panel input[type=search]{
		width:100%;
		padding:0.5em;
		border:none;
		border-bottom:1px solid #dddddd;
		outline:none;
		box-shadow:none;
		transition:border 0.1s linear;
	}
	.${CLASS_PREFIX$1}-panel input[type=search]:focus{
		border-color:gray;
	}
	
	.${CLASS_PREFIX$1}-list{
		list-style:none;
		max-height:var(${Theme.CssVarPrefix}sel-list-max-height);
		overflow:auto;
	}
	
	.${CLASS_PREFIX$1}-list .sel-item{
		margin:1px 0;
	}
	
	.${CLASS_PREFIX$1}-list .sel-chk{
		opacity:0;
		width:1em;
		height:1em;
		position:absolute;
		margin:0.05em 0 0 -1.25em;
	}
	
	.${CLASS_PREFIX$1}-list .sel-chk:before{
		content:"\\e624";
		font-family:"${Theme.IconFont}", serif;
	}
	
	.${CLASS_PREFIX$1}-list .matched{
		color:var(${Theme.CssVarPrefix}sel-item-matched-color);
		font-weight:var(${Theme.CssVarPrefix}sel-item-matched-font-weight);
	}
	
	.${CLASS_PREFIX$1}-list input{display:block;position:absolute;z-index:1;left:-2em;top:0;opacity:0;}
	.${CLASS_PREFIX$1}-list .ti-wrap{cursor:pointer;position:relative;display:block;padding:.35em .5em .35em 2em;user-select:none;transition:all 0.1s linear;}
	.${CLASS_PREFIX$1}-list ul .ti-wrap{padding-left:2.25em;display:block; padding-left:3.5em;}
	
	.${CLASS_PREFIX$1}-list label{
		display:block;
		overflow:hidden;
		position:relative;
	}
	.${CLASS_PREFIX$1}-list label:hover .ti-wrap{
		background:var(${Theme.CssVarPrefix}sel-item-hover-bg);
		text-shadow:1px 1px 1px white;
	}
	
	.${CLASS_PREFIX$1}-list li[data-group-title]:before{
		content:attr(data-group-title) " -";
		color:gray;
		display:block;
		padding:0.25em .5em .25em 2em;
	}
	
	/** checked **/
	.${CLASS_PREFIX$1}-list input:checked ~ .ti-wrap{
		background-color:var(${Theme.CssVarPrefix}sel-item-selected-bg);
	}
	
	.${CLASS_PREFIX$1}-list input:checked ~ .ti-wrap .sel-chk{
		opacity:1;
	}
	
	/** disabled **/
	.${CLASS_PREFIX$1}-list input:disabled ~ .ti-wrap{
		opacity:0.5;
		cursor:default;
		background-color:transparent
	}
	.${CLASS_PREFIX$1}-list input:disabled ~ .ti-wrap .sel-chk{
		opacity:.1;
	}
`, COM_ID$1 + '-style');

/**
 * @param sel
 * @return {{values: String[], options: Option[], selectedIndexes: Number[]}}
 */
const resolveSelectOptions = (sel) => {
	let options = [
		// {title, value, disabled, selected},
		// {title, options:[{title, value},...], disabled, selected},
	];
	let values = [];
	let selectedIndexes = [];
	sel.childNodes.forEach(node => {
		if(node.nodeType !== 1){
			return;
		}
		if(node.tagName === 'OPTION'){
			options.push(new Option({
				title: node.innerText,
				value: node.value,
				disabled: node.disabled,
				selected: node.selected,
				index: node.index,
			}));
			if(node.selected){
				values.push(node.value);
				selectedIndexes.push(node.index);
			}
		}else if(node.tagName === 'OPTGROUP'){
			let opt_group = new Option({title: node.label});
			node.childNodes.forEach(child => {
				if(child.nodeType !== 1){
					return;
				}
				opt_group.options.push(new Option({
					title: child.innerText,
					value: child.value,
					disabled: child.disabled,
					selected: child.selected,
					index: child.index,
				}));
				if(child.selected){
					values.push(child.value);
					selectedIndexes.push(child.index);
				}
			});
			options.push(opt_group);
		}
	});
	return {options, values, selectedIndexes};
};

/**
 * 从 <datalist> 对象中解析 option 列表
 * @param {HTMLDataListElement} datalistEl
 * @param {Null|String} initValue 初始值，Null 表示没有初始值
 * @return {Option[]}
 */
const resolveListOption = (datalistEl, initValue = null) => {
	let options = [];
	Array.from(datalistEl.options).forEach((option, index) => {
		let title = option.innerText;
		let value = option.hasAttribute('value') ? option.getAttribute('value') : option.innerText;
		let selected = initValue !== null && value === initValue;
		options.push({title, value, disabled: false, selected, index});
	});
	return options;
};

/**
 * 渲染单个 checkbox 或 radio
 * @param name
 * @param multiple
 * @param option
 * @return {String} input html
 */
const renderItemChecker = (name, multiple, option) => {
	return `<input type="${multiple ? 'checkbox' : 'radio'}" 
		tabindex="-1"
		name="${name}" 
		value="${escapeAttr(option.value)}" 
		${option.selected ? 'checked' : ''} 
		${option.disabled ? 'disabled' : ''}/>
	`
};

/**
 * 创建面板 DOM
 * @param config
 * @return {HTMLElement|HTMLElement[]}
 */
const createPanel = (config) => {
	let list_html = `<ul class="${CLASS_PREFIX$1}-list">`;
	config.options.forEach(option => {
		if(option.options && option.options.length){
			list_html += `<li data-group-title="${escapeAttr(option.title)}" class="sel-group"><ul>`;
			option.options.forEach(childOption => {
				list_html += `<li class="sel-item" tabindex="0">
									<label title="${escapeAttr(childOption.title)}" tabindex="0">
										${renderItemChecker(config.name, config.multiple, childOption)} 
										<span class="ti-wrap">
											<span class="sel-chk"></span> 
											<span class="ti">${escapeHtml(childOption.title)}</span>
										</span>
									</label>
								</li>`;
			});
			list_html += `</ul></li>`;
		}else {
			list_html += `<li class="sel-item" tabindex="0">
							<label title="${escapeAttr(option.title)}">
								${renderItemChecker(config.name, config.multiple, option)} 
								<span class="ti-wrap">
									<span class="sel-chk"></span> 
									<span class="ti">${escapeHtml(option.title)}</span>
								</span>
							</label>
						</li>`;
		}
	});
	list_html += '</ul>';
	return createDomByHtml(`
		<div class="${CLASS_PREFIX$1}-panel" style="display:none;">
			<div class="${CLASS_PREFIX$1}-search" style="${config.displaySearchInput ? '' : 'display:none'}">
				<input type="search" placeholder="过滤..." aria-label="过滤选项">
			</div>
			${list_html}
		</div>
	`, document.body);
};

const tabNav = (liList, dir) => {
	let currentIndex = -1;
	liList.forEach((li, idx) => {
		if(li === document.activeElement){
			currentIndex = idx;
		}
	});
	if(dir > 0){
		currentIndex = currentIndex < (liList.length - 1) ? (currentIndex + 1) : 0;
	}else {
		currentIndex = currentIndex <= 0 ? (liList.length - 1) : (currentIndex - 1);
	}
	liList.forEach((li, idx) => {
		if(idx === currentIndex){
			li.focus();
		}
	});
};

class Option {
	constructor(param){
		for(let i in param){
			this[i] = param[i];
		}
	}

	/** @type {string} */
	title = '';

	/** @type {string} */
	value = '';

	/** @type {Boolean} */
	disabled = false;

	/** @type {Boolean} */
	selected = false;

	/** @type {Number} */
	index = 0;

	/** @type {Option[]} */
	options = [];
}

class Select {
	config = {
		name: "",
		required: false,
		multiple: false,
		placeholder: '',

		displaySearchInput: true, //是否显示搜索输入框
		hideNoMatchItems: true, //隐藏未匹配的搜索结果项目

		/** @type {Option[]} options */
		options: []
	};
	panelEl = null;
	searchEl = null;
	onChange = new BizEvent();

	constructor(config){
		this.config = Object.assign(this.config, config);
		this.config.name = this.config.name || COM_ID$1 + guid();
		this.panelEl = createPanel(this.config);
		this.searchEl = this.panelEl.querySelector('input[type=search]');

		//checkbox change
		this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list input`).forEach(chk => {
			chk.addEventListener('change', () => {
				this.onChange.fire();
			});
		});

		//search
		this.searchEl.addEventListener('input', () => {
			this.search(this.searchEl.value);
		});

		//nav
		this.searchEl.addEventListener('keydown', e => {
			if(e.keyCode === KEYS.UpArrow){
				tabNav(liElList, false);
			}else if(e.keyCode === KEYS.DownArrow){
				tabNav(liElList, true);
			}
		});

		//li click, enter
		let liElList = this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list .sel-item`);
		liElList.forEach(li => {
			buttonActiveBind(li, e => {
				if(e.type !== 'click'){
					let chk = li.querySelector('input');
					chk.checked ? chk.removeAttribute('checked') : chk.checked = true;
					this.onChange.fire();
				}
				!this.config.multiple && this.hidePanel();
			});
			li.addEventListener('keydown', e => {
				if(e.keyCode === KEYS.UpArrow){
					tabNav(liElList, false);
				}else if(e.keyCode === KEYS.DownArrow){
					tabNav(liElList, true);
				}
			});
		});
	}

	isShown(){
		return this.panelEl.style.display !== 'none';
	}

	search(kw){
		this.searchEl.value = kw;
		let liEls = this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list .sel-item`);
		let firstMatchedItem = null;
		liEls.forEach(li => {
			this.config.hideNoMatchItems && hide(li);
			let title = li.querySelector('label').title;
			li.blur();
			li.querySelector('.ti').innerHTML = highlightText(title, kw);
			if(!kw || title.toLowerCase().indexOf(kw.trim().toLowerCase()) >= 0){
				this.config.hideNoMatchItems && show(li);
				if(!firstMatchedItem){
					firstMatchedItem = li;
				}
			}
		});
		if(firstMatchedItem){
			firstMatchedItem.scrollIntoView({behavior: 'smooth'});
		}
	}

	/**
	 * 以index方式设置选中项
	 * @param {Number[]} selectedIndexList
	 */
	selectByIndex(selectedIndexList){
		this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list input`).forEach((chk, idx) => {
			chk.checked = selectedIndexList.includes(idx);
		});
	}

	/**
	 * 使用传值方式设置选中项目（该方法可能存在多个相同值的情况导致误选）
	 * @param values
	 */
	selectByValues(values){
		this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list input`).forEach((chk, idx) => {
			chk.checked = values.includes(chk.value);
		});
	}

	/**
	 * 获取值，这里没有区分多选还是单选，统一返回数组，返回值会去重
	 * @return {String[]}
	 */
	getValues(){
		let values = [];
		let tmp = this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list input:checked`);
		tmp.forEach(chk => {
			values.push(chk.value);
		});
		values = arrayDistinct(values);
		return values;
	}

	/**
	 * 获取选中项索引值列表
	 * @return {Number[]}
	 */
	getSelectedIndexes(){
		let selectedIndexes = [];
		this.panelEl.querySelectorAll(`.${CLASS_PREFIX$1}-list input`).forEach((chk, idx) => {
			if(chk.checked){
				selectedIndexes.push(idx);
			}
		});
		return selectedIndexes;
	}

	hidePanel(){
		if(this.panelEl){
			this.panelEl.style.display = 'none';
			this.search("");
		}
	}

	/**
	 * @param {Object|Null} pos
	 * @param {Number} pos.top
	 * @param {Number} pos.left
	 */
	showPanel(pos = {top: 0, left: 0}){
		this.panelEl.style.display = '';
		if(pos){
			this.panelEl.style.top = dimension2Style(pos.top);
			this.panelEl.style.left = dimension2Style(pos.left);
		}
		this.searchEl.focus();
	}

	/**
	 * @param {HTMLSelectElement} selectEl
	 */
	static bindSelect(selectEl){
		let {options} = resolveSelectOptions(selectEl);
		let sel = new Select({
			name: selectEl.name,
			required: selectEl.required,
			multiple: selectEl.multiple,
			placeholder: selectEl.getAttribute('placeholder'),
			options
		});
		sel.onChange.listen(() => {
			let selectedIndexes = sel.getSelectedIndexes();
			selectEl.querySelectorAll('option').forEach((opt, idx) => {
				opt.selected = selectedIndexes.includes(idx);
			});
			triggerDomEvent(selectEl, 'change');
		});
		sel.panelEl.style.minWidth = dimension2Style(selectEl.offsetWidth);

		let sh = () => {
			let offset = getDomOffset(selectEl);
			sel.showPanel({top: offset.top + selectEl.offsetHeight, left: offset.left});
		};

		selectEl.addEventListener('keydown', e => {
			sh();
			e.preventDefault();
			e.stopPropagation();
			return false;
		});

		selectEl.addEventListener('mousedown', e => {
			sel.isShown() ? sel.hidePanel() : sh();
			e.preventDefault();
			e.stopPropagation();
			return false;
		});

		selectEl.addEventListener('focus', sh);
		selectEl.addEventListener('change', () => {
			let selectedIndexes = [];
			Array.from(selectEl.selectedOptions).forEach(opt => {
				selectedIndexes.push(opt.index);
			});
			sel.selectByIndex(selectedIndexes);
		});

		document.addEventListener('click', e => {
			if(!domContained(sel.panelEl, e.target, true) && !domContained(selectEl, e.target, true)){
				sel.hidePanel();
			}
		});

		document.addEventListener('keyup', e => {
			if(e.keyCode === KEYS.Esc){
				sel.hidePanel();
			}
		});
	}

	/**
	 * 绑定有关联 datalist 的输入框
	 * @param {HTMLInputElement} inputEl
	 * @param {Option[]} options 是否指定选项列表，默认从 input[list] 中读取
	 */
	static bindTextInput(inputEl, options = null){
		if(!options){
			let listTagId = inputEl.getAttribute('list');
			let datalistEl = document.getElementById(listTagId);
			if(!datalistEl){
				throw "no datalist found: " + inputEl.getAttribute('list');
			}
			options = resolveListOption(datalistEl, inputEl.value);
			inputEl.removeAttribute('list');
			datalistEl.parentNode.removeChild(datalistEl);
		}
		let sel = new Select({
			name: inputEl.name,
			required: inputEl.required,
			multiple: false,
			displaySearchInput: false,
			hideNoMatchItems: false,
			placeholder: inputEl.getAttribute('placeholder'),
			options
		});
		sel.onChange.listen(() => {
			inputEl.value = sel.getValues()[0];
			triggerDomEvent(inputEl, 'change');
		});
		sel.panelEl.style.minWidth = dimension2Style(inputEl.offsetWidth);

		let sh = () => {
			let offset = getDomOffset(inputEl);
			sel.showPanel({top: offset.top + inputEl.offsetHeight, left: offset.left});
		};

		inputEl.addEventListener('focus', sh);
		inputEl.addEventListener('click', sh);
		inputEl.addEventListener('input', () => {
			sel.search(inputEl.value.trim());
		});

		document.addEventListener('click', e => {
			if(!domContained(sel.panelEl, e.target, true) && !domContained(inputEl, e.target, true)){
				sel.hidePanel();
			}
		});

		document.addEventListener('keyup', e => {
			if(e.keyCode === KEYS.Esc){
				sel.hidePanel();
			}
		});
	}
}

/**
 * 将 select 或者 input[list] 对象绑定使用 Select UI组件
 * 参数：
 * select
 * input[list]
 */
class ACSelect {
	static init(node){
		return new Promise((resolve, reject) => {
			if(node.tagName === 'SELECT'){
				Select.bindSelect(node);
				resolve();
				return;
			}
			if(node.tagName === 'INPUT' && node.list){
				Select.bindTextInput(node);
				resolve();
				return;
			}

			reject('node type no support');
		});
	}
}

const DEFAULT_ATTR_COM_FLAG = 'data-component'; //data-component="com1,com2"
const COMPONENT_BIND_FLAG_KEY = 'component-init-bind';

let AC_COMPONENT_MAP = {
	async: ACAsync,
	dialog: ACDialog,
	confirm: ACConfirm,
	preview: ACPreview,
	copy: ACCopy,
	select: ACSelect,
	tip: ACTip,
	toast: ACToast,
};

const parseComponents = function(attr){
	let tmp = attr.split(',');
	let cs = [];
	tmp.forEach(v => {
		v = v.trim();
		if(v){
			cs.push(v);
		}
	});
	return cs;
};

/**
 * 从节点中解析出使用 data-key- 为前缀的属性
 * @param node
 * @param key
 * @return {{}}
 */
const resolveDataParam = (node, key) => {
	let param = {};
	Array.from(node.attributes).forEach(attr => {
		if(attr.name.indexOf('data-' + key + '-') >= 0){
			let objKeyPath = attr.name.substring(('data-' + key).length + 1);
			objectPushByPath(objKeyPath, attr.value, param);
		}
	});
	return param;
};

const bindNode = function(container = document, attr_flag = DEFAULT_ATTR_COM_FLAG){
	container.querySelectorAll(`:not([${COMPONENT_BIND_FLAG_KEY}])[${attr_flag}]`).forEach(node => {
		node.setAttribute(COMPONENT_BIND_FLAG_KEY, "1");
		let cs = parseComponents(node.getAttribute(attr_flag));
		let activeStacks = [];
		cs.forEach(com => {
			let C = AC_COMPONENT_MAP[com];
			if(!C){
				console.warn('component no found', com);
				return false;
			}
			let data = resolveDataParam(node, com);
			console.info('com detected:', com);
			if(C.init){
				C.init(node, data);
			}
			if(C.active){
				activeStacks.push(()=>{
					return C.active(node, resolveDataParam(node, com)); //点击时实时解析参数
				});
			}
			return true;
		});
		if(activeStacks.length){
			bindActiveChain(node, activeStacks);
		}
	});
};

const TEXT_TYPES = ['text', 'number', 'password', 'search', 'address', 'date', 'datetime', 'time', 'checkbox', 'radio'];

/**
 * 是否为可输入元素
 * @param {HTMLFormElement} node
 * @return {boolean}
 */
const isInputAble = (node) => {
	if(node.disabled || node.readonly){
		return false;
	}
	return node.tagName === 'TEXTAREA' ||
		(node.tagName === 'INPUT' && (!node.type || TEXT_TYPES.includes(node.type.toLowerCase())));
};

/**
 * 绑定节点触发事件，不同节点触发行为定义不同
 * @param {HTMLElement} node
 * @param {Function[]} activeStacks 链式调用列表
 */
const bindActiveChain = (node, activeStacks) => {
	let event = 'click';
	if(isInputAble(node)){
		event = 'keyup';
	}else if(node.tagName === 'FORM'){
		event = 'submit';
	}else {
		event = 'click';
	}
	node.addEventListener(event, e => {
		let func = activeStacks[0];
		let pro = func();
		for(let i = 1; i < activeStacks.length; i++){
			pro = pro.then(() => {
				return activeStacks[i]();
			}, () => {
			});
		}
		e.preventDefault();
		return false;
	});
};

const ACComponent = {
	/**
	 * 监听组件
	 * @param {Node} container
	 * @param {String} attr_flag 绑定属性格式，缺省为 data-component形式
	 */
	watch: (container = document, attr_flag = DEFAULT_ATTR_COM_FLAG) => {
		let m_tm = null;
		let observer = new MutationObserver(mutations => {
			clearTimeout(m_tm);
			m_tm = setTimeout(function(){
				bindNode(container, attr_flag);
			}, 0);
		});
		observer.observe(container, {childList: true, subtree: true});
		bindNode(container, attr_flag);
	},

	/**
	 * 注册组件
	 * @param {String}  componentName
	 * @param {Object} define
	 * @param {Function} define.init 节点初始化函数
	 * @param {Function} define.active 节点交互函数（交互行为包括：表单提交、链接点击、按钮点击、输入框回车提交等）
	 */
	register: (componentName, define) => {
		AC_COMPONENT_MAP[componentName] = define;
	},

	/**
	 * 取消注册组件
	 * @param {String} componentName
	 */
	unRegister: (componentName) => {
		delete (AC_COMPONENT_MAP[componentName]);
	}
};

/**
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
const safeAdd = (x, y) => {
	let lsw = (x & 0xffff) + (y & 0xffff);
	let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xffff)
};

/**
* Bitwise rotate a 32-bit number to the left.
*/
const bitRotateLeft = (num, cnt) => {
	return (num << cnt) | (num >>> (32 - cnt))
};

/**
* These functions implement the four basic operations the algorithm uses.
*/
const md5cmn = (q, a, b, x, s, t) => {
	return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
};

const md5ff = (a, b, c, d, x, s, t) => {
	return md5cmn((b & c) | (~b & d), a, b, x, s, t)
};

const md5gg = (a, b, c, d, x, s, t) => {
	return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
};

const md5hh = (a, b, c, d, x, s, t) => {
	return md5cmn(b ^ c ^ d, a, b, x, s, t)
};

const md5ii = (a, b, c, d, x, s, t) => {
	return md5cmn(c ^ (b | ~d), a, b, x, s, t)
};

/**
* Calculate the MD5 of an array of little-endian words, and a bit length.
*/
const binlMD5 = (x, len) => {
	/* append padding */
	x[len >> 5] |= 0x80 << (len % 32);
	x[((len + 64) >>> 9 << 4) + 14] = len;

	let i;
	let olda;
	let oldb;
	let oldc;
	let oldd;
	let a = 1732584193;
	let b = -271733879;
	let c = -1732584194;
	let d = 271733878;

	for(i = 0; i < x.length; i += 16){
		olda = a;
		oldb = b;
		oldc = c;
		oldd = d;

		a = md5ff(a, b, c, d, x[i], 7, -680876936);
		d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
		b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

		a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = md5gg(b, c, d, a, x[i], 20, -373897302);
		a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

		a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
		d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = md5hh(d, a, b, c, x[i], 11, -358537222);
		c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

		a = md5ii(a, b, c, d, x[i], 6, -198630844);
		d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

		a = safeAdd(a, olda);
		b = safeAdd(b, oldb);
		c = safeAdd(c, oldc);
		d = safeAdd(d, oldd);
	}
	return [a, b, c, d]
};

/**
* Convert an array of little-endian words to a string
*/
const binl2rstr = (input) => {
	let i;
	let output = '';
	let length32 = input.length * 32;
	for(i = 0; i < length32; i += 8){
		output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
	}
	return output
};

/**
* Convert a raw string to an array of little-endian words
* Characters >255 have their high-byte silently ignored.
*/
const rstr2binl = (input) => {
	let i;
	let output = [];
	output[(input.length >> 2) - 1] = undefined;
	for(i = 0; i < output.length; i += 1){
		output[i] = 0;
	}
	let length8 = input.length * 8;
	for(i = 0; i < length8; i += 8){
		output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
	}
	return output
};

/**
* Calculate the MD5 of a raw string
*/
const rstrMD5 = (s) => {
	return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
};

/**
* Calculate the HMAC-MD5, of a key and some data (raw strings)
*/
const rstrHMACMD5 = (key, data) => {
	let i;
	let bkey = rstr2binl(key);
	let ipad = [];
	let opad = [];
	let hash;
	ipad[15] = opad[15] = undefined;
	if(bkey.length > 16){
		bkey = binlMD5(bkey, key.length * 8);
	}
	for(i = 0; i < 16; i += 1){
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5c5c5c5c;
	}
	hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
};

/**
* Convert a raw string to a hex string
*/
const rstr2hex = (input) => {
	let hexTab = '0123456789abcdef';
	let output = '';
	let x;
	let i;
	for(i = 0; i < input.length; i += 1){
		x = input.charCodeAt(i);
		output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
	}
	return output
};

/**
* Encode a string as utf-8
*/
const str2rstrUTF8 = (input) => {
	return unescape(encodeURIComponent(input))
};

/**
* Take string arguments and return either raw or hex encoded strings
*/
const rawMD5 = (s) => {
	return rstrMD5(str2rstrUTF8(s))
};

const hexMD5 = (s) => {
	return rstr2hex(rawMD5(s))
};

const rawHMACMD5 = (k, d) => {
	return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
};

const hexHMACMD5 = (k, d) => {
	return rstr2hex(rawHMACMD5(k, d))
};

const MD5 = (string, key, raw) => {
	if(!key){
		if(!raw){
			return hexMD5(string)
		}
		return rawMD5(string)
	}
	if(!raw){
		return hexHMACMD5(key, string)
	}
	return rawHMACMD5(key, string)
};

let hook_flag = false;
const RptEv = new BizEvent();
const doHook = () => {
	let observer = new ReportingObserver((reports) => {
		onReportApi.fire(reports);
	}, {
		types: ['deprecation'],
		buffered: true
	});
	observer.observe();
};

const onReportApi = {
	listen(payload){
		!hook_flag && doHook();
		hook_flag = true;
		RptEv.listen(payload);
	},
	remove(payload){
		return RptEv.remove(payload);
	},
	fire(...args){
		return RptEv.fire(...args);
	}
};

let payloads = [];
let popstate_bind = false;

/**
 * 压栈状态
 * @param {Object} param
 * @param {String} title
 */
const pushState = (param, title = '') => {
	let url = location.href.replace(/#.*$/g, '') + '#' + QueryString.stringify(param);
	window.history.pushState(param, title, url);
	exePayloads(param);
};

/**
 * 监听 window onpopstate 事件
 * @param {Function} payload
 */
const onStateChange = (payload) => {
	if(!popstate_bind){
		popstate_bind = true;
		window.addEventListener('popstate', e=>{
			let state = e.state ?? {};
			let hashObj = QueryString.parse(getHash());
			exePayloads({...state, ...hashObj});
		});
	}
	payloads.push(payload);
};

const exePayloads = (param) => {
	payloads.forEach(payload => {
		payload(param);
	});
};

const ONE_MINUTE = 60000;
const ONE_HOUR = 3600000;
const ONE_DAY = 86400000;
const ONE_WEEK = 604800000;
const ONE_MONTH_30 = 2592000000;
const ONE_MONTH_31 = 2678400000;
const ONE_YEAR_365 = 31536000000;

/**
 * 限制函数执行频率
 * @param {Function} payload
 * @param interval
 * @param executeOnFistTime
 */
function frequencyControl(payload, interval, executeOnFistTime = false){
	if(payload._frq_tm){
		clearTimeout(payload._frq_tm);
	}
	payload._frq_tm = setTimeout(() => {
		frequencyControl(payload, interval, executeOnFistTime);
	}, interval);
}

/**
 * 获取指定月份天数
 * @param {Number} year
 * @param {Number} month 月份，从1开始
 * @returns {number}
 */
const getMonthLastDay = (year, month) => {
	const date1 = new Date(year, month, 0);
	return date1.getDate()
};

/**
 * 获取指定上一个月份
 * @param {Number} year
 * @param {Number} month 当前月份，从1开始
 * @returns {Array}
 */
const getLastMonth = (year, month) => {
	return month === 1 ? [year - 1, 12] : [year, month - 1];
};

/**
 * 获取指定下一个月份
 * @param {Number} year
 * @param {Number} month 当前月份，从1开始
 * @returns {Array}
 */
const getNextMonth = (year, month) => {
	return month === 12 ? [year + 1, 1] : [year, month + 1];
};

/**
 * 格式化时间长度
 * @param {Number} micSec 毫秒
 * @param {String} delimiter 单位之间的间隔文本
 * @return {string}
 */
const prettyTime = (micSec, delimiter = '') => {
	let d = 0, h = 0, m = 0, s = 0;
	if(micSec > ONE_DAY){
		d = Math.floor(micSec / ONE_DAY);
		micSec -= d * ONE_DAY;
	}
	if(micSec > ONE_HOUR){
		h = Math.floor(micSec / ONE_HOUR);
		micSec -= h * ONE_HOUR;
	}
	if(micSec > ONE_MINUTE){
		m = Math.floor(micSec / ONE_MINUTE);
		micSec -= m * ONE_MINUTE;
	}
	if(micSec > 1000){
		s = Math.floor(micSec / 1000);
		micSec -= s * 1000;
	}
	let txt = '';
	txt += d ? `${d}天` : '';
	txt += (txt || h) ? `${delimiter}${h}小时` : '';
	txt += (txt || m) ? `${delimiter}${m}分` : '';
	txt += (txt || s) ? `${delimiter}${s}秒` : '';
	return txt.trim();
};

/**
 * 指定偏移月数计算
 * @param {Number} monthNum
 * @param {Date|Null} start_date
 * @return {{month: number, year: number}} 返回年、月（以1开始）
 */
const monthsOffsetCalc = (monthNum, start_date = new Date())=>{
	let year = start_date.getFullYear();
	let month = start_date.getMonth()+1;
	month = month + monthNum;
	if(month > 12){
		let yearNum = Math.floor((month - 1) / 12);
		month = month % 12 === 0 ? 12 : month % 12;
		year += yearNum;
	}else if(month <= 0){
		month = Math.abs(month);
		let yearNum = Math.floor((month + 12) / 12);
		let n = month % 12;
		if(n === 0){
			year -= yearNum;
			month = 12;
		}else {
			year -= yearNum;
			month = Math.abs(12 - n);
		}
	}
	return {year, month}
};

const COM_ID = Theme.Namespace + 'novice-guide';
const CLASS_PREFIX = COM_ID;
const PADDING_SIZE = '5px';

insertStyleSheet(`
	.${CLASS_PREFIX}-highlight {
		position:absolute; 
		z-index:10000;
		--novice-guide-highlight-padding:${PADDING_SIZE}; 
		box-shadow:0 0 10px 2000px #00000057; 
		border-radius:var(${Theme.CssVar.PANEL_RADIUS}); 
		padding:var(--novice-guide-highlight-padding); 
		margin:calc(var(--novice-guide-highlight-padding) * -1) 0 0 calc(var(--novice-guide-highlight-padding) * -1); 
	}
	.${CLASS_PREFIX}-btn {user-select:none; cursor:pointer;}
	.${CLASS_PREFIX}-masker {width:100%; height:100%; position:absolute; left:0; top:0; z-index:10000}
	.${CLASS_PREFIX}-counter {float:left; color:${Theme.CssVar.COLOR}; opacity:0.7} 
	.${CLASS_PREFIX}-next-wrap {text-align:right; margin-top:10px;}
`, COM_ID);

let highlightHelperEl, //开窗效果
	maskerEl; //阻隔层，防止点击到下部页面
const show_highlight_zone = (highlightNode) => {
	hide_highlight_zone();
	if(!highlightHelperEl){
		highlightHelperEl = createDomByHtml(`<div class="${CLASS_PREFIX}-highlight"></div>`, document.body);
		maskerEl = createDomByHtml(`<div class="${CLASS_PREFIX}-masker"></div>`, document.body);
	}
	show(maskerEl);
	show(highlightHelperEl);
	if(highlightNode){
		let hlnOffset = getDomOffset(highlightNode);
		highlightHelperEl.style.left = dimension2Style(hlnOffset.left);
		highlightHelperEl.style.top = dimension2Style(hlnOffset.top);
		highlightHelperEl.style.width = dimension2Style(highlightNode.offsetWidth);
		highlightHelperEl.style.height = dimension2Style(highlightNode.offsetHeight);
		return;
	}
	highlightHelperEl.style.left = dimension2Style(document.body.offsetWidth/2);
	highlightHelperEl.style.top = dimension2Style(300);
	highlightHelperEl.style.width = dimension2Style(1);
	highlightHelperEl.style.height = dimension2Style(1);
	return highlightHelperEl;
};

const hide_highlight_zone = () => {
	maskerEl && hide(maskerEl);
	highlightHelperEl && hide(highlightHelperEl);
};

/**
 * @param {Object[]} steps 步骤内容
 * @param {String} steps.content 步骤内容
 * @param {HTMLElement} steps.relateNode 步骤内容
 * @param config
 */
const showNoviceGuide = (steps, config) => {
	config = Object.assign({
		next_button_text: '下一步',
		prev_button_text: '上一步',
		finish_button_text: '完成',
		top_close: false,  //是否显示顶部关闭按钮
		cover_included: false, //提供的步骤里面是否包含封面步骤
		show_counter: false, //是否显示计数器
		on_finish: function(){
		} //完成显示后的回调(包含顶部关闭操作)
	}, config);

	let step_size = steps.length;
	let show_one = function(){
		if(!steps.length){
			hide_highlight_zone();
			config.on_finish();
			return;
		}

		let step = steps[0];
		steps.shift();

		let showing_cover = config.cover_included && step_size === (steps.length + 1);
		let highlightHelperEl;

		//masker
		if(showing_cover){
			highlightHelperEl = show_highlight_zone(null, {
				left: document.body.offsetWidth / 2,
				top: 300,
				width: 1,
				height: 1
			});
		}else {
			highlightHelperEl = show_highlight_zone(step.relateNode);
		}

		let next_html = `<div class="${CLASS_PREFIX}-next-wrap">`;

		if((steps.length + 2) <= step_size.length){
			next_html += `<span class="${CLASS_PREFIX}-btn ${CLASS_PREFIX}-prev-btn ">${config.prev_button_text}</span> `;
		}
		if(steps.length && config.next_button_text){
			next_html += `<span class="${CLASS_PREFIX}-btn ${CLASS_PREFIX}-next-btn">${config.next_button_text}</span>`;
		}
		if(!steps.length && config.finish_button_text){
			next_html += `<span class="${CLASS_PREFIX}-btn ${CLASS_PREFIX}-finish-btn">${config.finish_button_text}</span>`;
		}
		if(config.show_counter){
			next_html += `<span class="${CLASS_PREFIX}-counter">${step_size.length - steps.length}/${step_size.length}</span>`;
		}
		next_html += `</div>`;

		let tp = new Tip(`<div class="${CLASS_PREFIX}-content">${step.content}</div>${next_html}`, showing_cover ? highlightHelperEl : step.relateNode, {
			showCloseButton: config.top_close,
			dir: showing_cover ? 6 : 'auto'
		});
		tp.onHide.listen(function(){
			tp.destroy();
			hide_highlight_zone();
			config.on_finish();
		});
		tp.onShow.listen(function(){
			tp.dom.style.zIndex = "10001";
			tp.dom.querySelector(`.${CLASS_PREFIX}-next-btn,.${CLASS_PREFIX}-finish-btn`).addEventListener('click', function(){
				tp.destroy();
				show_one();
			});
			let prevBtn = tp.dom.querySelector(`.${CLASS_PREFIX}-prev-btn`);
			if(prevBtn){
				prevBtn.addEventListener('click', function(){
					tp.destroy();
					let len = steps.length;
					steps.unshift(step_size[step_size.length - len - 1]);
					steps.unshift(step_size[step_size.length - len - 2]);
					show_one();
				});
			}
		});
		tp.show();
	};
	show_one();
};

const showNoviceGuideInDates = ()=>{

};

export { ACAsync, ACComponent, ACConfirm, ACCopy, ACDialog, ACPreview, ACSelect, ACTip, ACToast, BLOCK_TAGS, Base64Encode, BizEvent, DialogClass as Dialog, DialogManagerClass as DialogManager, HTTP_METHOD, IMG_PREVIEW_MODE_MULTIPLE, IMG_PREVIEW_MODE_SINGLE, IMG_PREVIEW_MS_SCROLL_TYPE_NAV, IMG_PREVIEW_MS_SCROLL_TYPE_NONE, IMG_PREVIEW_MS_SCROLL_TYPE_SCALE, KEYS, LocalStorageSetting, MD5, Masker, Net, ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH_30, ONE_MONTH_31, ONE_WEEK, ONE_YEAR_365, QueryString, REMOVABLE_TAGS, REQUEST_FORMAT, RESPONSE_FORMAT, Select, TRIM_BOTH, TRIM_LEFT, TRIM_RIGHT, Theme, Tip, ToastClass as Toast, arrayColumn, arrayDistinct, arrayGroup, arrayIndex, base64Decode, base64UrlSafeEncode, between, bindFormUnSavedUnloadAlert, bindImgPreviewViaSelector, bindTargetContextMenu, buildHtmlHidden, buttonActiveBind, capitalize, chunk, convertBlobToBase64, convertFormDataToObject, convertObjectToFormData, copy, copyFormatted, createDomByHtml, cssSelectorEscape, cutString, debounce, decodeHTMLEntities, dimension2Style, domContained, downloadFile, enterFullScreen, entityToString, escapeAttr, escapeHtml, eventDelegate, exitFullScreen, extract, fireEvent, formSerializeJSON, formSerializeString, formSync, formValidate, formatSize, frequencyControl, getAvailableElements, getAverageRGB, getBase64ByImg, getBase64BySrc, getContextDocument, getContextWindow, getCurrentFrameDialog, getCurrentScript, getDomDimension, getDomOffset, getElementValue, getFormDataAvailable, getHash, getHighestResFromSrcSet, getLastMonth, getLibEntryScript, getLibModule, getLibModuleTop, getMonthLastDay, getNextMonth, getRegion, getUTF8StrLen, getViewHeight, getViewWidth, guid, hide, highlightText, html2Text, inputAble, insertStyleSheet, isButton, isElement, isEquals, isInFullScreen, isNum, keepDomInContainer, keepRectCenter, keepRectInContainer, loadCss, loadImgBySrc, loadScript, matchParent, mergerUriParam, monthsOffsetCalc, objectPushByPath, onDocReady, onHover, onReportApi, onStateChange, openLinkWithoutReferer, prettyTime, pushState, randomString, rectAssoc, rectInLayout, regQuote, repaint, requestJSON, resetFormChangedState, resolveFileExtension, resolveFileName, round, scaleFixCenter$1 as scaleFixCenter, serializePhpFormToJSON, setContextWindow, setHash, setStyle, show, showImgListPreviewFn as showImgListPreview, showImgPreviewFn as showImgPreview, showMenu, showNoviceGuide, showNoviceGuideInDates, sortByKey, strToPascalCase, stringToEntity, throttle, toggle, toggleFullScreen, trans, triggerDomEvent, trim, unescapeHtml, utf8Decode, utf8Encode, validateFormChanged, versionCompare };
