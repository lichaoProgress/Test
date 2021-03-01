/**
 * Created by Fernando on 2016/7/7.
 */

var p_size =10;//全局每页条数

var node = "GJ536870915";//节点名

var contractorMap={'01':'中孚', '02':'蓝盾', '03':'天融信', '04':'鼎普', '05':'网安', '06':'信工所'};


//$("#p_size").text(p_size)
// 对表格底部的分栏
var col_size = $("#maintable").find("th").length;//表格列数
if($("#maintable tfoot>tr>td>input.checkbox").length > 0) {
    $("#maintable tfoot td:eq(1)").attr("colspan", col_size - 1);
} else {
        $("#maintable tfoot td:eq(0)").attr("colspan", col_size);
}

function selectProtoFwd(obj) {
    $(obj).parent().parent().find("span:first").attr("value",$(obj).attr("value"));
    // $(obj).parent().parent().find("span:first").text($(obj).text());

    //$("#"+id).attr("value",$(obj).attr("value"));
    // $("#"+id).text($(obj).text());
}

function selectPsize(){
    p_size = parseInt($("#p_size").val());
    $('#pagination .active a').text('1');
    refresh();
}

function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}

function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}



function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    temp.target="_self";
    //temp_form.target = "_self";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}


function post_blank(URL, PARAMS) {
    var temp = document.createElement("form");      
    temp.action = URL;      
    temp.method = "post";      
    temp.style.display = "none";
    temp.target="_blank";
    //temp_form.target = "_self";
    for (var x in PARAMS) {      
        var opt = document.createElement("textarea");      
        opt.name = x;      
        opt.value = PARAMS[x];      
        // alert(opt.name)      
        temp.appendChild(opt);      
    }      
    document.body.appendChild(temp);      
    temp.submit();      
    return temp;      
}      
     
//调用方法 如      
//post('pages/statisticsJsp/excel.action', {html :prnhtml,cm1:'sdsddsd',cm2:'haha'});





/*    function mm(a)
 {
 return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+ a.join("\x0f\x0f") +"\x0f");
 }*/

