function myFunction() {
    // 声明变量
    var a, i;
    var input = document.getElementById('myInput');
    var filter = input.value.toUpperCase();
    var ul = document.getElementById("content");
    var li = ul.getElementsByTagName('li');

    // 循环所有列表，查找匹配项
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0];
        b = li[i].getElementsByTagName("div")[1];
        c = li[i].getElementsByTagName("div")[2];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 || b.innerHTML.toUpperCase().indexOf(filter) > -1 || c.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}