var d = false;
var _codeversion = '2.4.4';
var module = angular.module('app', ['onsen']);
/*
module.config(function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
    */

var _twilioRegCallNumber = '9549147171';
var _primaryNumber = '';
var _numberCountryCode = '';
var _usrSmsNbr = '';
var _refId = '';
var _isnew = '0';
var _redirWelcomePage = 'welcome.html';
var _redirWelcomeBackPage = 'welcomeback.html';
var exec = 0;
var platformId = 'android';
try {
    exec = cordova.require('cordova/exec');
    platformId = cordova.require('cordova/platform').id;
} catch (err) {}
var _usrLg = localStorage.lang;
var _isDeviceHandset = false;

function serializeData(data) {
    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {
        return ((data == null) ? "" : data.toString());
    }
    var buffer = [];
    // Serialize each key in the object.
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue;
        }
        var value = data[name];
        buffer.push(
            encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
        );
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join("&").replace(/%20/g, "+");
    return (source);
}

function HashTable(obj) {
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }
    this.setItem = function(key, value) {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        } else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    };
    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };
    this.hasItem = function(key) {
        return this.items.hasOwnProperty(key);
    };
    this.removeItem = function(key) {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        } else {
            return undefined;
        }
    };
    this.keys = function() {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
    this.values = function() {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };
    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    };
    this.clear = function() {
        this.items = {};
        this.length = 0;
    };
}

var h;

