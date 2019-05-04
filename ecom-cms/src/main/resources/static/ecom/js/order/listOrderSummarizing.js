$(document).ready(function() {
	listOrderSummarizing.init();
})

var listOrderSummarizing = {
	init : function() {
		listOrderSummarizing.initEvent();
		listOrderSummarizing.showDatetimepicker();
	},
	initEvent : function() {
		$('.date-time-picker').datetimepicker({
			format : 'yyyy-MM-dd hh:mm:ss',
			language : 'zh-CN',
			pickDate : true,
			pickTime : true,
			hourStep : 1,
			minuteStep : 5,
			secondStep : 10,
			endDate : new Date(new Date() - 86400000),
			initialDate : new Date(new Date() - 86400000),
			inputMask : true
		}).on('changeDate', function(ev) {
			// alert(ev.date.valueOf());
		});
		$('#queryType').on('change', listOrderSummarizing.showDatetimepicker);
		$('.btn-search').on('click', listOrderSummarizing.searchData);
		$('.btn-reset').on('click', listOrderSummarizing.searchReset);
		$('.btn-close').on('click', listOrderSummarizing.searchReset);
		$('#eshopName').change(function() {
			var en = $("#eshopName option:selected");
			eshopName = en.val();
			if (eshopName == null || eshopName == "") {
				$("#merchantNo").val("");
				$("#shopNo").val("");
			} else {
				listOrderSummarizing.mchntShop(eshopName);
			}
				
		});
	},
	searchData : function() {
		if ($('#queryType').val() == 'his') {
			var sd = $('#beginTime').val();
			var ed = $('#endTime').val();
			if (sd == '' || sd == null) {
				Helper.alert('开始时间不能为空');
				return false;
			}
			if (ed == '' || ed == null) {
				Helper.alert('结束时间不能为空');
				return false;
			}
			var s_d = sd.replace(new RegExp("-", "g"), "").substring(0, 8);
			var e_d = ed.replace(new RegExp("-", "g"), "").substring(0, 8);
			var now = new Date();
			var year = now.getFullYear();
			var month = (now.getMonth() + 1).toString();
			var day = (now.getDate()).toString();
			if (month.length == 1) {
				month = "0" + month;
			}
			if (day.length == 1) {
				day = "0" + day;
			}
			if (sd != '' && ed != '' && sd.localeCompare(ed) > 0) {
				Helper.alert('开始时间不能大于结束时间');
				return false;
			}
			var c_d = year + month + day;
			if (s_d == c_d) {
				Helper.alert('开始时间不能为当天');
				return false;
			}
			if (e_d == c_d) {
				Helper.alert('结束时间不能为当天');
				return false;
			}
		} else if ($('#queryType').val() == '') {
			Helper.alert('请选择查询记录');
			return false;
		}
		var eshopName = $("#eshopName").val();
		if (eshopName == null || eshopName == "") {
			$("#merchantNo").val("");
			$("#shopNo").val("");
		}
		document.forms['searchForm'].submit();
	},
	showDatetimepicker : function() {
		var queryType = $('#queryType').val();
		if (queryType == 'his') {
			$('#datetimepicker1').show();
			$('#datetimepicker2').show();
		} else if (queryType == 'cur') {
			$('#datetimepicker1').hide();
			$('#datetimepicker2').hide();
			$('#beginTime').val('');
			$('#endTime').val('');
		} else {
			$('#datetimepicker1').hide();
			$('#datetimepicker2').hide();
			$('#beginTime').val('');
			$('#endTime').val('');
		}
	},
	mchntShop : function(eshopName) {
		$.ajax({
			url : Helper.getRootPath() + '/eshop/eshopNameChange',
			type : 'post',
			dataType : "json",
			data : {
				"eshopName" : eshopName
			},
			success : function(data) {
				$("#merchantNo").val(data.mchntCode);
				$("#shopNo").val(data.shopCode);
			},
			error : function() {
				$("#merchantNo").val("");
				$("#shopNo").val("");
			}
		});
	},
	searchReset : function() {
		Helper.post('/order/listOrderSummarizing');
	}
};