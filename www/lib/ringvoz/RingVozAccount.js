var module = angular.module('app', ['onsen']);
var _verifiedPhoneNumber = localStorage.verifiedNumber;
var _refId = localStorage.refId;


app.controller('AccountBalanceController', function($scope) {
	$scope.getAccountBalance = function(displayPanel) {
		/* $.ajax({
 			url:'http://38.105.13.237/mobileapp/ZendAPI/public/phone/' + _verifiedPhoneNumber + '?user=RingVozApp&pass=t3l0nlin3',
 			type:'POST',
 			dataType:'json',
 			 error: function (xhr, status, index, anchor) {
 				alert('Error getting account balance');
 	         },
 	         success:function(refResponse)	{
 	        	 // set account balance display
 	         }
 		});*/
		 $('#' + displayPanel).html('30$');
	}
	
});