function unique(arr){
// 遍历arr，把元素分别放入tmp数组(不存在才放)
    var tmp = new Array();
    for(var i in arr){
//该元素在tmp内部不存在才允许追加
        if(tmp.indexOf(arr[i])==-1){
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

function refresh(){
    var currentPage = $('#pagination .active a').text()
    LoadPage(currentPage,globalSearchParam)
}

$("#refresh").click(function(){
    refresh()
})




$("#gotopn").click(function() {
    var currentPage = $("input#pn").val();
    $("input#pn").val("")
    var totalcount = $("#totalcount").text()

    //alert(totalcount)
    ///判断currentPage是不是数字
    function isNum(num){
        var reNum=/^\d*$/;
        return(reNum.test(num));
    }
    if (currentPage=="")
    {
        alert("页码不能为空");
        return;
    }
    if(!isNum(currentPage)){
        alert("输入错误")
        return;
    }

    ///判断currentPage是不是>=1  <=totalcount/p_size  不是alert
    if(!(currentPage >= 1 && currentPage <= Math.ceil(totalcount/p_size )))
    {
        alert("页码不存在");
        return ;
    }
    LoadPage(currentPage,globalSearchParam)


    //alert(currentPage)

})

//暂时不用了
function scroll(upJQuery) {


    console.log("html():"+$(upJQuery).parent().next().text())

    //console.log($(upJQuery).parent().next().text() == "上传中...")
    //console.log($(upJQuery).parent().next().text() == "上传中......")


    if ($(upJQuery).parent().next().text() == "上传中...") {

        $(upJQuery).parent().next().html("上传中......")

    }else if ($(upJQuery).parent().next().text() == "上传中......") {

        $(upJQuery).parent().next().html("上传中...")

    }else{


    }



}


function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function uploadProgress(evt, upJQuery) {
    var loaded = evt.loaded;                  //已经上传大小情况
    var tot = evt.total;                      //附件总大小
    var per = Math.floor(100*loaded/tot);     //已经上传的百分比
    if(per == 100){
        $(upJQuery).parent().next().html("上传结束，等待响应，将马上完成");
    }else{
        $(upJQuery).parent().next().html("上传中，大小："+bytesToSize(tot)+"，已完成："+ per +"%");
    }


    //$("#son").css("width" , per +"%");
}


function upload(upJQuery, upfile, upPath, upName){
    console.log("upJQuery:"+upJQuery)
    console.log("upfile:"+upfile)
    console.log("upPath:"+upPath)
    console.log("upName:"+upName)

    $(upJQuery).on('click', function() {

        if($(upfile).get(0).files[0]==undefined){
            $(upJQuery).parent().next().html("请选择文件!")
            return;
        }

        //var timer = setInterval('scroll(upJQuery);', 1000);

        var fd = new FormData();
        //fd.append("count", 1);
        fd.append("upfile", $(upfile).get(0).files[0]);
        console.log("$(upfile).get(0).files[0]:"+$(upfile).get(0).files[0]['name'])
        var file_name = $(upfile).get(0).files[0]['name'];
        $.ajax({
            url: "ajax_action_upload.php?uu=engine.fileupload",
//                url: "test",
//            url: "http://192.168.120.234/file/upload",

            type: "POST",
//            processData: false,
//            contentType: "multipart/form-data",
            cache: false,
            contentType: false,
            processData: false,
            data: fd,
            //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
            xhr: function(){
                var xhr = $.ajaxSettings.xhr();
                if(uploadProgress && xhr.upload) {
                    xhr.upload.addEventListener("progress" , function () { uploadProgress(event,upJQuery) }, false);
                    return xhr;
                }
            },
            success: function(d) {
                //    var data = "{\"msg\":[{\"file_path\":\"/media/test/20161019103825_126367.php\"}],\"code\":200}";
                console.log(d)
                var ret = JSON.parse(d);

                // $(upPath).attr("value", ret.msg[0].file_path)
                $(upPath).val(ret.msg[0].file_path);
                // $(upName).attr("value", file_name)
                $(upName).val(file_name);

                if(ret.code == 200){
                    $(upJQuery).parent().next().html("上传成功!")
                }else{
                    $(upJQuery).parent().next().html("服务器错误!")
                }

                $(upJQuery).prop('disabled',"true");
            },
            beforeSend: function () {
                $(upJQuery).parent().next().html("上传中...")
            },
            error: function () {
                $(upJQuery).parent().next().html("")
                alert("无法连接服务器");
            },
            complete: function () {
                //console.log("clearInterval"+timer)
                //clearInterval(timer);
            }

        });
    });

    $(upfile).change(function() {
        $(upJQuery).removeAttr('disabled')
        $(upJQuery).parent().next().html("")
        $(upPath).attr("value","");
        $(upName).attr("value","");
    })
}


function firstSelect(id){
    var module = $("#"+id).parent().parent()
    var first_text = module.find("li:first").text()
    var first_value = module.find("li:first").attr("value")
    module.find("span:first").attr("value",first_value)
    module.find("span:first").text(first_text);
}


function setSelect(id,v){
    var module = $("#"+id).parent().parent()

    var elem = module.find("li");

    var first_text = module.find("li:first").text()
    var first_value = module.find("li:first").attr("value")
/*    console.log('v:'+v)
    console.log('first_text:'+first_text)
    console.log('first_value:'+first_value)*/

    elem.each(function(){
        //carray.push(parseInt($(this).attr("id")))
        if($(this).attr("value")==v){
            first_text = $(this).text()
            first_value = $(this).attr("value")
/*            console.log('first_text:'+first_text)
            console.log('first_value:'+first_value)*/
        }

    })

    module.find("span:first").attr("value",first_value)
    module.find("span:first").text(first_text);
}
/*
$("#searchButton").focus(function() {
    $(this).parent().parent().find("input[type='text']").each(function(){
        var value = $(this).val(); //这里的value就是每一个input的value值~

        if(!value.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]{0,}$/)){


            var label = $(this).attr('placeholder')

            var error_str =label+"存在非法字符\n";

            alert(error_str)

        }

    });

})*/




//处理复选框全选
function alterChkAll(){
    var lines = $("#maintable tbody tr");
    var uncheckboxs = lines.find("input:eq(0):checkbox:not(:checked)");

    //console.log(uncheckboxs.size())
    if(uncheckboxs.size() == 0){

        $("#chk_all1,#chk_all2").prop("checked", true);
    }else{

        $("#chk_all1,#chk_all2").prop("checked", false);

    }
}


$("#chk_all1,#chk_all2").click(function(){
    if(this.checked){
        $("table :checkbox").prop("checked", true);
    }else{
        $("table :checkbox").prop("checked", false);
    }
});

//绑定复选框选择事件
function rebindChkAll(){

    $("#maintable tbody tr :checkbox").click(function(){

        alterChkAll();

    });

    alterChkAll();
}







//第五种方法
var idTmr;
function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
function method5(tableid) {
    $("#export_div").hide();

    $("#export_div").html($("#maintable").clone());

    $("#export_div #maintable").attr('id','export_maintable');

    $("#export_div #export_maintable tfoot").remove();

    //$("#export_div #export_maintable tr th:eq(0)").remove();
    $("#export_div #export_maintable tr :first-child").remove();
    $("#export_div #export_maintable tr :last-child").remove();

    $("#export_div #export_maintable tbody tr td").each(function(){
        if($(this).text().match(/^[0-9]{0,}$/)){
            $(this).text("["+$(this).text()+"]");
        }

    });

    tableid = export_maintable;


    if(getExplorer()=='ie')
    {
        alert('请使用Chrome浏览器');

    }
    else
    {
        tableToExcel(tableid)
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g,
                function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()



$("#addModal input,textarea").blur(function(){
    var value = $(this).val(); //这里的value就是每一个input的value值~

    //re= /select|update|delete|exec|count|script|'|"|=|;|>|<|%/i;
    re= /select|update|delete|exec|count|script|>|<|%/i;
    if ( re.test(value) ){

        //error_str+=label+"存在非法字符\n";
        alert("请您不要在参数中输入脚本字符和SQL关键字！");
        $("#add-submit").attr("disabled", true);
    }else{

        $("#add-submit").removeAttr("disabled");

    }

});

//
// $("#addModal textarea").blur(function(){
//     var value = $(this).val(); //这里的value就是每一个input的value值~
//
//     //re= /select|update|delete|exec|count|script|'|"|=|;|>|<|%/i;
//     re= /select|update|delete|exec|count|script|>|<|%/i;
//     if ( re.test(value) ){
//
//         //error_str+=label+"存在非法字符\n";
//         alert("请您不要在参数中输入脚本字符和SQL关键字！");
//         $("#add-submit").attr("disabled", true);
//     }else{
//
//         $("#add-submit").removeAttr("disabled");
//
//     }
//
// });

var helper_ele = "&nbsp;<i class=\"fa fa-question-circle hint-helper\" onmouseenter=\"showHint(this);\" onmouseleave=\"hideHint(this);\" style=\"color: darkgrey; \"></i>";
var platform_helper_text = "如需修改请联系系统管理员";
var instance_src = '';



function showHint(obj) {
    $(obj).css("color", "darkgrey");
    longTextHintHelper.show(obj, $(obj).attr("value"));
}
function hideHint(obj) {
    $(obj).css("color", "gray");
    longTextHintHelper.hide();
}


function strList2int(strList) {

    console.log(strList);
    var intList = new Array();
    strList.forEach(function(value,index,array){
        intList.push(parseInt(value));
    })
    console.log(intList);
    return intList;
}

var rule_keyword_helper_text = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;规则内容分为正则表达式和关键词表达式，正则表达式参考正则规则；关键词表达式支持\"与\"、\"非\"和距离（说明：或关系由后台拆分为多个关键词表达式），定义如下：<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a)\t使用英文字符\" &\"表示\"与\"关系，如：\"word1\"&\"word2\"，表示同时存在\"word1\"和\"word2\"；<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b)\t使用英文字符\" !\"表示\"非\"关系，如：!\" word3\"，表示不存在\"word3\"；<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(c)\t使用成对大括号\" {\"、\" }\"和文字符\",\"，表示相对于上一个关键词的距离范围，单位为字节，如{6,10}，表示距离在6到10字节之间；{0,6}，表示距离小于等于6；{10,0}，表示距离大于等于10，0表示无穷大；位于上一个关键词之后，如\"word1\"{6,10}&\"word2\"，表示同时存在\"word1\"和\"word2\"，并\"word2\"的开始位置位于\"word1\"后6到10个字节内；{0, 0}可以省略不写，如\"word1\"{0, 0}&\"word2\" 表示\"word2\"在\"word1\"任意位置，省略{0, 0}后关键词表达式为 \"word1\"&\"word2\"；表示同时存在\"word1\"和\"word2\"(\"word2\"可能在\"word1\"前)。<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(d)\t当对关键词表达式中关键词存在特殊字符(含:\"&\"、\"!\"、\"{\"、\" }\"、\",\" 、\"\\\"、 \"\"\"、 \" \")时, 使用英文字符\"\\\"进行转义；如 \\&\\&&\\\\\\\\，表示同时存在\" &&\"和\"\\\\\"两个关键词；<br/>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(e)\t关键词表达中关键词顺序：距离、\"与\"关系、\"非\"关系，如：" +
    "\"word1\"{3,9}&\"word2\"{6,12}&\"word3\"&\"word4\"! \"word5\"! \"word6\"；<br/>";

function oneSelect(id){
    if(globalSearchParam[id]!=undefined) {
        var key=globalSearchParam[id]
        var module = $("#risk_min").parent().parent();
        var select_obj = module.find("li[value="+key+"]");
        selectProtoFwd(select_obj);
    }
}

function oneInput(id){
    if(globalSearchParam[id]!=undefined) {
        var key=globalSearchParam[id]
        $("#"+id).val(key);
    }
}



//查询下拉
// ---------------------------------获取设备名------------并初始化下拉框-------------------------------
var init_Device_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=device/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.id}>${v.name} | ${v.device_id}</option>`;
                    var deviceObj = {'value':v.id,'name':v.name||''};
                    // cascadeNodeCenterDevice['node_id'].push(deviceObj);
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}

// ---------------------------------获取设备实例名----并初始化下拉框-----------------------------------
var init_DeviceInstance_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=device_instance/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.id}>${v.instance_name} | ${v.instance_id}</option>`
                    var deviceObj = {'value':v.id,'name':v.instance_name||''};
                    // cascadeNodeCenterDevice['node_id'].push(deviceObj);
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}

// ---------------------------------获取设备实例id----并初始化下拉框-----------------------------------
var init_DeviceInstance_id_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=device_instance/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                //console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.instance_id}>${v.instance_name} | ${v.instance_id}</option>`;
                    var deviceObj = {'value':v.instance_id,'name':v.instance_name||''};
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}

// ---------------------------------获取节点名称----并初始化下拉框-----------------------------------
var init_Node_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=node/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.id}>${v.name } | ${v.ip_addr}</option>`
                    var deviceObj = {'value':v.id,'name':v.name||''};
                    // cascadeNodeCenterDevice['node_id'].push(deviceObj);
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}

// ---------------------------------获取策略表名称----并初始化下拉框-----------------------------------
var init_Rule_Table_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=rule_table/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.type_key}> ${v.type_key} | ${v.name}</option>`
                    var deviceObj = {'value':v.type_key,'name':v.name||''};
                    // cascadeNodeCenterDevice['node_id'].push(deviceObj);
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}

