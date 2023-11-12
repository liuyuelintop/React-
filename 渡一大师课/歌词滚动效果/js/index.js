/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象
 * {time: 开始时间, words: 歌词内容}
 */
function parseLrc(){
    var lines = lrc.split('\n');
    var result = [];
    for (var i = 0; i<lines.length; i++){
        var str = lines[i];
        var parts = str.split('\]')
        var timeStr = parts[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            words: parts[1],
        }
        result.push(obj);
    }
    return result;
}

/**
 * 将一个时间字符串解析为数字(秒)
 * @param {String} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr){
    var parts = timeStr.split(':');
    return +parts[0]*60 + +parts[1];
}

var lrcData = parseLrc();

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
};

/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮的歌词下标
 */
function findIndex(){
    var offset = 4.4; // 有延迟大约 4.4s
    var curTime = doms.audio.currentTime + offset;
    var start = 0;
    var end = lrcData.length - 1;
    
    while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        if (lrcData[mid].time === curTime) {
            return mid;
        } else if (lrcData[mid].time < curTime) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    
    return start > 0 ? start - 1 : 0;
}

/**
 * 返回随机颜色
 */
function randomColor(){
    return '#' + Math.random().toString(16).substring(2,8).padEnd(6,'0');
}
var liActiveColors = [];
/**
 * 创建歌词元素 li
 */
function createLrcElements(){
    var frag = document.createDocumentFragment();
    for(var i = 0; i < lrcData.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        // li.style.color = randomColor();
        liActiveColors[i] = randomColor();
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}


createLrcElements();

var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffset = doms.ul.clientHeight-containerHeight;
/**
 * 设置 ul 元素的偏移量
 */
function setOffset(){
    var index = findIndex(); 
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if(offset < 0){
        offset = 0;
    }
    if(offset>maxOffset){
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
    // 去掉之前的 active 样式
    var li = document.querySelector('.active');
    if(li){
        li.classList.remove('active');
        li.style.color = '#666';
    }
    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
        li.style.color = liActiveColors[index];
    }
}

doms.audio.addEventListener('timeupdate', setOffset)

