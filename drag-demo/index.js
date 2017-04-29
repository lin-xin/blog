var iosDragDropShim = { enableEnterLeave: true }                // 兼容移动端
var source = document.querySelectorAll('.list'),
    recycle = document.getElementById('recycle'),
    dragElement = null,                                         // 用于存放拖动元素
    lock = true;                                                // 最后元素拖放拖放时会进入enter和leave的循环，用来锁住

for(var i = 0; i < source.length; i++){
    source[i].addEventListener('dragstart',function(ev){
        dragElement = this;                                     // 用于存放拖动元素
        this.style.backgroundColor = '#f8f8f8';                 // 设置拖动元素的背景
    },false);

    source[i].addEventListener('dragend',function(ev){
        ev.target.style.backgroundColor = '#fff';               // 拖放结束还原拖动元素的背景
        ev.preventDefault();
    },false)

    source[i].addEventListener('dragenter', function(ev){
        if(dragElement != this){
            this.parentNode.insertBefore(dragElement,this);     // 把拖动元素添加到当前元素的前面
        }
    }, false)

    source[i].addEventListener('dragleave', function(ev){
        console.log(111);
        if(dragElement != this){
            if(lock && (this == this.parentNode.lastElementChild || this == this.parentNode.lastChild)){    // 当前元素时最后一个元素
                this.parentNode.appendChild(dragElement);       // 把拖动元素添加最后面
                lock = false;
            }else{
                lock = true;
            }
        }
    }, false)
};

recycle.addEventListener('drop', function(ev){                  // 拖进回收站则删除该元素
    dragElement.parentNode.removeChild(dragElement);
}, false)

document.ondragover = function(e){e.preventDefault();}          // 必须设置dragover阻止默认事件
document.ondrop = function(e){e.preventDefault();}