// ---------------------------------用户列表----并初始化下拉框-----------------------------------
var init_username_DrowndownList = function (label_id) {
    $.ajax({
        url: "/ajax_action_platform.php?uu=user/show&p_size=1000",
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == "200") {
                var deviceData = res["msg"];
                console.log(deviceData);
                var deviceoption = "";
                deviceData.map(function(v,i){
                    deviceoption+=`<option value=${v.username}> ${v.username}</option>`
                })
                $(label_id).append(deviceoption);
                $(label_id).selectpicker('refresh');
            }
        }
    })
}



///** 随机生成固定位数或者一定范围内的字符串数字组合
//  * @param {Number} min 范围最小值
//  * @param {Number} max 范围最大值，当不传递时表示生成指定位数的组合
//  * */
function randomRange(min, max){
    var returnStr = "",
        range = (max ? Math.round(Math.random() * (max-min)) + min : min),
        charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i=0; i<range; i++){
        var index = Math.round(Math.random() * (charStr.length-1));
        returnStr += charStr.substring(index,index+1);
    }
    return returnStr;
}

//自定义弹窗消息
function message_pop_ups(msg){
    str = "<span style=\"font-size: 18px;color: red\">"+ msg +"</span>";
    $("#div_show_tips").html(str);
    $("#showTips").modal('show');
}

