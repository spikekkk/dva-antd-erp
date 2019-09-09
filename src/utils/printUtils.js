/*
 *	打印函数(传入id)
 */
export function do_print(id_str) {
	var el = document.getElementById(id_str);
	var iframe = document.createElement('iframe');
	var doc = null;
	iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
	document.body.appendChild(iframe);
	doc = iframe.contentWindow.document;
	doc.write('<div>' + el.innerHTML + '</div>');
	doc.close();
	iframe.contentWindow.focus();
	iframe.contentWindow.print();
	if (navigator.userAgent.indexOf("MSIE") > 0){
		 document.body.removeChild(iframe);
	}
}