app.controller('rv_auth', function($scope, $http) {
    if (_usrLg == "en-US" || _usrLg == "en-CO") {
        h = new HashTable({
            "lbl_smsNumber": "SMS Number",
            "lbl_validatingSms": "Validating your SMS..",
            "lbl_smsExpired": "SMS Code Expired!",
            "lbl_invalidNbr": "Invalid number.",
            "lbl_sendingSms": "Sending SMS...",
            "lbl_reachedSmsLimit2": "Please try again a little bit later.",
            "lbl_reachedSmsLimit1": "You reached the limit of SMS!",
            "img_verifycellphone": "bt_circulo_llamanos_en.png",
            "lbl_smsNotValid": "SMS Not valid!",
            "btn_validateSms": "Validate",
            "lbl_inputSms": "Provide your SMS code",
            "btn_close": "Close",
            "lbl_errorGettingBalance": "Error getting balance.",
            "lbl_thanks_registration": "Thank you for calling us!",
            "btn_continue": "Continue",
            "lbl_letsBegin": "Let's Begin!",
            "lbl_verifyCelphone": "For us to verify your account",
            "lbl_doClick": "click the button below",
            "lbl_doingClickAcceptTerms": 'By clicking on "Call Us" indicates that you accept our terms and conditions',
            "lbl_termsAndContion": "Terms And Conditions.",
            "lbl_sendWelcomeSMS": "Verifying your number we will send you an SMS welcome to your mobile.",
            "lbl_localFeesAply": "* Local fees applies.",
            "lbl_inputYourCellphone": "Provide your cellphone number",
            "lbl_celphoneNbr": "Cellphone number"
        });
    } else {
        h = new HashTable({
            "lbl_smsNumber": "Código SMS",
            "lbl_validatingSms": "Validando SMS..",
            "lbl_smsExpired": "¡Código SMS Expirado!",
            "lbl_invalidNbr": "Número no válido.",
            "lbl_sendingSms": "Enviando SMS...",
            "lbl_reachedSmsLimit2": "Por favor intente de nuevo más tarde.",
            "lbl_reachedSmsLimit1": "¡Llegaste al límite de recuento!",
            "img_verifycellphone": "bt_circulo_llamanos.png",
            "lbl_smsNotValid": "¡Código SMS no válido!",
            "btn_validateSms": "Validar",
            "lbl_inputSms": "Introduce tu código SMS",
            "btn_close": "Cerrar",
            "lbl_errorGettingBalance": "Error al obtener tu saldo.",
            "lbl_thanks_registration": "¡Gracias por llamarnos!",
            "btn_continue": "Continuar",
            "lbl_letsBegin": "¡Vamos a empezar!",
            "lbl_verifyCelphone": "Para que verifiquemos tu cuenta",
            "lbl_doClick": "has clic abajo",
            "lbl_doingClickAcceptTerms": 'Al hacer clic en "LLÁMANOS" indica que haz aceptado nuestros',
            "lbl_termsAndContion": "Términos y Condiciones.",
            "lbl_sendWelcomeSMS": "Al verificar tu número te enviaremos un SMS de bienvenida.",
            "lbl_localFeesAply": "* Se aplican tarifas locales.",
            "lbl_inputYourCellphone": "Ingresa el número de tu celular",
            "lbl_celphoneNbr": "Número celular"
        });
    }

    $scope.lg = {
        get: function(k) {
            return h.getItem(k);
        }
    };

    $scope.smsimg = {
        get: function(k) {
            if (_isDeviceHandset) {
                return "";
            } else {
                return "sms_";
            }
        }
    };

    $scope.primaryNumberInfo = {
        phoneNumber: function(newPrimaryNumber) {
            if (angular.isDefined(newPrimaryNumber)) {
                _primaryNumber = newPrimaryNumber;
            }
            return _primaryNumber;
        }
    };

    $scope.inputSMScode = function() {
        $scope.show('smsCodeInputValidation.html');
    };

    $scope.checkSmsPending = function() {
        if (localStorage.smsPending != undefined) {
            if (localStorage.smsPending == 1) {
                $scope.inputSMScode();
            }
        }
    };

    $scope.smsNumberInfo = {
        userSmsNumber: function(newSmsNbr) {
            if (angular.isDefined(newSmsNbr)) {
                _usrSmsNbr = newSmsNbr;
            }
            return _usrSmsNbr;
        }
    };

    $scope.closeDlg = function() {
        dialog.hide();
    };

    $scope.closeInputNbrDlg = function() {
        jQuery('.PriNumber').intlTelInput('destroy');

        inputNumberDialog.hide();
    };

    $scope.welcomeUser = function() {
        dialog.hide();
        if (_isnew == '1') {
            //localStorage.sendRegistrationCompleteEmail = 1;
            document.location = _redirWelcomePage;
        } else {
            //localStorage.sendRegistrationCompleteEmail = 0;
            document.location = _redirWelcomeBackPage;
        }
    };

    $scope.retryRegistering = function() {
        dialog.hide();
        document.location = 'index.html';
    };

    $scope.showLoading = function(dPanel, timeOut) {
        if (platformId == 'android' && !d) {
            spinnerplugin.show({
                overlay: true, // defaults to true
                timeout: timeOut
            });
        } else {
            if (dPanel != '') {
                $scope.show(dPanel);
            }
        }
    };

    $scope.hideLoading = function() {
        if (platformId == 'android' && !d) {
            spinnerplugin.hide();
        } else {
            dialog.hide();
        }
    };

    $scope.verifyAccount = function() {
        //dialog.hide();
        $scope.hideLoading();
        $scope.showLoading("", 100);
        //      alert('verifying:'+_primaryNumber);
        var getUserRefIdUrl = 'https://mobileapp.ringvoz.com/V2/phone/' + _primaryNumber + '?user=RingVozApp&pass=t3l0nlin3&deviceId='+device.uuid+'&codeversion='+_codeversion;
        console.log('verifyaccount:start'+getUserRefIdUrl);
        $http.get(getUserRefIdUrl).
        success(function(data, status, headers, config) {
            $scope.hideLoading();
            console.log('verifacc:'+data);
            //if (data.data.status == '0' || data.data.status == '2' || data.data.status == null) {
            if (data.data.status == '0' || (data.data.status == '2' && data.data.refid == "time expired")) {
                if (_usrLg == "en-US" || _usrLg == "en-CO") {
                    document.location = 'registration_error_wrongNumber_en.html';
                } else {
                    document.location = 'registration_error_wrongNumber.html';
                }
            } else {
                localStorage.refId = data.data.refid;
                localStorage.u53t0k5n = data.data.token;
                _refId = data.data.refid;
                _isnew = data.data.isnew;
                if (data.data.email == null || data.data.email == '' || data.data.email == 'null') {
                    localStorage.email = '';
                } else {
                    localStorage.email = data.data.email;
                }
                localStorage.isAutoRechargeActivated = false;
                localStorage.autoRechargeAmount = 20;
                localStorage.verifiedNumber = _primaryNumber;
                //alert(_refId + '-' + localStorage.u53t0k5n);
                var url = 'https://mobileapp.ringvoz.com/V2/balance/' + _refId + '?user=' + _refId + '&pass=' + localStorage.u53t0k5n;
                $http.get(url).
                success(function(data, status, headers, config) {
                    //alert('success getting balance');
                    if (data.data.data.DATA.length > 1) {
                        //alert('1success getting balance');
                        localStorage.accountBalance = data.data.data.DATA[0].INFO4;
                    } else {
                        localStorage.accountBalance = data.data.data.DATA.INFO4;
                        //    alert('2success getting balance');
                    }
                    if (_isnew == '1') {
                        document.location = _redirWelcomePage;
                    } else {
                        document.location = _redirWelcomeBackPage;
                    }
                }).
                error(function(data, status, headers, config) {
                    if (_usrLg == "en-US" || _usrLg == "en-CO") {
                        document.location = 'registration_error_404_en.html';
                    } else {
                        document.location = 'registration_error_404.html';
                    }
                });
            }
        }).
        error(function(data, status, headers, config) {
            console.log('error verif acc:'+data);
            if (_usrLg == "en-US" || _usrLg == "en-CO") {
                document.location = 'registration_error_404_en.html';
            } else {
                document.location = 'registration_error_404.html';
            }
        });
    };

    $scope.showThankYouForCalling = function() {
        $scope.show('thankYouForCalling.html');
    };

    $scope.setUserAccountWithIvr = function() {
        //		alert(platformId);
        if (platformId == 'android' && !d) {
            try {
                phonedialer.dial(_twilioRegCallNumber,
                    function(err) {
                        if (err == "empty") $scope.show('getPrimaryNumber.html');
                        else $scope.show('getPrimaryNumber.html');
                        traceCount();
                        return false;
                    },
                    function(success) {
                        setTimeout(function() {
                            //alert('call went into success:' + success);
                            $scope.showThankYouForCalling();
                            return true;
                        }, 6000);
                    }
                );
            } catch (err) {
                //$scope.show('smsCodeInputValidation.html');
                window.open("tel:" + _twilioRegCallNumber, '_system');
            }
        } else {
            window.open("tel:" + _twilioRegCallNumber, '_system');
            setTimeout(function() {
                $scope.showThankYouForCalling();
                return true;
            }, 12000);
        }
    };

    $scope.sendSmsCode = function() {
        try {
            localStorage.verifiedNumber = _primaryNumber;
            localStorage.removeItem("smsPending");
        } catch (err) {}
        var smsAccountRegistrationUrl = 'https://mobileapp.ringvoz.com/V2/smsregistration/' + _primaryNumber + '?numbercountrycode=' + _numberCountryCode + '&user=RingVozApp&pass=t3l0nlin3';
        $http.get(smsAccountRegistrationUrl).
        success(function(data, status, headers, config) {
            $scope.hideLoading();
            if (data.smsstatus.code == '1') {
                //$scope.smsNumberInfo.userSmsNumber(data.smsstatus.testcode);
                localStorage.smsPending = 1;
                localStorage.verifiedNumber = _primaryNumber;
                $scope.show('smsCodeInputValidation.html');
            } else {
                $scope.show('smsMaxCountReached.html');
            }
        }).
        error(function(data, status, headers, config) {
            $scope.hideLoading();
            /*
            if (platformId == 'android') {
				spinnerplugin.hide(); 
			} else {
				dialog.hide();
			}
            */
            document.location = 'registration_error_404.html';
        });
    };

    $scope.smsRegistration = function() {
        $scope.showLoading('sendingSms.html', 100);
        //$scope.show("sendingSms.html");
        $scope.sendSmsCode();
    };

    /*
    $scope.updateDeviceInfo = function() {
    	$http.put('https://mobileapp.ringvoz.com/V2/phone/user=' + _refId + '&pass=' + localStorage.u53t0k5n, {"id": _refId,data: {imei:"", model: device.model}})
    	  .success(function(response, status, headers, config){
    		$scope.student = response.student;
    		$scope.enterNew = false;
    		$scope.editing = false;
    	  })
    	  .error(function(response, status, headers, config){
    		$scope.error_message = response.error_message;
    	  });
    }
    */

    $scope.setAccountFromSMSRegistration = function() {
        $scope.hideLoading();
        /*if (_primaryNumber.toString().indexOf('1') == 0) {} else {
            _primaryNumber = '1' + _primaryNumber;
            
        }*/
        console.log('setaccountregerror: start');
        $scope.showLoading('', 100);
        $http({
            url: 'https://mobileapp.ringvoz.com/V2/phone/' + _primaryNumber + '?user=RingVozApp&pass=t3l0nlin3',
            method: "POST",
            data: serializeData({
                number: _primaryNumber
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).
        success(function(data, status, headers, config) {
            $scope.hideLoading();
            console.log('setaccountregerror: end');
            $scope.verifyAccount();
        }).
        error(function(data, status, headers, config) {
            console.log('setaccountregerror'+data);
            document.location = 'registration_error_404.html';
        });
    };

    $scope.validateSmsCode = function() {
        try {
            localStorage.removeItem("smsPending");
            if (localStorage.verifiedNumber != undefined) {
                _primaryNumber = localStorage.verifiedNumber;
            }
        } catch (err) {}
        $scope.hideLoading();
        $scope.showLoading("validatingSms.html");
        $http({
            url: 'https://mobileapp.ringvoz.com/V2/smsregistration/' + _primaryNumber + '?numbercountrycode=' + _numberCountryCode + '&user=RingVozApp&pass=t3l0nlin3',
            method: "POST",
            data: serializeData({
                number: _primaryNumber,
                code: $scope.smsNumberInfo.userSmsNumber()
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).
        success(function(data, status, headers, config) {
            $scope.hideLoading();
            if (data.smsstatus.code == '1') {
                $scope.setAccountFromSMSRegistration();
            } else if (data.smsstatus.code == '2') {
                $scope.show("smsNotValid.html");
            } else if (data.smsstatus.code == '3') {
                if (_usrLg == "en-US" || _usrLg == "en-CO") {
                    document.location = 'registration_smsExpired_en.html';
                } else {
                    document.location = 'registration_smsExpired.html';
                }
            }
        }).
        error(function(data, status, headers, config) {
            $scope.hideLoading();
            document.location = 'registration_error_404.html';
        });
    };

    $scope.smsTryAgain = function() {
        $scope.closeDlg();
    //    $scope.inputSMScode();
    };

    $scope.isDeviceSeemsTabletType = function() {
        //mine w = 1080 h 1920 ratio 3
        var ratio = window.devicePixelRatio || 1;
        var w = screen.width * ratio;
        var h = screen.height * ratio;
        //var 	w = screen.width;
        //var 	h = screen.height;
        if (w >= 1024) {
            //alert('Seems like a tablet - w:' + w + '-h:' + h + '-ratio:' + ratio);
            return true;
        }
        // alert('Seems like a phone - w:' + w + '-h:' + h + '-ratio:' + ratio);
        return false;
    };
    
    function detectiPad(){
        setTimeout(function(){ 
        if(navigator.userAgent.toLowerCase().match(/ipad/))
            document.getElementById('call').style.visibility='hidden';
        else
            document.getElementById('call').style.visibility='visible';
        }, 950);    
    }
    
    function traceCount(){
                    
                    if(typeof jQuery !='undefined'){
                    setTimeout(function(){ 
                    jQuery('.PriNumber').intlTelInput({
                    initialDialCode: true,
                    //allowExtensions: true,
                    autoFormat: true,
                    autoHideDialCode: false,
                    autoPlaceholder: true,
                    //defaultCountry: "auto",
                    // geoIpLookup: function(callback) {
                    //   $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                    //     var countryCode = (resp && resp.country) ? resp.country : "";
                    //     callback(countryCode);
                    //   });
                    // },
                    nationalMode: false,
                    numberType: "MOBILE",
                    onlyCountries: ['us', 'ca', 'co'],
                    preferredCountries: ['us'],
                    utilsScript: "lib/intl-input/js/utils.js"
                });
            }, 950);
         //   });
        }else{
            alert('jquery Library not found');
        }
        
   }
   


    $scope.getNumberAndRegister = function() {
        // uncoment to manage direct dialing for verification process
        $scope.show('getPrimaryNumber.html');
        detectiPad();
        traceCount();
        /*        
                if (platformId == 'ios' || $scope.isDeviceSeemsTabletType()) {
        		    $scope.show('getPrimaryNumber.html');
                } else {	
                  //    alert('get num');
        			var telephoneNumber = cordova.require('cordova/plugin/telephonenumber');
                  //    alert('plug loaded');
        			if (telephoneNumber != undefined) {
        				telephoneNumber.get(function(dNumber) {		
        					//alert('device number:' + dNumber);
        					if(dNumber != '') {
        						if (dNumber.charAt(0) != '1') {
        							dNumber = '1' + dNumber;
        						}
        						
        						_primaryNumber = dNumber;
                            //    alert(dNumber);
        						// to remove 
        						if (_primaryNumber.toString() == '13144630872' || _primaryNumber.toString() == '13012030660' || _primaryNumber.toString() == '13174339476' || _primaryNumber == '13132004096' || _primaryNumber == '13117807114' || _primaryNumber == '13204454222' || _primaryNumber == '13167171856') {
        							_twilioRegCallNumber = '0313256958';
        							
        						}
                            //    alert('to ivr');
        						$scope.setUserAccountWithIvr();
        					} else {
                            //    alert('dNumber empty:')
        						$scope.show('getPrimaryNumber.html');
        					}
        				}, function() {
        					$scope.show('getPrimaryNumber.html');
        				});	
        			} else {
        				$scope.show('getPrimaryNumber.html');
        			}
        		}*/
    };

    $scope.show = function(dlg) {
        /*
        Dialog dialog = new Dialog(MainActivity.this);
        dialog.setTitle("Animation Dialog");
        dialog.getWindow().getAttributes().windowAnimations = R.style.AddDialogAnim;
        dialog.show();
        
        Dialog imageDiaglog= new Dialog(MainActivity.this,R.style.AddDialogAnim);
        ons.createDialog('dialog.html', {parentScope: $scope});
        
        */
        ons.createDialog(dlg).then(function(dialog) {
            dialog.show();
        });
    };

    $scope.getUserNumber = function() {
        dialog.hide();
        $scope.show('getPrimaryNumber.html');
        traceCount();
    };

    $scope.isCellphoneNbrValid = function() {
        if (_primaryNumber == null) {
            return false;
        }
     //   alert(_primaryNumber.toString().length);
        if (_primaryNumber.toString().length == 0 || _primaryNumber.toString().length > 12 || _primaryNumber.toString().length < 11) {
            return false;
        }
       /* if (_primaryNumber.toString().length == 10) {
            _primaryNumber = '1' + _primaryNumber.toString();
        }*/
        /* debug purposes -  to remove */
        if (_primaryNumber.toString() == '13144630872' || _primaryNumber.toString() == '13012030660' || _primaryNumber.toString() == '13174339476' || _primaryNumber.toString() == '13132004096' || _primaryNumber.toString() == '13117807114' || _primaryNumber.toString() == '13204454222' || _primaryNumber.toString() == '13167171856') {
            _twilioRegCallNumber = '0313256958';
        }
        return true;
    };

    $scope.registerWithSMS = function() {
        inputNumberDialog.hide();
        _primaryNumber=jQuery('#PriNumber').intlTelInput('getNumber').replace('+','');
        _numberCountryCode=jQuery('#PriNumber').intlTelInput('getSelectedCountryData').iso2.toString().toUpperCase();
//        alert(_primaryNumber+' '+ _numberCountryCode);
//        return false;
        if ($scope.isCellphoneNbrValid()) {
            $scope.smsRegistration();
        } else {
            jQuery('.PriNumber').intlTelInput('destroy');
            $scope.show('wrongUserNumber.html');
        }
    };

    $scope.registerWithIvr = function() {
        inputNumberDialog.hide();
        _primaryNumber=jQuery('#PriNumber').intlTelInput('getNumber').replace('+','');
        if ($scope.isCellphoneNbrValid()) {
            $scope.setUserAccountWithIvr();
        } else {
            jQuery('.PriNumber').intlTelInput('destroy');
            $scope.show('wrongUserNumber.html');
        }
    };
});