// 判断距离当前时间间隔（版本一）  ///几天前
function formatTime2BriefText(str_time, allow_time_error_minute) {
    var pre_date = new Date(str_time);  //开始时间
    var curr_date = new Date();    //结束时间
    var diff_stamp = curr_date.getTime() - pre_date.getTime();
    if(diff_stamp < 0) {
        var t = Math.ceil(diff_stamp * -1 / (60 * 1000));
        if(t > allow_time_error_minute) {
            return "时间错误";
        } else {
            return "刚刚";
        }
    }

    var time_per_unit_diffs = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    for(var i = time_per_unit_diffs.length - 1; i >= 0; i--) {
        var diff = 0;
        if(i < time_per_unit_diffs.length - 2 && time_per_unit_diffs[i+1][1] < 0) {
            diff -= 1;
        }
        switch (i) {
            case 5:
                diff += curr_date.getSeconds() - pre_date.getSeconds();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 60;
                break;
            case 4:
                diff += curr_date.getMinutes() - pre_date.getMinutes();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 60;
                break;
            case 3:
                diff += curr_date.getHours() - pre_date.getHours();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 24;
                break;
            case 2:
                diff += curr_date.getDate() - pre_date.getDate();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 30;
                break;
            case 1:
                diff += curr_date.getMonth() - pre_date.getMonth();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 12;
                break;
            case 0:
                diff += curr_date.getFullYear() - pre_date.getFullYear();
                time_per_unit_diffs[i][0] = diff;
                break;
            default: break;
        }
    }

    if(time_per_unit_diffs[0][0] < 0) return "时间错误";
    for(var j = 0; j < time_per_unit_diffs.length; j++) {
//            console.log("i=" + j + ": " + time_per_unit_diffs[j][0]);
        if (time_per_unit_diffs[j][0] > 0) {
            switch (j) {
                case 0:
                    return time_per_unit_diffs[j][0] + "年前";
                case 1:
                    return time_per_unit_diffs[j][0] + "个月前";
                case 2:
                    return time_per_unit_diffs[j][0] + "天前";
                case 3:
                    return time_per_unit_diffs[j][0] + "小时前";
                case 4:
                    return time_per_unit_diffs[j][0] + "分钟前";
                case 5:
                    return time_per_unit_diffs[j][0] + "秒前";
            }
        }
    }
}

