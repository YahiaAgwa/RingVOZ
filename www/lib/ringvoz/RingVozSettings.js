var module = angular.module('app', ['onsen']);
var _email = localStorage.email;

var _verifiedPhoneNumber = localStorage.verifiedNumber;
var _accountBalance = localStorage.accountBalance;


app.controller('EmailRegistrationController', function($scope,$http) {
	$scope.closeDlg = function() {
		dialog.hide();
	}
	
	$scope.show = function(dlg) {
	    ons.createDialog(dlg).then(function(dialog) {
	      dialog.show();
	    });
	}
	
	$scope.userSettings = {
		verifiedPhoneNumber: function() {
			return _verifiedPhoneNumber;	    	
		},
		accountBalance: function() {
			return '$' + _accountBalance;	    	
		},
	    email: function(newEmail) {
	    	if (angular.isDefined(newEmail)) {
				localStorage.email = newEmail;
	    		_email = newEmail;
	    	}
	    	return localStorage.email;
	    },
	    accountBalance: function() {
	    	return '$' + _accountBalance;
	    },
	    verifiedNumber: function() {
	    	return _verifiedPhoneNumber;
	    },
	    userName: function(newUserName) {
			if (angular.isDefined(newUserName)) {
	    		_userName = newUserName;
				localStorage.userName = newUserName;
	    	}
			if (localStorage.userName != undefined) {
				return localStorage.userName;
			} else {
				return '';
			}
	    	
	    },
	    userLastName: function(newUserLastName) {
			if (angular.isDefined(newUserLastName)) {
	    		_userLastName = newUserLastName;
				localStorage.userLastName = newUserLastName;
	    	}
			if (localStorage.userLastName != undefined) {
				return localStorage.userLastName;
			} else {
				return '';
			}
	    	
	    },
	    userAddress: function(newUserAddress) {
			if (angular.isDefined(newUserAddress)) {
	    		_userAddress = newUserAddress;
				localStorage.userAddress = newUserAddress;
	    	}
			if (localStorage.userAddress != undefined) {
				return localStorage.userAddress;
			} else {
				return '';
			}
	    	
	    },
	    userCity: function(newUserCity) {
			if (angular.isDefined(newUserCity)) {
	    		_userCity = newUserCity;
				localStorage.userCity = newUserCity;
	    	}
			if (localStorage.userCity != undefined) {
				return localStorage.userCity;
			} else {
				return '';
			}
	    	
	    },
	    userState: function(newUserState) {
			if (angular.isDefined(newUserState)) {
	    		_userState = newUserState;
				localStorage.userState = newUserState;
	    	}
			if (localStorage.userState != undefined) {
				return localStorage.userState;
			} else {
				return '';
			}
	    	
	    },
	    userCountry: function(newUserCountry) {
			if (angular.isDefined(newUserCountry)) {
	    		_userCountry = newUserCountry;
				localStorage.userCountry = newUserCountry;
	    	}
			if (localStorage.userCountry != undefined) {
				return localStorage.userCountry;
			} else {
				return '';
			}
	    	
	    },
	    userZipCode: function(newUserZipCode) {
			if (angular.isDefined(newUserZipCode)) {
	    		_userZipCode = newUserZipCode;
				localStorage.userZipCode = newUserZipCode;
	    	}
			if (localStorage.userZipCode != undefined) {
				return localStorage.userZipCode;
			} else {
				return '';
			}
	    	
	    }		
	};
	
	$scope.updateUserAccount = function() {
		spinnerplugin.show({
			overlay: true,   
			timeout:30
		}); 
		$http.post('https://mobileapp.ringvoz.com/V2/personalinfo?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n, {refid: localStorage.refId, first: localStorage.userName, last: localStorage.userLastName, email: localStorage.email, address: localStorage.userAddress, city: localStorage.userCity, state: localStorage.userState, country: localStorage.userCountry, zip: localStorage.userZipCode}).
		  success(function(data, status, headers, config) {
			spinnerplugin.hide();
			if (data.response.DATA.INFO1 == 'Update Ok ') {
				$scope.show("accountUpdateSuccess.html");
			} else {
				$scope.show("accountUpdateError.html");
			}
		  }).
		  error(function(data, status, headers, config) {
			spinnerplugin.hide();
			  $scope.show("accountUpdateError.html");
		  });	
			  
	};	
});




app.controller('DialogController', function($scope) {
  
  $scope.next = function() {
   
    ons.createDialog('dialog2.html').then(function(dialog) {
	      dialog.show();
	    });
	  
	  };
	  
	  $scope.show = function(dlg) {
	    ons.createDialog(dlg).then(function(dialog) {
	      dialog.show();
	    });
	  };
});

app.controller('NotificationController', function($scope) {
  $scope.alert = function() {
    ons.notification.alert({message: 'An error has occurred!'});
  };
  
  $scope.confirm = function() {
    ons.notification.confirm({
      title: 'Ingresa su correo electronico',
      callback: function(idx) {
        switch(idx) {
          case 0:
           // ons.notification.alert({
           //   message: 'Canceling registration...'
           // });
            break;
          case 1:
           // ons.notification.alert({
           //   message: 'Proceeding Registration...'
           // });
        	 
          //  document.location='top_up_options.html';
            break;
        }
        
      }
    });
  };

  
});