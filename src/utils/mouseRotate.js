/*
 * 平级数据转成树形结构
 */
export function mouseRotate(ev,id) {
    let Div = document.querySelector("#" + id);
    let y = 0;
    let x = 0;    
    let e = ev || event;
    let disX = e.clientX - y;
    let disY = e.clientY - x;
    document.onmousemove = function(inner_ev){
        let inner_e = inner_ev || event;
        y = inner_e.clientY - disY;
        x = inner_e.clientX - disX;
        Div.style.transform = 'rotateX('+x+'deg) rotateY('+y+'deg)';           
    }
    document.onmouseup = function(){
        document.onmouseup = null;
        document.onmousemove = null;
        Div.releaseCapture && Div.releaseCapture();
    }
    Div.setCapture && Div.setCapture();
    //return false; 
}