// 判断距离当前时间间隔（版本二 建议使用）  ///几天前
function formatTime2BriefText2(str_time, allow_time_error_minute) {
    var pre_date = new Date(str_time);  //开始时间
    var curr_date = new Date();    //结束时间
    var diff_stamp = curr_date.getTime() - pre_date.getTime();
    console.log("curr_date:"+curr_date);
    console.log("pre_date:"+pre_date);
    console.log("diff_stamp:"+diff_stamp);
    if(diff_stamp < 0) {
        var t = Math.ceil(diff_stamp * -1 / (60 * 1000));
        console.log("t:"+t);
        if(t > allow_time_error_minute) {
            return str_time + "  /<span style='color: red'>时间错误</span>";
        } else {
            return str_time + "  /<span style='color: rgb(5, 245, 1);'>刚刚</span>";
        }
    }

    var time_per_unit_diffs = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    for(var i = time_per_unit_diffs.length - 1; i >= 0; i--) {
        var diff = 0;
        if(i < time_per_unit_diffs.length - 2 && time_per_unit_diffs[i+1][1] < 0) {
            diff -= 1;
        }
        switch (i) {
            case 5:
                diff += curr_date.getSeconds() - pre_date.getSeconds();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 60;
                break;
            case 4:
                diff += curr_date.getMinutes() - pre_date.getMinutes();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 60;
                break;
            case 3:
                diff += curr_date.getHours() - pre_date.getHours();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 24;
                break;
            case 2:
                diff += curr_date.getDate() - pre_date.getDate();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 30;
                break;
            case 1:
                diff += curr_date.getMonth() - pre_date.getMonth();
                time_per_unit_diffs[i][1] = diff >= 0 ? 0 : -1;
                time_per_unit_diffs[i][0] = diff >= 0 ? diff : diff + 12;
                break;
            case 0:
                diff += curr_date.getFullYear() - pre_date.getFullYear();
                time_per_unit_diffs[i][0] = diff;
                break;
            default: break;
        }
    }

    if(time_per_unit_diffs[0][0] < 0) return "<span style='color: red'>时间错误</span>";

    for(var j = 0; j < time_per_unit_diffs.length; j++) {
//      console.log("i=" + j + ": " + time_per_unit_diffs[j][0]);
        if (time_per_unit_diffs[j][0] > 0) {
            switch (j) {
                case 0:
                    return str_time + "  /<span style='color: orange'>" + time_per_unit_diffs[j][0] + "年前</span>";
                case 1:
                    return str_time + "  /<span style='color: orange'>" + time_per_unit_diffs[j][0] + "个月前</span>";
                case 2:
                    return str_time + "  /<span style='color: orange'>" + time_per_unit_diffs[j][0] + "天前</span>";
                case 3:
                    return str_time + "  /<span style='color: orange'>" + time_per_unit_diffs[j][0] + "小时前</span>";
                case 4:
                    if(time_per_unit_diffs[j][0] < 10){
                        return str_time + "  /<span style='color: rgb(5, 245, 1);'>" + time_per_unit_diffs[j][0] + "分钟前</span>";
                    }else{
                        return str_time + "  /<span style='color: orange;'>" + time_per_unit_diffs[j][0] + "分钟前</span>";
                    }

                case 5:
                    return str_time + "  /<span style='color: rgb(5, 245, 1);'>" + time_per_unit_diffs[j][0] + "秒前</span>";
            }
        }
    }


}

// 判断是否超时，原 节点状态页使用
function checkNodeIsTimeOut(str, timeout_minute) {
    var curr_timestamp = Date.parse(new Date()) / 1000;
    var str_timestamp = Date.parse(new Date(str)) / 1000;
    var aa = curr_timestamp - str_timestamp;
    if(curr_timestamp - str_timestamp > timeout_minute * 60) {
        return true;
    }
    else {
        return false;
    }
}



// 判断是否超时 【返回字符串】    内部调用checkNodeIsTimeOut
function checkTimeOutReturnStr(str, timeout_minute) {
    if(checkNodeIsTimeOut(str,timeout_minute)) {
        return '<sapn style="color:red;">(超时)</sapn>';
    }
    else {
        return '';
    }
}

//时钟偏差格式化--
function clockDifferenceFormat(millisecond){
    var time_format_str = '';

    if(millisecond > 0){
        time_format_str += '快';
    }else if(millisecond < 0){
        time_format_str += '慢';
    }else if(millisecond == 0){
        return '时钟同步';
    }


    var day_span = getDay(millisecond)
    console.log("day_span:" + day_span+ "   millisecond:" + millisecond);
    if(day_span > 0){
        time_format_str += day_span + '天';
        return time_format_str;
    }

    var hour_span = getHour(millisecond)
    if(hour_span > 0){
        time_format_str += hour_span + '小时';
        return time_format_str;
    }

    var minute_span = getMinute(millisecond)
    if(minute_span > 0){
        time_format_str += minute_span + '分钟';
        return time_format_str;
    }

    var second_span = getSecond(millisecond)
    if(second_span > 0){
        time_format_str += second_span + '秒';
        return time_format_str;
    }

    var millisecond_span = getMillisecond(millisecond)
    if(millisecond_span > 0){
        time_format_str += millisecond_span + '毫秒';
        return time_format_str;
    }

    function getDay(millisecond) {
        return Math.floor(Math.abs(millisecond) / (3600 * 24 * 1000) );
    }

    function getHour(millisecond) {
        return Math.floor( Math.abs(millisecond) / (3600 * 1000) );
    }

    function getMinute(millisecond) {
        return Math.floor( Math.abs(millisecond) / (60 * 1000) );
    }

    function getSecond(millisecond) {
        return Math.floor( Math.abs(millisecond) / 1000);
    }

    function getMillisecond(millisecond) {
        return Math.floor( Math.abs(millisecond) / 1);
    }
}


//#a_menu_platform_msg
//下拉菜单平台信息
function show_platform_message() {
    $('#showDetailPlatformModel').modal('show');
    $('#showDetailPlatformModel table tbody').html('');
    $.ajax({
        url: "/ajax_action_platform.php?uu=platform_message/show&p_size=1000",
        success: function (data) {
            var ret = JSON.parse(data);
            if (ret.code == "200") {
                msg = ret.msg
                $("#message_title").html("基础平台信息"+helper_ele);
                $("#message_title i.hint-helper").attr("value", platform_helper_text);

                var tr =
                    "<tr class='node_id_highlight'><td class='node_msg_name'>节点ID</td><td class=\'node_msg_value\'>" + msg['MY_NODE_ID'] + "</td></tr>" +
                    "<tr class='node_id_highlight'><td class='node_msg_name'>节点名称</td><td class='node_msg_value'>" + msg['MY_NODE_NAME'] + "</td></tr>" +
                    "<tr><td class='node_msg_name'>节点IP</td><td class='node_msg_value'>" + msg['MY_NODE_IP'] + "</td></tr>" +
                    "<tr><td class='node_msg_name'>平台前缀码</td><td class='node_msg_value'>" + msg['global_serial'] + "</td></tr>"+
                    "<tr><td class='node_msg_name'>基础平台ID</td><td class='node_msg_value'>" + msg['system_id'] + "</td></tr>" +
                    "<tr><td class='node_msg_name'>基础平台IP</td><td class='node_msg_value'>" + msg['system_ip'] + "</td></tr>"+
                    "<tr><td class='node_msg_name'>上级管理中心IP</td><td class='node_msg_value'>" + msg['superior_ip'] + "</td></tr>";

                $('#tbdy_platform_msg').append(tr);

            }else {
                $('#showDetailStatusModel table tbody').html("<tr><td colspan=3>" + msg + "</td></tr>");
                }
            },
            error: function (XMLHttpRequest) {
                temp_msg = XMLHttpRequest.status + ":" + JSON.parse(XMLHttpRequest.responseText).msg
                message_pop_ups(temp_msg);//消息弹窗
            }
    })
}

