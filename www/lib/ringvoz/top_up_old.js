var d = false;
var module = angular.module('app', ['onsen']).run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]);

var _selectedCountry = 0.00;
var _regulatoryCharges = 0.00;
var _rechargeAmount = 0.00;
var _rechargeAmountTotal = 0.00;
var _rechargeAmountCurrencyValue = '';
var _selectedCountryName = 'None';
var _selectedOperatorName = 'None';
var _destinationNumber = 0;
var _destinationNumberLength = 0;
var _destinationNbrPattern = '';
var _countryCode = '';
var _country = '';
var _selectedCountryFlag = 'images/Top-up-Images/countries/blank.png';
var _selectedOperatorLogo = 'images/Top-up-Images/mobileOperators/blank.png';
var _accBalanceLed = 'images/greenBallAlert.png';
var _operator = null;
var _opCode = null;
var _ccFirstName = '';
var _ccLastName = '';
var _ccAddress = '';
var _ccCity = '';
var _ccState = '';
var _ccZipCode = '';
var _ccCountry = 'United States';
var _ccCountryName = 'United States';
var _paymentMethod = '';
var _paymentMethodId = 0;
var _ccNumber = null;
var _ccNumberTrunc = '';
var _ccExpDateMonth = '';
var _ccExpDateYear = '';
var _cvv = '';
var _registeredCcId = '';
var _verifiedPhoneNumber = localStorage.verifiedNumber;
var _accountBalance = localStorage.accountBalance;
var _email = localStorage.email;
var _isPromotionActive = 0;
var _userName = '';
var _userLastName = '';
var _userAddress = '';
var _userCity = '';
var _userState = '';
var _userCountry = '';
var _userZipCode = '';
var _rechargeAmounts = [{name: "Selecciona el valor"}];
var _doRecharge = false;
var _updateTransaction = true;

//var _platformId = cordova.require('cordova/platform').id;   
var _platformId = 'android';

var _userCreditCardsList = [];
var _auto10SelectedImgSrc = 'images/10.png';
var _auto15SelectedImgSrc = 'images/15.png';
var _auto20SelectedImgSrc = 'images/20selected.png';
var _auto30SelectedImgSrc = 'images/30.png';
var _auto40SelectedImgSrc = 'images/40.png';
var _auto50SelectedImgSrc = 'images/50.png';

var _rechargeAmount10SelectedImgSrc = 'images/10.png';
var _rechargeAmount15SelectedImgSrc = 'images/15.png';
var _rechargeAmount20SelectedImgSrc = 'images/20selected.png';

var _ccClass = "custom-dropdown-cardslist";
var _accountRechargeConfirmDisplay = 'rechargeTransactionDetails.html';
var _autoRechargeActivated = localStorage.isAutoRechargeActivated;
var _autoRechargeAmount = localStorage.autoRechargeAmount;
var _setBackToRechargeAccount = false;
var _popCreditCardRegistrationPage = false;
var _rechargeAccountCcDisplay = '';
var _tripplePayPin = '';
var _newPinBalance = 0;
var _usrLg = localStorage.lang;

var _directDialInterNbr =  '';
var _directDialDescription = '';
var _directDialPosition = 0;
var _directDialNextPosition = 0;

var exec = 0;
try {
     exec = cordova.require('cordova/exec');
}
catch(err) {
}



function serializeData( data ) { 
    // If this is not an object, defer to native stringification.
    if ( ! angular.isObject( data ) ) { 
        return( ( data == null ) ? "" : data.toString() ); 
    }

    var buffer = [];

    // Serialize each key in the object.
    for ( var name in data ) { 
        if ( ! data.hasOwnProperty( name ) ) { 
            continue; 
        }

        var value = data[ name ];

        buffer.push(
            encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
        ); 
    }

    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
    return( source ); 
}

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}        

app.directive('errSrc', function() {
    return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
    	}, function (value) {
		  if (!value) {
			element.attr('src', attrs.errSrc);  
		  }
	  });

	  element.bind('error', function() {
		element.attr('src', attrs.errSrc);
	  });
	}
	}
});


app.controller('InterTopUpController', function($scope,$http,$location,$anchorScroll) {

    var h;
	var topUpOptionsHome;
	
	if (_usrLg == "en-US" || _usrLg == "en-CO") {
		h = new HashTable({"lbl_accessNbrExists": "Access Number Saved!", "settings_opt2_sub": "Edit your access number here", "settings_opt2": "Access Number", "settings_opt1_sub": "Update your account information", "settings_opt1": "Account Information", "lbl_accessNumberSavedFailed": "Failed to save your access number", "lbl_accessNumberSavedSuccess": "Access number saved successfully!", "accessNumberLog": "RingVoz - Access Number", "lbl_errorCalling": "Error trying to call this number", "lbl_accessNbrSetupTitle": "Access Number",  "btn_addContactNbr": "Register", "lbl_directDialAddNumberSubTitle": "Add new number", "btn_addDirectDialNbr": "Add a Number", "lbl_numberLeftToRegister": "You have 4 registered number of 10 available", "lbl_directDialMyNumbers": "My Numbers",  "lbl_addAccessNumber_sub": "Select the access number you prefer", "lbl_directDialContactLst_sub": "Select a number to call or update", "lbl_directDial_sub": "Add up to 10 local numbers and your calls will be automatically connected", "lbl_lgTag": "_en", "lbl_inputYourEmail": "Provide your email address", "drp_addCreditCard": "Add Credit Card", "lbl_visitHelpCenter": "    Visit our Help Center     ", "lbl_callUsNow": " Call us Now ", "lbl_haveQuestions": " HAVE QUESTIONS ", "lbl_support": "Help", "lbl_others": "Others...", "lbl_ifYouDontHaveFavoriteShop4": "recharge your account.", "lbl_ifYouDontHaveFavoriteShop3": "the closest one to", "lbl_ifYouDontHaveFavoriteShop2": "localize here", "lbl_ifYouDontHaveFavoriteShop": "Don't have a favorite shop,", "lbl_rechargeWithPinfromShop2": "from your shop", "lbl_rechargeWithPinfromShop": "Recharge here with granted PIN", "lbl_rechargeAccountForInternational2": "always will be connected with your beloved", "lbl_rechargeAccountForInternational": "Recharge your account for international calls and", "lbl_whenBalanceLess": "when you're balance is $5 or less", "lbl_selectAutoRechargeAmount": "Select the automatic recharge amount", "lbl_alwaysStayConnected": "For you to just never stop being connected", "lbl_autoRecharge": "Auto Recharge", "lbl_rinvozConnectsYou": "RingVoz Connects you to the world!", "lbl_toCall": "To call compose", "lbl_accountRechargedWith": "Your account was recharged with", "lbl_accountUpdateFailed": "Updating your account failed", "lbl_accountUpdatedSuccess": "Account successfully updated", "lbl_wrongInfoProvided": "Incorrect Information", "btn_myAccountRecharge": "Account Recharge", "btn_topUpRecharge": "Top-Up Recharge", "lbl_whatDoYouWantToDo": "What do you want to do", "lbl_cardAddSuccessfuly": "Card added successfuly", "lbl_activated": "activated", "lbl_autoRechargeAmoutConfirm": "Auto recharge for", "lbl_confirmRecharge": "Confirm your recharge", "btn_recharge": "Recharge", "lbl_totalValue": "Total value", "lbl_taxes": "Taxes", "lbl_paymentMethodCardNbr": "Card number", "lbl_paymentMethod": "Payment method", "lbl_cellNumber": "Cellphone number", "lbl_operator": "Operator", "lbl_numbers": " numbers", "lbl_example": "Example:", "lbl_selectCountryOpTitle2": "mobile recharge", "lbl_selectCountryOpTitle1": "Select the country and the operator to process the", "lbl_year": "Year", "lbl_month": "Month", "btn_addCard": "Register", "lbl_myAccountHistory": "Account History", "lbl_rechargeToNbr": "Recharge to", "lbl_transAmount": "Amount", "lbl_desc": "Description", "lbl_date": "Date", "btn_funds": "Funds", "btn_topUp": "Top Up", "lbl_transactionsHistory": "Transactions", "lbl_invalidNbr": "Invalid number.", "lbl_errorGettingBalance": "Error getting balance.", "lbl_transactionDeclined": "Transaction declined.", "lbl_transactionSuccessful": "Transaction Successful!", "lbl_selectAnAmount": "Select the amount.", "lbl_cardNotValid": "Credit card not valid.", "lbl_loadingCards": "Loading your cards...", "btn_yesPlease": "Yes, Please!", "btn_noThanks": "No, Thank you", "lbl_addOneCardNow": "Would you like to add one now?", "lbl_noCCorDebitCardRegistered": "You do not have credit or debit card registered!", "lbl_incorrectNumber": "Incorrect amount of numbers.", "btn_close": "Close", "lbl_pinNotValid": "PIN not valid.", "lbl_processingTransaction": "Processing transaction...", "lbl_registeringCard": "Registering your card...", "lbl_updatingAccount": "Updating your account...", "lbl_validatingPin": "Validating your PIN...", "lbl_pinBalance": "PIN Balance", "btn_rechargeNow": "Recharge", "btn_validatePin": "Validate", "lbl_rechargeValue": "Recharge amount", "lbl_accountRecharge": "Recharge your account", "lbl_paymentMethods": "Payment Methods", "btn_save": "Save", "lbl_email": "Email", "lbl_postalCode": "Postal Code", "lbl_country": "Country", "lbl_state": "State", "lbl_city": "City", "lbl_address": "Address", "lbl_nameLastName": "Names/Last Names", "lbl_accNbr": "Your account number", "lbl_selectOperator": "Select the operator", "lbl_selectCountry": "Select the country", "lbl_termsAndContions": "Terms And Conditions.", "btn_proceed": "Continue", "btn_back": "Go back", "lbl_cellNumberToRecharge": "Cellphone number you wish to recharge:", "lbl_selectValue": "Select the amount", "lbl_selectedOperator": "Selected Operator:", "lbl_selectedCountry": "Selected Country:", "lbl_interTopUp_sub": "International Top-Up Recharges", "lbl_mainMenu": "Home", "lbl_configuration": "Settings", "lbl_support": "Help", "home_opt1": "Mobile Top-up Recharge", "home_opt1_desc": "Make cellphones recharges", "home_opt2": "Recharge your Account", "home_opt2_desc": "For your international calls", "home_opt3": "Credit or debit card", "home_opt3_desc": "Add credit or debit card", "home_opt4": "Account Transactions", "home_opt4_desc": "Review account transactions", "home_opt5": "Direct Dial", "home_opt5_desc": "One tap call anywhere in the world", "home_opt6_notsetup": "Pick Your Access number", "home_opt6_notsetup_desc": "Call anywhere in the world", "home_opt6": "Your Access number", "home_opt6_desc": "Call anywhere in the world","lbl_welcomeToRingVoz": "Welcome to RingVoz", "lbl_contactYourFriendsFamilly": "You can contact your friends and familly", "lbl_contactYourFriendsFamilly2": "the easy way, with the best Quality and at Lowest Prices.", "lbl_accountBalance": "Available Balance", "btn_continue": "Continue", "lbl_secureRecharge": "Make secure payments - 128-bit SSL secure and encrypted payment." });
		topUpOptionsHome = "top_up_options_en.html";
	} else {
		h = new HashTable({"lbl_accessNbrExists": "Número Acceso Guardado!", "settings_opt2_sub": "Para editar tu número de Acceso", "settings_opt2": "Número de Acceso", "settings_opt1_sub": "Actualiza tu cuenta aquí", "settings_opt1": "Información de Cuenta", "lbl_accessNumberSavedFailed": "Error al guardar el número", "lbl_accessNumberSavedSuccess": "Número guardado correctamente!", "accessNumberLog": "RingVoz - Número de Acceso", "lbl_errorCalling": "Error llamando a este número", "lbl_accessNbrSetupTitle": "Número de Acceso", "btn_addContactNbr": "Agregar", "lbl_directDialAddNumberSubTitle": "Agregar nuevo número","btn_addDirectDialNbr": "Agregar Número", "lbl_numberLeftToRegister": "Tienes 2 números registrado de 10 disponibles", "lbl_directDialMyNumbers": "Mis Números", "lbl_addAccessNumber_sub": "Selecciona el número de acceso que prefieras", "lbl_directDialContactLst_sub": "Selecciona un número para Llamar o Actualizar", "lbl_directDial_sub": "Agrega hasta 10 números locales y tus llamadas se conectaran automaticamente", "lbl_lgTag": "", "lbl_inputYourEmail": "Ingresa tu correo electrónico", "drp_addCreditCard": "Agregar una Tarjeta", "lbl_visitHelpCenter": "Visita Nuestro Centro de Ayuda", "lbl_callUsNow": "Llamanos Ahora", "lbl_haveQuestions": "TIENES PREGUNTAS", "lbl_support": "Ayuda", "lbl_others": "Otros...", "lbl_ifYouDontHaveFavoriteShop4": "recargar tu cuenta.", "lbl_ifYouDontHaveFavoriteShop3": "la mas cercana para", "lbl_ifYouDontHaveFavoriteShop2": "localiza aquí", "lbl_ifYouDontHaveFavoriteShop": "Si no tienes una tienda favorita,", "lbl_rechargeWithPinfromShop2": "por tu tienda", "lbl_rechargeWithPinfromShop": "Recarga aquí con el PIN otorgado", "lbl_rechargeAccountForInternational2": "siempre estarás conectado con tus seres queridos", "lbl_rechargeAccountForInternational": "Recarga tu cuenta para llamadas internacionales y", "lbl_whenBalanceLess": "cuando tu saldo sea $5 o menos", "lbl_selectAutoRechargeAmount": "Selecciona el valor de recarga automático", "lbl_alwaysStayConnected": "Para que nunca dejes de estar conectado", "lbl_autoRecharge": "Auto Recargar", "lbl_rinvozConnectsYou": "RingVoz Te Conecta con el Mundo", "lbl_toCall": "Para llamar marque", "lbl_accountRechargedWith": "Su cuenta fue recargada con", "lbl_accountUpdateFailed": "Error al actualizar su cuenta", "lbl_accountUpdatedSuccess": "Cuenta actualizada exitosamente", "lbl_wrongInfoProvided": "Información incorrecta", "btn_myAccountRecharge": "Recargar tu Cuenta", "btn_topUpRecharge": "Recargar Top-up", "lbl_whatDoYouWantToDo": "Que deseas hacer ahora", "lbl_cardAddSuccessfuly": "Tarjeta Agregada Exitosamente", "lbl_activated": "activada", "lbl_autoRechargeAmoutConfirm": "Auto Recarga por", "lbl_confirmRecharge": "Confirma tu recarga", "btn_recharge": "Recargar", "lbl_totalValue": "Valor total", "lbl_taxes": "Cargos regulatorios", "lbl_paymentMethodCardNbr": "No. de tarjeta", "lbl_paymentMethod": "Método de pago", "lbl_cellNumber": "Número de celular", "lbl_operator": "Operador", "lbl_numbers": " números", "lbl_example": "Ejemplo:", "lbl_selectCountryOpTitle2": "recarga móvil", "lbl_selectCountryOpTitle1": "Selecciona el país y el operador para realizar la", "lbl_year": "Año", "lbl_month": "Mes", "btn_addCard": "Agregar", "lbl_myAccountHistory": "Historial de mi Cuenta", "lbl_rechargeToNbr": "Recarga al", "lbl_transAmount": "Monto", "lbl_desc": "Descripción", "lbl_date": "Fecha", "btn_funds": "Fondos", "btn_topUp": "Top Up", "lbl_transactionsHistory": "Transacciones", "lbl_invalidNbr": "Número no válido.", "lbl_errorGettingBalance": "Error al obtener tu saldo.", "lbl_transactionDeclined": "Tu transacción ha declinado.", "lbl_transactionSuccessful": "Transacción realizada exitosamente!", "lbl_selectAnAmount": "Selecciona el valor.", "lbl_cardNotValid": "Tarjeta de crédito no válida.", "lbl_loadingCards": "Cargando tus tarjetas...", "btn_yesPlease": "Si, por favor!", "btn_noThanks": "No, Gracias", "lbl_addOneCardNow": "Te gustaria agregar una ahora?", "lbl_noCCorDebitCardRegistered": "No tienes tarjeta de crédito o débito registrada!", "lbl_incorrectNumber": "Cantidad de números incorrecta.", "btn_close": "Cerrar", "lbl_pinNotValid": "PIN no válido.", "lbl_processingTransaction": "Procesando tu Transacción...", "lbl_registeringCard": "Agregando tu Tarjeta...", "lbl_updatingAccount": "Actualizando tu Cuenta...", "lbl_validatingPin": "Validando tu PIN...", "lbl_pinBalance": "Balance PIN", "btn_rechargeNow": "Recargar", "btn_validatePin": "Validar", "lbl_rechargeValue": "Valor a recargar", "lbl_accountRecharge": "Recarga tu cuenta", "lbl_paymentMethods": "Métodos de Pago", "btn_save": "Guardar", "lbl_email": "Correo Electrónico", "lbl_postalCode": "Código Postal", "lbl_country": "País", "lbl_state": "Estado", "lbl_city": "Cuidad", "lbl_address": "Dirección", "lbl_nameLastName": "Nombres/Apellidos", "lbl_accNbr": "Número de tu cuenta", "lbl_selectOperator": "Selecciona el operador", "lbl_selectCountry": "Selecciona el país", "lbl_termsAndContions": "Términos y Condiciones.", "btn_proceed": "Continuar", "btn_back": "Regresar", "lbl_cellNumberToRecharge": "Número del celular que desea recargar:", "lbl_selectValue": "Selecciona el valor", "lbl_selectedOperator": "Operador Seleccionado:", "lbl_selectedCountry": "País Seleccionado:", "lbl_interTopUp_sub": "Recarga Internacional Top-Up", "lbl_mainMenu": "Menú Principal", "lbl_configuration": "Configuración", "lbl_support": "Ayuda", "home_opt1": "Recarga Móvil Top-up", "home_opt1_desc": "Realiza recargas de celulares", "home_opt2": "Recarga tu Cuenta", "home_opt2_desc": "Para tus llamadas internacionales", "home_opt3": "Tarjeta Crédito o Débito", "home_opt3_desc": "Agregar una tarjeta de crédito", "home_opt4": "Historial de mi Cuenta", "home_opt4_desc": "Ver historial de transacciones", "home_opt5": "Marcación Directa", "home_opt5_desc": "Llama con un solo toque", "home_opt6_notsetup": "Elejir Número de Acceso", "home_opt6_notsetup_desc": "Llama en cualquier parte del mundo", "home_opt6": "Número de Acceso", "home_opt6_desc": "Llama a cualquier parte del mundo", "lbl_welcomeToRingVoz": "Bienvenido a RingVoz", "lbl_contactYourFriendsFamilly": "Puedes comunicarte con tus Amigos y Familiares", "lbl_contactYourFriendsFamilly2": "de forma Fácil, con la mejor Calidad y al menor Precio.", "lbl_accountBalance": "Balance disponible", "btn_continue": "Continuar", "lbl_secureRecharge": "Realiza tu pago con seguridad - 128-bit SSL pago seguro y encriptado."});
		topUpOptionsHome = "top_up_options.html";
	}
	$scope.lg = {
		get: function(k) {
			return h.getItem(k);
		}
	};

	
    $scope.showLoading = function(dPanel,timeOut) {
        if (_platformId == 'android' && !d) {
            
           // $scope.showLoading('',100);
    		spinnerplugin.show({
				overlay: true,    // defaults to true
				timeout:timeOut
			}); 
		} else {
            if (dPanel != '') {
    	        $scope.show(dPanel);
            }
		}
        
    }


    $scope.callNumber = function(n) {
		if (_platformId == 'android' && !d) {
			try {
				phonedialer.dial(n, 
    				function(err) {
    				if (err == "empty") $scope.show('alerts/errorCalling.html');
    					else $scope.show('alerts/errorCalling.html');
    					return false;
    				},
					function(success) { 
						return true;
					}
				);    
			}
			catch(err) {
				//$scope.show('smsCodeInputValidation.html');
				window.open("tel:" + n, '_system');
			}
		} else {
			window.open("tel:" + n, '_system');
				return true;
		}        
	}




    $scope.hideLoading = function() {
        if (_platformId == 'android' && !d) {
			spinnerplugin.hide(); 
		} else {
            try {
				dialog.hide();
			}
			catch(err) {
			}
		}
    }
	
	$scope.rechargeDetails = {
	    inRechargeProcess: function(isInRechargeProcess) {
	    	if (angular.isDefined(isInRechargeProcess)) {
	    		_hideTabsForRecharge = parseInt(isInRechargeProcess);
	    	}
	    	return _hideTabsForRecharge;
	    },	
	    destinationNumber: function(newDestinationNumber) {
	    	if (angular.isDefined(newDestinationNumber)) {
	    		_destinationNumber = parseInt(newDestinationNumber);
	    	}
	    	return parseInt(_destinationNumber);
	    },
	    rechargeAmount: function(newRechargeAmount) {
	    	if (angular.isDefined(newRechargeAmount)) {
	    		_rechargeAmount = newRechargeAmount;
	    	}
	    	return _rechargeAmount;	    	
	    },
	    rechargeAmountTotal: function(newRechargeAmountTotal) {
	    	if (angular.isDefined(newRechargeAmountTotal)) {
	    		_rechargeAmountTotal = newRechargeAmountTotal;
	    	}
	    	return _rechargeAmountTotal;	    	
	    },
	    rechargeAmountCurrencyValue: function(newRechargeAmountCurrencyValue) {
	    	if (angular.isDefined(newRechargeAmountCurrencyValue)) {
	    		_rechargeAmountCurrencyValue = newRechargeAmountCurrencyValue;
	    	}
	    	return _rechargeAmountCurrencyValue;	    	
	    },
	    regulatoryCharges: function(newRegulatoryCharges) {
	    	if (angular.isDefined(newRegulatoryCharges)) {
	    		_regulatoryCharges = newRegulatoryCharges;
	    	}
	    	return _regulatoryCharges;	    	
	    },	    
	    country: function(newCountry, newCountryCode) {
	    	if (angular.isDefined(newCountry)) {
	    		_countryCode = newCountryCode;
				_country = newCountry;
				_selectedCountryFlag = 'images/Top-up-Images/countries/' + angular.lowercase(_countryCode) + '.png';
	    	}
	    	return _country;	    	
	    },
	    operator: function(newOperator,newOperatorCode) {
	    	if (angular.isDefined(newOperator)) {
	    		_operator = newOperator;
	    		_opCode = newOperatorCode;
	    		if (newOperator == 'Virgin Mobile' || newOperator == 'UNE' || newOperator == 'Uff Movil' || newOperator == 'ETB' || newOperator == 'Claro' || newOperator == 'Cubacel' || newOperator == 'Digicel' || newOperator == 'Entel' || newOperator == 'Movistar' || newOperator == 'Orange' || newOperator == 'Red' || newOperator == 'Telcel' || newOperator == 'Tigo' || newOperator == 'Tricom' || newOperator == 'Viva') {
	    			_selectedOperatorLogo = 'images/Top-up-Images/mobileOperators/' + _operator + '.png';
	    		} else {
	    			_selectedOperatorLogo = 'images/Top-up-Images/mobileOperators/blank.png';
	    		}				
	    	}
	    	return _operator;	    	
	    },
	    ccFirstName: function(newCcFirstName) {
	    	if (angular.isDefined(newCcFirstName)) {
	    		_ccFirstName = newCcFirstName;
	    	}
			return _ccFirstName;
	    },
	    ccLastName: function(newCcLastName) {
	    	if (angular.isDefined(newCcLastName)) {
	    		_ccLastName = newCcLastName;
	    	}
			return _ccLastName;  	
	    },
	    ccAddress: function(newCcAddress) {
	    	if (angular.isDefined(newCcAddress)) {
	    		_ccAddress = newCcAddress;
	    	}
		  return _ccAddress;	    	
	    },
	    ccCity: function(newCcCity) {
	    	if (angular.isDefined(newCcCity)) {
	    		_ccCity = newCcCity;
	    	}
		  return _ccCity;	    	
	    },
	    ccState: function(newCcState) {
	    	if (angular.isDefined(newCcState)) {
	    		_ccState = newCcState;
	    	}
		  return _ccState;	    	
	    },
	    ccZipCode: function(newCcZipCode) {
	    	if (angular.isDefined(newCcZipCode)) {
	    		_ccZipCode = newCcZipCode;
	    	}
		  return _ccZipCode;	    	
	    },
	    ccCountry: function(newCcCountry,newCcCountryName) {
	    	if (angular.isDefined(newCcCountry)) {
	    		_ccCountry = newCcCountry;
				_ccCountryName = newCcCountryName;
	    	}
		  return _ccCountryName;	    	
	    },	    
	    paymentMethod: function(newPaymentMethod) {
	    	if (angular.isDefined(newPaymentMethod)) {
	    		_paymentMethod = newPaymentMethod;
				if (angular.equals('Visa', newPaymentMethod)) {
					_paymentMethodId = 66;
				} else if (angular.equals('Mastercard', newPaymentMethod)) {
					_paymentMethodId = 67;
				} else if (angular.equals('American Express', newPaymentMethod)) {
					_paymentMethodId = 68;
				} else {
					_paymentMethodId = 69;
				}
	    	}
			return _paymentMethod;	    	
	    },
	    ccNumber: function(newCcNumber, trunc) {
	    	if (angular.isDefined(newCcNumber)) {
	    		_ccNumber = parseInt(newCcNumber);
				
	    		var trunc = 'XXXX-XXXX-XXXX-' + newCcNumber.toString().substr(newCcNumber.toString().length - 4);
	    		_ccNumberTrunc = trunc;
				_paymentMethodId = 
					 (/^5[1-5]/.test(newCcNumber.toString())) ? 67
					 : (/^4/.test(newCcNumber.toString())) ? 66
					 : (/^3[47]/.test(newCcNumber.toString())) ? 68
					 : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(newCcNumber.toString())) ? 69
					 : 0;
	    		_paymentMethod =
	                 (/^5[1-5]/.test(newCcNumber.toString())) ? "Mastercard"
	                 : (/^4/.test(newCcNumber.toString())) ? "Visa"
	                 : (/^3[47]/.test(newCcNumber.toString())) ? 'American Express'
	                 : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(newCcNumber.toString())) ? 'Discover'
	                 : '';
	    	}
	    	if (angular.isDefined(trunc)) {
	    		return _ccNumberTrunc;	   
	    	} else {
	    		return parseInt(_ccNumber);
	    	}
		   	
	    },
	    ccExpDateMonth: function(newCcExpDateMonth) {
	    	if (angular.isDefined(newCcExpDateMonth)) {
	    		_ccExpDateMonth = newCcExpDateMonth;
	    	}
		  return _ccExpDateMonth;	    	
	    },
	    ccExpDateYear: function(newCcExpDateYear) {
	    	if (angular.isDefined(newCcExpDateYear)) {
	    		_ccExpDateYear = newCcExpDateYear;
	    	}
		  return _ccExpDateYear;	    	
	    },
	    cvv: function(newCvv) {
	    	if (angular.isDefined(newCvv)) {
	    		_cvv = newCvv;
	    	}
	    	return _cvv;	    	
	    },
	    registeredCcId: function(newRegisteredCcId) {
	    	if (angular.isDefined(newRegisteredCcId)) {
	    		_registeredCcId = newRegisteredCcId;
	    	}
	    	return _registeredCcId;	    	
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
	    accountBalanceLed: function() {
			if ($scope.parseFloat(_accountBalance) >= 1.0) {
				_accBalanceLed = 'images/greenBallAlert.png';
			} else if ($scope.parseFloat(_accountBalance) >= 0.5 && $scope.parseFloat(_accountBalance) < 1.0 ) {
				_accBalanceLed = 'images/orangeBallAlert.png';
			} else {
				_accBalanceLed = 'images/redBallAlert.png';
			}
	    	return _accBalanceLed;
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
	    	
	    },
	    destinationNumberLength: function(newDestinationNbrLength) {
	    	if (angular.isDefined(newDestinationNbrLength)) {
	    		_destinationNumberLength = newDestinationNbrLength;
	    	}
	    	return _destinationNumberLength;
	    },
	    destNbrPattern: function(newDestinationNbrPattern) {
	    	if (angular.isDefined(newDestinationNbrPattern)) {
	    		_destinationNbrPattern = newDestinationNbrPattern;
	    	}
		  return _destinationNbrPattern;	    	
	    },		
	    validateNbr: function() {
	    	if (_destinationNumber.toString().length == _destinationNumberLength) {
				if ($scope.rechargeDetails.rechargeAmount() == "") {
					$scope.show("invalidAmount.html");
				} else {
					$scope.show('topUpTransactionDetails.html');
				}
	    	} else {
			    $scope.show("destNumberWrong.html");
			}
	    	return false;
	    },
	    isPromotionActive: function(newActivePromotion) {
	    	if (angular.isDefined(newActivePromotion)) {
	    		_isPromotionActive = newActivePromotion;
	    	}
			return _isPromotionActive;
	    },
	    rechargeAmountsOpt: function(newRechargeAmountsOpt) {
	    	if (angular.isDefined(newRechargeAmountsOpt)) {
	    		_rechargeAmounts = newRechargeAmountsOpt;
	    	}
			return _rechargeAmounts;
			//return [{"name":"6.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"7.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"8.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"9.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"10.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"11.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"12.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"13.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"14.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"15.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"16.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"17.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"18.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"19.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"20.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"21.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"26.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"31.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"36.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"41.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"51.00","INFO2":"0.99","MODAL":"GETAMRI"},{"name":"61.00","INFO2":"0.99","MODAL":"GETAMRI"}];
	    },
	    isAutoRechargeActivated: function(isAutoRechargeActivated) {
	    	if (angular.isDefined(isAutoRechargeActivated)) {
				localStorage.isAutoRechargeActivated = isAutoRechargeActivated;
	    		_autoRechargeActivated = isAutoRechargeActivated;
	    	}
			return _autoRechargeActivated;
	    },
	    autoRechargeAmount: function(autoRechargeAmount) {
	    	if (angular.isDefined(autoRechargeAmount)) {
				localStorage.autoRechargeAmount = autoRechargeAmount;
				_autoRechargeAmount = autoRechargeAmount;
	    	}
			return _autoRechargeAmount;
	    },
	    userCreditCards: function(userCreditCardsList) {
	    	if (angular.isDefined(userCreditCardsList)) {
				_userCreditCardsList = userCreditCardsList;
	    	}
			return _userCreditCardsList;
		},
	    setBackToRechargeAccount: function(setBackToRechargeAccount) {
	    	if (angular.isDefined(setBackToRechargeAccount)) {
				_setBackToRechargeAccount = setBackToRechargeAccount;
	    	}
			return _setBackToRechargeAccount;
		},
	    rechargeAccountCcDisplay: function(rechargeAccountCcDisplay) {
	    	if (angular.isDefined(rechargeAccountCcDisplay)) {
				_rechargeAccountCcDisplay = rechargeAccountCcDisplay;
	    	}
			return _rechargeAccountCcDisplay;
		},
	    tripplePayPin: function(newTripplePayPin) {
	    	if (angular.isDefined(newTripplePayPin)) {
				_tripplePayPin = newTripplePayPin;
	    	}
			return _tripplePayPin;
		},
	    pinBalance: function(newPinBalance) {
	    	if (angular.isDefined(newPinBalance)) {
				_newPinBalance = newPinBalance;
	    	}
			return _newPinBalance;
	    }
	};
	
 
	
	$scope.sendEmail = function(s, b, t) {
		$http({
			url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
			method: "POST",
			data: serializeData({subject: s, body: b, to: t}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
			}).
			success(function(data, status, headers, config) {
				if (data.response == 'send') {
					return true;
				} else {
					return false;
				}
			}).
			error(function(data, status, headers, config) {
				return false;
			});  	
	}
	/*
	if (_sendRegistrationCompleteEmail == 1) {
		$scope.sendEmail(
							'RingVoz Mobile App - Registration Completada',
							'<br>Cliente ha completado su registro exitosamente<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>Ref Id:' + localStorage.refId + '<br>Correo:' + localStorage.email,
							'ppronovost@ringvoz.com'
							//'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'
						 );
		localStorage.sendRegistrationCompleteEmail = 0;
	}
	*/
	$scope.gotoAnchor = function(x) {

	 if (_platformId == 'android') {
		  var newHash = 'anchor' + x;
		  if ($location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash('anchor' + x);
		  } else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			$anchorScroll();
		  }
	  }
    };
	
	$scope.hideTabs = _doRecharge;
	
	$scope.setCcCardInfo = function () {
		if ($scope.rechargeDetails.userName() != '') {
			$scope.rechargeDetails.ccFirstName($scope.rechargeDetails.userName());
		}
		if ($scope.rechargeDetails.userLastName() != '') {
			$scope.rechargeDetails.ccLastName($scope.rechargeDetails.userLastName());
		}
		if ($scope.rechargeDetails.userAddress() != '') {
			$scope.rechargeDetails.ccAddress($scope.rechargeDetails.userAddress());
		}
		if ($scope.rechargeDetails.userCity() != '') {
			$scope.rechargeDetails.ccCity($scope.rechargeDetails.userCity());
		}
		if ($scope.rechargeDetails.userState() != '') {
			$scope.rechargeDetails.ccState($scope.rechargeDetails.userState());
		}
		if ($scope.rechargeDetails.userZipCode() != '') {
			$scope.rechargeDetails.ccZipCode($scope.rechargeDetails.userZipCode());
		}		
	};
	
	
	$scope.cancelTopUpAddingCard = function () {
		$scope.hideTabs = false;
		_doRecharge = false;	
		dialog.hide();
	}
	
	$scope.doRecharge = function (){
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {			
			$scope.hideTabs = true;
			_doRecharge = true;
			try {
				dialog.hide();
			}
			catch(err) {
			}
			if (_userCreditCardsList.length <= 1) {
				$scope.show("TopUpNoCreditCardRegistered.html");
				//$scope.setCcCardInfo();
				//myNavigator.pushPage('page3.html', { animation : 'slide' } );
			} else {
				//window.analytics.trackView('Initiating International TopUp');
				myNavigator.pushPage('page1.html', { animation : 'slide' } );
			}
			
			
			
		}
	}
	
	$scope.viewTransactionHistory = function (){
        if (!d) {
	    	window.analytics.trackView('Viewing Transactions History');
        }
        myNavigator.pushPage('transactionsHistory.html', { animation : 'slide' } );
        //console.log(myNavigator.getCurrentPage().options.animation);
	}

	$scope.displayPaymentMethodOptions = function() {
		$scope.hideTabs = true;
		_doRecharge = true;
		//$scope.show('paymentMethods.html');
		//$scope.getUserCreditCardsList();
		myNavigator.pushPage('paymentMethods.html', { animation : 'slide' } );
	}
	
	$scope.addCreditCard = function() {
		$scope.hideTabs = true;
		_doRecharge = true;
		$scope.setCcCardInfo();
		myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );
	}

	$scope.registerCreditCardNow = function() {
		dialog.hide();
		$scope.rechargeDetails.setBackToRechargeAccount(true);
		$scope.setCcCardInfo();
		myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );
	}

	$scope.registerTopUpCreditCardNow = function() {
		dialog.hide();
		$scope.setCcCardInfo();
		myNavigator.pushPage('page3.html', { animation : 'slide' } );
	}
	
	$scope.displayAutoRechargeAmounts = 'none';
	$scope.displayAutoRechargeTitle = 'none';
	$scope.onOff = 'Off';
	$scope.onOffChecked = false;
	
	$scope.showHideAutoRechargeSections = function () {
		if ($scope.displayAutoRechargeAmounts == 'none') {
			$scope.displayAutoRechargeAmounts = 'visible';
			$scope.displayAutoRechargeTitle = 'visible';
			$scope.onOff = 'On';
			$scope.onOffChecked = true;
			_accountRechargeConfirmDisplay = 'rechargeTransactionDetailsWithAutoRecharge.html';
			$scope.rechargeDetails.isAutoRechargeActivated(true);
			$scope.rechargeDetails.autoRechargeAmount(_autoRechargeAmount);
		} else {
			$scope.displayAutoRechargeAmounts = 'none';
			$scope.displayAutoRechargeTitle = 'none';		
			$scope.onOff = 'Off';
			$scope.onOffChecked = false;
			_accountRechargeConfirmDisplay = 'rechargeTransactionDetails.html';
			$scope.rechargeDetails.isAutoRechargeActivated(false);
			//$scope.rechargeDetails.autoRechargeAmount(0);
		}
	}

	$scope.creditCardRechargeAmounts = [{"name":$scope.lg.get("lbl_others")},{"name":"25"},{"name":"30"},{"name":"35"},{"name":"40"},{"name":"45"},{"name":"50"},{"name":"100"}];
	$scope.pinRechargeAmounts = [{"name":$scope.lg.get("lbl_others")},{"name":"1"},{"name":"2"},{"name":"3"},{"name":"4"},{"name":"5"},{"name":"6"},{"name":"7"},{"name":"8"},{"name":"9"},{"name":"25"},{"name":"30"},{"name":"35"},{"name":"40"},{"name":"45"},{"name":"50"},{"name":"100"}];
	$scope.myCcRechargeAmount = $scope.creditCardRechargeAmounts[0];
	$scope.myPinRechargeAmount = $scope.pinRechargeAmounts[0];
	
	$scope.rechargeAmount10src = _rechargeAmount10SelectedImgSrc;
    $scope.rechargeAmount15src = _rechargeAmount15SelectedImgSrc;
    $scope.rechargeAmount20src = _rechargeAmount20SelectedImgSrc;

	$scope.selectPinAmountRechargeFromList = function() {
		_rechargeAmount10SelectedImgSrc = 'images/10.png';
		_rechargeAmount15SelectedImgSrc = 'images/15.png';
		_rechargeAmount20SelectedImgSrc = 'images/20.png';
		
		$scope.rechargeAmount10src = _rechargeAmount10SelectedImgSrc;
		$scope.rechargeAmount15src = _rechargeAmount15SelectedImgSrc;
		$scope.rechargeAmount20src = _rechargeAmount20SelectedImgSrc;
		
		// Set amounts
		$scope.rechargeDetails.rechargeAmount(parseInt($scope.myPinRechargeAmount.name).toFixed(2 || 0));
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));
		
		//$scope.listCreditCards();
	}

	$scope.selectPinAmountRechargeFromImg = function (amountSelected, img) {
		$scope.myPinRechargeAmount = $scope.pinRechargeAmounts[0];
		
		_rechargeAmount10SelectedImgSrc = 'images/10.png';
		_rechargeAmount15SelectedImgSrc = 'images/15.png';
		_rechargeAmount20SelectedImgSrc = 'images/20.png';
		
		$scope.rechargeAmount10src = _rechargeAmount10SelectedImgSrc;
		$scope.rechargeAmount15src = _rechargeAmount15SelectedImgSrc;
		$scope.rechargeAmount20src = _rechargeAmount20SelectedImgSrc;
		
		if (amountSelected == 10) {
			$scope.rechargeAmount10src = img;
			_rechargeAmount10SelectedImgSrc = img;
		}
		if (amountSelected == 15) {
			$scope.rechargeAmount15src = img;
			_rechargeAmount15SelectedImgSrc = img;
		}
		if (amountSelected == 20) {
			$scope.rechargeAmount20src = img;
			_rechargeAmount20SelectedImgSrc = img;
		}	

		// Set amounts
		$scope.rechargeDetails.rechargeAmount((amountSelected).toFixed(2 || 0));
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));
		
		//$scope.listCreditCards();
	}
	
	$scope.selectCcAmountRechargeFromList = function() {
		_rechargeAmount10SelectedImgSrc = 'images/10.png';
		_rechargeAmount15SelectedImgSrc = 'images/15.png';
		_rechargeAmount20SelectedImgSrc = 'images/20.png';
		
		$scope.rechargeAmount10src = _rechargeAmount10SelectedImgSrc;
		$scope.rechargeAmount15src = _rechargeAmount15SelectedImgSrc;
		$scope.rechargeAmount20src = _rechargeAmount20SelectedImgSrc;
		
		// Set amounts
		$scope.rechargeDetails.rechargeAmount(parseInt($scope.myCcRechargeAmount.name).toFixed(2 || 0));
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));
		
		//$scope.listCreditCards();
	}

	$scope.selectCcAmountRechargeFromImg = function (amountSelected, img) {
		$scope.myCcRechargeAmount = $scope.creditCardRechargeAmounts[0];
		
		_rechargeAmount10SelectedImgSrc = 'images/10.png';
		_rechargeAmount15SelectedImgSrc = 'images/15.png';
		_rechargeAmount20SelectedImgSrc = 'images/20.png';
		
		$scope.rechargeAmount10src = _rechargeAmount10SelectedImgSrc;
		$scope.rechargeAmount15src = _rechargeAmount15SelectedImgSrc;
		$scope.rechargeAmount20src = _rechargeAmount20SelectedImgSrc;
		
		if (amountSelected == 10) {
			$scope.rechargeAmount10src = img;
			_rechargeAmount10SelectedImgSrc = img;
		}
		if (amountSelected == 15) {
			$scope.rechargeAmount15src = img;
			_rechargeAmount15SelectedImgSrc = img;
		}
		if (amountSelected == 20) {
			$scope.rechargeAmount20src = img;
			_rechargeAmount20SelectedImgSrc = img;
		}	

		// Set amounts
		$scope.rechargeDetails.rechargeAmount((amountSelected).toFixed(2 || 0));
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));
		
		//$scope.listCreditCards();
	}
	
	$scope.img10src = _auto10SelectedImgSrc;
	$scope.img15src = _auto15SelectedImgSrc;
	$scope.img20src = _auto20SelectedImgSrc;
	$scope.img30src = _auto30SelectedImgSrc;
	$scope.img40src = _auto40SelectedImgSrc;
	$scope.img50src = _auto50SelectedImgSrc;
	$scope.switchAutoRechargeAmount = function (amountSelected, img) {
		_auto10SelectedImgSrc = 'images/10.png';
		_auto15SelectedImgSrc = 'images/15.png';
		_auto20SelectedImgSrc = 'images/20.png';
		_auto30SelectedImgSrc = 'images/30.png';
		_auto40SelectedImgSrc = 'images/40.png';
		_auto50SelectedImgSrc = 'images/50.png';		
		 
		$scope.img10src = _auto10SelectedImgSrc;
		$scope.img15src = _auto15SelectedImgSrc;
		$scope.img20src = _auto20SelectedImgSrc;
		$scope.img30src = _auto30SelectedImgSrc;
		$scope.img40src = _auto40SelectedImgSrc;
		$scope.img50src = _auto50SelectedImgSrc;
	
		if (amountSelected == 10) {
			$scope.img10src = img;
			_auto10SelectedImgSrc = img;
		}
		if (amountSelected == 15) {
			$scope.img15src = img;
			_auto15SelectedImgSrc = img;
		}
		if (amountSelected == 20) {
			$scope.img20src = img;
			_auto20SelectedImgSrc = img;
		}
		if (amountSelected == 30) {
			$scope.img30src = img;
			_auto30SelectedImgSrc = img;
		}
		if (amountSelected == 40) {
			$scope.img40src = img;
			_auto40SelectedImgSrc = img;
		}
		if (amountSelected == 50) {
			$scope.img50src = img;
			_auto50SelectedImgSrc = img;
		}
		$scope.rechargeDetails.autoRechargeAmount(amountSelected.toFixed(2 || 0));
	}
	
	$scope.ccClass = _ccClass;

	$scope.userCreditCardsList = $scope.rechargeDetails.userCreditCards();

	$scope.popCreditCardRegistrationPage = function () {
		_popCreditCardRegistrationPage = true;
	}
	
	
	$scope.selectCreditCard = function () {

		try {
			if ($scope.choosenCard.INFO4 == '67') {
				_ccClass = 'custom-dropdown-cardmastercard';
				_paymentMethod = 'Mastercard';
			} else if ($scope.choosenCard.INFO4 == '66') {
				_ccClass = 'custom-dropdown-cardvisa';
				_paymentMethod = 'Visa';
			}  else if ($scope.choosenCard.INFO4 == '68') {
				_ccClass = 'custom-dropdown-cardamerexpress';
				_paymentMethod = 'American Express';
			}  else if ($scope.choosenCard.INFO4 == '69') {
				_ccClass = 'custom-dropdown-carddiscover';
				_paymentMethod = 'Discover';
			} else {
				_ccClass = "custom-dropdown-cardslist";
				_paymentMethod = '';
			}
			$scope.ccClass = _ccClass;
			
			// Set card choosen card id
			$scope.rechargeDetails.registeredCcId($scope.choosenCard.INFO1);	

			
		   // _ccNumberTrunc = 'XXXX-XXXX-XXXX-' + $scope.choosenCard.INFO3;
			$scope.rechargeDetails.rechargeAccountCcDisplay($scope.choosenCard.INFO3);
			//alert($scope.rechargeDetails.rechargeAccountCcDisplay());
			//$scope.rechargeDetails.ccNumber(undefined,true);
			
			if (_popCreditCardRegistrationPage == true && $scope.choosenCard.INFO4 == '') {
					$scope.rechargeDetails.setBackToRechargeAccount(true);
					_popCreditCardRegistrationPage = false;
					$scope.setCcCardInfo();
					myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );
			}	 			
        }
        catch(err) {
			$scope.rechargeDetails.setBackToRechargeAccount(true);
			_popCreditCardRegistrationPage = false;
			myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );		
        }
 

	}

	$scope.selectTopUpCreditCard = function () {

		try {
			if ($scope.choosenCard.INFO4 == '67') {
				_ccClass = 'custom-dropdown-cardmastercard';
				_paymentMethod = 'Mastercard';
			} else if ($scope.choosenCard.INFO4 == '66') {
				_ccClass = 'custom-dropdown-cardvisa';
				_paymentMethod = 'Visa';
			}  else if ($scope.choosenCard.INFO4 == '68') {
				_ccClass = 'custom-dropdown-cardamerexpress';
				_paymentMethod = 'American Express';
			}  else if ($scope.choosenCard.INFO4 == '69') {
				_ccClass = 'custom-dropdown-carddiscover';
				_paymentMethod = 'Discover';
			} else {
				_ccClass = "custom-dropdown-cardslist";
				_paymentMethod = '';
			}
			$scope.ccClass = _ccClass;
			
			// Set card choosen card id
			$scope.rechargeDetails.registeredCcId($scope.choosenCard.INFO1);	

			
		    //_ccNumberTrunc = 'XXXX-XXXX-XXXX-' + $scope.choosenCard.INFO3;
			$scope.rechargeDetails.rechargeAccountCcDisplay($scope.choosenCard.INFO3);
			//alert($scope.rechargeDetails.rechargeAccountCcDisplay());
			//$scope.rechargeDetails.ccNumber(undefined,true);
			
			if ($scope.choosenCard.INFO4 == '') {
					$scope.setCcCardInfo();
					myNavigator.pushPage('page3.html', { animation : 'slide' } );
			}	 			
        }
        catch(err) {
			myNavigator.pushPage('page3.html', { animation : 'slide' } );		
        }
 

	}
    
    
	
	$scope.listCreditCards = function () {
		$scope.rechargeDetails.autoRechargeAmount(20.00);
		_userCreditCardsList = [{"MODAL":"GET","INFO1":"","INFO2":"","INFO3":$scope.lg.get("drp_addCreditCard"),"INFO4":"","INFO5":"","INFO6":"0"}];
		$scope.userCreditCardsList = [{"MODAL":"GET","INFO1":"","INFO2":"","INFO3":$scope.lg.get("drp_addCreditCard"),"INFO4":"","INFO5":"","INFO6":"0"}];

    //$http.jsonp('https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
  //  $http.jsonp('https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n + '?callback=JSON_CALLBACK').
		$http.get('https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
			success(function(data, status, headers, config) {

				if (angular.isObject(data.cards) && data.cards.length > 0) {
					for (i=0;i<data.cards.length;i++) {
						data.cards[i].INFO3 = 'XXXX-XXXX-XXXX-' + data.cards[i].INFO3;
					}
					
					_userCreditCardsList = data.cards;
					_userCreditCardsList.push({"MODAL":"GET","INFO1":"","INFO2":"","INFO3":$scope.lg.get("drp_addCreditCard"),"INFO4":"","INFO5":"","INFO6":"0"});
                    //_userCreditCardsList.push({"MODAL":"GET","INFO1":"4444","INFO2":"","INFO3":"XXXX-XXXX-XXXX-9999","INFO4":"68","INFO5":"","INFO6":"0"});
					$scope.userCreditCardsList = _userCreditCardsList;
				
					$scope.choosenCard = $scope.userCreditCardsList[0];
					$scope.selectCreditCard();
					
				} else {
					$scope.choosenCard = $scope.userCreditCardsList[0];
					$scope.selectCreditCard();
				}
		}).
		error(function(data, status, headers, config) {
          //  alert(status);
		//	myNavigator.pushPage('error_404.html', { animation : 'slide' } );
		});	
	}
	
	if (_userCreditCardsList.length == 0) {
		$scope.listCreditCards();
	} 
	
	$scope.addCardToAPM = function () {
		if ($scope.validateTransactionDetails()) {
            $scope.showLoading('registeringCreditCard.html',100);            
            
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({refid: localStorage.refId, name: _ccFirstName + ' ' + _ccLastName, type: _paymentMethodId, cardnumber: _ccNumber, cvv: _cvv, month: _ccExpDateMonth, year: _ccExpDateYear, country: _ccCountry, state: _ccState, city: _ccCity, address: _ccAddress, zip: _ccZipCode}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
        		  success(function(data, status, headers, config) {
        		    $scope.hideLoading();

    				if (data.response.INFO2 != "0") {
    					$scope.rechargeDetails.registeredCcId(data.response.INFO2);
    					return true;
    				} else {
    					$scope.show("invalidCreditCard.html");
    					return false;
    				}
    			  }).
    			  error(function(data, status, headers, config) {
          			$scope.hideLoading();
    				myNavigator.pushPage('error_404.html', { animation : 'slide' } );
    			  });           				
		} else {
			$scope.show("ccWrongInfoProvided.html");
			return false;
		}
	}
	
	$scope.registerNewCard = function () {
		if ($scope.addCardToAPM()) {
			if ($scope.rechargeDetails.setBackToRechargeAccount() == true) {						
				$scope.rechargeDetails.setBackToRechargeAccount(false);
				myNavigator.pushPage('rechargeCreditCard.html', { animation : 'slide' } );
			} else {
				$scope.show("creditCardRegisteredSuccessfuly.html");
			}
		}
	}
	
	$scope.tripplePayRecharge = function () {
		try {
			dialog.hide();
        }
        catch(err) {
        }

		myNavigator.pushPage('tripplePayRecharge.html', { animation : 'slide' } );

		$scope.rechargeDetails.rechargeAmount(20.00);
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));		
		

	}
	
	
	$scope.isFirstPINRechargeFollowUpSuccess = function () {
		// Follow up email starting process
		if (localStorage.firstRechargeSuccess == undefined) {
              $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz PIN TripplePay Recharge MOBILE APP ' + localStorage.verifiedNumber, body: '<br>El cliente ha realizado su Recarga PIN exitosamente<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
            	  success(function(data, status, headers, config) {
         			if (data.response == 'send') {
    					localStorage.firstRechargeSuccess = 1;
    				} else {
    					
    				}
    			  }).
    			  error(function(data, status, headers, config) {
          	    	$scope.hideLoading();
				     myNavigator.pushPage('error_404.html', { animation : 'slide' } );
              
    			  });             

		}	
	}

	
	$scope.isFirstPINRechargeFollowUpInit = function () {
		// Follow up email starting process
		if (localStorage.firstRecharge == undefined) {
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz PIN TripplePay Recharge MOBILE APP ' + localStorage.verifiedNumber, body: '<br>El cliente ha iniciado un proceso de Recarga TripplePay<br>Valor de la recarga: ' + _rechargeAmount + '<br>PIN Tripple Pay:' + _tripplePayPin + '<br>Número del Cliente: ' + localStorage.verifiedNumber, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
         			if (data.response == 'send') {
    					localStorage.firstRecharge = 1;
    					
    				} else {
    					
    				}
    			  }).
    			  error(function(data, status, headers, config) {
    			  $scope.hideLoading();
				  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
              
    			  });             
		}	
	}

	$scope.displayPinRechargeTransacDetails = function () {
		if ($scope.validateAccountPinRechargeDetails()) {
			$scope.show('tripplePayTransactionDetails.html');
			$scope.isFirstPINRechargeFollowUpInit();
		} else {
			$scope.show("ccWrongInfoProvided.html");
		}
	}	

	$scope.validatePinBalance = function () {
        $scope.showLoading('validatingPin.html',60);
            $http({
                url: 'https://mobileapp.ringvoz.com/V2/credit?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({number: localStorage.verifiedNumber, pin: _tripplePayPin}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
            			$scope.hideLoading();
        				if (data.response.status == '1') {
        					$scope.show("pinNotValid.html");
        				} else if (data.response.status == '2') {
        					$scope.rechargeDetails.pinBalance(($scope.parseFloat(data.response.credit)).toFixed(2 || 0));
        				} else {
        					$scope.show("pinNotValid.html");
        				}	
    			  }).
    			  error(function(data, status, headers, config) {
        			$scope.hideLoading();
    				myNavigator.pushPage('error_404.html', { animation : 'slide' } );
              
    			  });       
                  
 		
	}
	
	$scope.rechargeAccountWithPin = function () {
		
		dialog.hide();
        $scope.showLoading('processingTransaction.html',60);
  
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/creditrecharge?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({number: localStorage.verifiedNumber, value: _rechargeAmount, pin: _tripplePayPin}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
    			$scope.hideLoading();
	
				if (data.response.status == '1') {
					localyticsSession.tagEvent("TripplePay_RechargeSuccessful");
					window.analytics.trackEvent('TripplePay', 'RechargeSuccessful');
					$scope.isFirstPINRechargeFollowUpSuccess();
					localStorage.updateBalance = '1';
					$scope.show("AccountRechargeSuccessful.html");
				} else if (data.response.status == '2') {
					localyticsSession.tagEvent("TripplePay_RechargeDeclined");
					window.analytics.trackEvent('TripplePay', 'RechargeDeclined');				
					$scope.show("InterTopUpFailed.html");
				} else if (data.response.status == '3') {
					localyticsSession.tagEvent("TripplePay_RechargeDeclined");
					window.analytics.trackEvent('TripplePay', 'RechargeDeclined');				
					$scope.show("InterTopUpFailed.html");
					//alert('error on  recharge');
				} else if (data.response.status == '4') {
					localyticsSession.tagEvent("TripplePay_RechargeDeclined");
					window.analytics.trackEvent('TripplePay', 'RechargeDeclined');				
					$scope.show("InterTopUpFailed.html");
					//alert('value not valid');
				} else if (data.response.status == '5') {
					localyticsSession.tagEvent("TripplePay_RechargeDeclined");
					window.analytics.trackEvent('TripplePay', 'RechargeDeclined');				
					$scope.show("InterTopUpFailed.html");
					//alert('ani not valid');
				} else {
					$scope.show("InterTopUpFailed.html");
					localyticsSession.tagEvent("TripplePay_RechargeDeclined");
					window.analytics.trackEvent('TripplePay', 'RechargeDeclined');					
					//alert('caller id or pin not valid');
				} 
    			  }).
    			  error(function(data, status, headers, config) {
    		    $scope.hideLoading();
				myNavigator.pushPage('error_404.html', { animation : 'slide' } );
    			  });       
                  
                  


		
	}

	
	$scope.rechargeWithCreditCard = function () {
		try {
			dialog.hide();
        }
        catch(err) {
        }

		myNavigator.pushPage('rechargeCreditCard.html', { animation : 'slide' } );

		$scope.rechargeDetails.rechargeAmount(20.00);
		$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
		$scope.rechargeDetails.rechargeAmountTotal((parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges())).toFixed(2 || 0));		
		
		if ($scope.choosenCard.INFO3 == $scope.lg.get("drp_addCreditCard")) {
			$scope.show('NoCreditCardRegistered.html');
		}
	}

	$scope.isFirstAccRechargeWithCCFollowUpInit = function () {
		// Follow up email starting process
		if (localStorage.firstRecharge == undefined) {

             $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz Recharge with Credit card MOBILE APP ' + localStorage.verifiedNumber, body: '<br>El cliente ha iniciado un proceso de Recarga con Tarjeta credito<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
            			if (data.response == 'send') {
        					localStorage.firstRecharge = 1;
        					
        				} else {
        					
        				}
    			  }).
    			  error(function(data, status, headers, config) {
    			 $scope.hideLoading();
				  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                });    
		}	
	}
	
	$scope.displayTransactionDetails = function () {
		try {
			if ($scope.choosenCard.INFO3 != $scope.lg.get("drp_addCreditCard")) {
				if ($scope.validateAccountRechargeDetails()) {
					$scope.show(_accountRechargeConfirmDisplay);
					$scope.isFirstAccRechargeWithCCFollowUpInit();
				} else {
					$scope.show("ccWrongInfoProvided.html");
				}					
			} else {
				$scope.rechargeDetails.setBackToRechargeAccount(true);
				_popCreditCardRegistrationPage = false;
				myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );					
			}
        }
        catch(err) {
			$scope.rechargeDetails.setBackToRechargeAccount(true);
			_popCreditCardRegistrationPage = false;
			myNavigator.pushPage('registerCreditCard.html', { animation : 'slide' } );		
        }	
	}
	
	$scope.activateAutoRecharge = function () {
        
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/autorecarga?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({refid: localStorage.refId, amount: _autoRechargeAmount}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
        			if (data.response.MODAL == 'GAUTH') {
    					localyticsSession.tagEvent("RechargeWithCC_AutoRechargeActivated");
    					window.analytics.trackEvent('RechargeWithCC', 'AutoRechargeActivated');					
    				} else {
    					
    				}
    			  }).
    			  error(function(data, status, headers, config) {
    		
                });            
	}
	
	$scope.deactivateAutoRecharge = function () {
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/autorecarga?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({refid: localStorage.refId, amount: 0}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
            		if (data.response.MODAL == 'GAUTH') {
    						
    				} else {
    					
    				}
    			  }).
    			  error(function(data, status, headers, config) {
    		
                });              
	
	}

	$scope.isFirstAccRechargeWithCCFollowUpSuccess = function () {
		// Follow up email starting process
		if (localStorage.firstRechargeSuccess == undefined) {
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz Recarga con Tarjeta credito MOBILE APP ' + localStorage.verifiedNumber, body: '<br>El cliente ha realizado su Recarga con tarjeta exitosamente<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
                    			if (data.response == 'send') {
					localStorage.firstRechargeSuccess = 1;
				} else {
					
				}
    			  }).
    			  error(function(data, status, headers, config) {
    			  $scope.hideLoading();
				  myNavigator.pushPage('error_404.html', { animation : 'slide' } );    		
                });                          
		}	
	}

	$scope.rechargeAccountWithCc = function () {
		dialog.hide();
        $scope.showLoading('processingTransaction.html',60);

             $http({
                url: 'https://mobileapp.ringvoz.com/V2/recharge?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz Recarga con Tarjeta credito MOBILE APP ' + localStorage.verifiedNumber, body: '<br>El cliente ha realizado su Recarga con tarjeta exitosamente<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
        	    	$scope.hideLoading();
    				if (data.response.INFO1 == 'Error-PendingApproval') {
    					$scope.show("AccountPendingApproval.html");
    				} else if (data.response.INFO2 == 'Approved') {
        				localStorage.updateBalance = '1';
    					$scope.isFirstAccRechargeWithCCFollowUpSuccess();
    					$scope.show("AccountRechargeSuccessful.html");
    					localyticsSession.tagEvent("RechargeWithCC_RechargeSuccessful");
    					window.analytics.trackEvent('RechargeWithCC', 'RechargeSuccessful');					
    					if ($scope.rechargeDetails.isAutoRechargeActivated() == true) {
    						$scope.activateAutoRecharge();
    					} else {
    						$scope.deactivateAutoRecharge();
    					}				
    				} else {
        				localyticsSession.tagEvent("RechargeWithCC_RechargeDeclined");
    					window.analytics.trackEvent('RechargeWithCC', 'RechargeDeclined');					
    				
    					$scope.show("InterTopUpFailed.html");                    
    				}
    			  }).
    			  error(function(data, status, headers, config) {
                    $scope.hideLoading();
				    myNavigator.pushPage('error_404.html', { animation : 'slide' } );    			
                });                          
                

	}
	
	$scope.updateAccountBalance = function () {
		$http.get('https://mobileapp.ringvoz.com/V2/balance/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
		  success(function(data, status, headers, config) {
				if (data.data.data.DATA.length > 1) {
					_accountBalance = data.data.data.DATA[0].INFO4;
					localStorage.accountBalance = data.data.data.DATA[0].INFO4;
				} else {
					_accountBalance = data.data.data.DATA.INFO4;
					localStorage.accountBalance = data.data.data.DATA.INFO4;
				}
				
		  }).
		  error(function(data, status, headers, config) {

		  });			
	}
	
	if (localStorage.updateBalance == '1') {
		$scope.updateAccountBalance();
		localStorage.updateBalance = '0';
	}
	
	$scope.cancelRecharge = function (){
		$scope.hideTabs = false;
		_doRecharge = false;
		
		
		// update account balance 
        $scope.showLoading('',100);

		if (states[networkState] == 'No network connection') {
		
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {	
	
			$http.get('https://mobileapp.ringvoz.com/V2/balance/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
			  success(function(data, status, headers, config) {
					$scope.hideLoading();
					if (data.data.data.DATA.length > 1) {
						_accountBalance = data.data.data.DATA[0].INFO4;
						localStorage.accountBalance = data.data.data.DATA[0].INFO4;
					} else {
						_accountBalance = data.data.data.DATA.INFO4;
						localStorage.accountBalance = data.data.data.DATA.INFO4;
					}
					document.location = topUpOptionsHome;
			  }).
			  error(function(data, status, headers, config) {
					$scope.hideLoading();
					document.location = topUpOptionsHome;
			  });
		}
	}

	$scope.goHome = function (){
		document.location = topUpOptionsHome;
	}
	
	$scope.insertAgainDestNumber = function (){
		dialog.hide();	
	}
	
	$scope.closeDlg = function() {
		dialog.hide();
	}
	
	$scope.hideTerms = function() {
		dialog.hide();
	}
	
	$scope.setPrefixNbr = function(string, nb) {
	    $scope.array = string.split('-'); 
        
        var nbrPatternDisplayStr = $scope.lg.get("lbl_example");
        for (i = 0;i<$scope.array.length;i++) {
        	nbrPatternDisplayStr = nbrPatternDisplayStr + $scope.array[i];
        }
        
	    var s = string ? string.split(/x/) : 0;
		if ($scope.array[nb].indexOf('1xxx') == 0) {
			$scope.rechargeDetails.destinationNumberLength(s ? ((s.length - 1) + 1) : 0);
			nbrPatternDisplayStr = nbrPatternDisplayStr + ' (Total: ' + $scope.rechargeDetails.destinationNumberLength() + $scope.lg.get("lbl_numbers") + ')';
			$scope.rechargeDetails.destNbrPattern(nbrPatternDisplayStr);
			return 1;
		} else {
			$scope.rechargeDetails.destinationNumberLength(s ? ((s.length - 1) + $scope.array[nb].length) : 0);
			nbrPatternDisplayStr = nbrPatternDisplayStr + ' (Total: ' + $scope.rechargeDetails.destinationNumberLength() + $scope.lg.get("lbl_numbers") + ')';
			$scope.rechargeDetails.destNbrPattern(nbrPatternDisplayStr);
			return parseInt($scope.array[nb]);
		}
		
	}

	
	$scope.allCountries = [{"MODAL":"CTRY","name":"Afghanistan","INFO2":"AF","INFO3":"+93-(xx)-xxx-xxxx"},{"MODAL":"CTRY","name":"Albania","INFO2":"AL","INFO3":"+(355)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Anguilla","INFO2":"AI","INFO3":"+1(264)-xxx-xxxx"},{"MODAL":"CTRY","name":"Antigua","INFO2":"AG","INFO3":"+1(268)-xxx-xxxx"},{"MODAL":"CTRY","name":"Argentina","INFO2":"AR","INFO3":"(54)-xx-xxxx-xxxx"},{"MODAL":"CTRY","name":"Armenia","INFO2":"AM","INFO3":"+(374)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Barbados","INFO2":"BB","INFO3":"+1(246)-xxx-xxxx"},{"MODAL":"CTRY","name":"Belarus","INFO2":"BY","INFO3":"+375xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Belize","INFO2":"BZ","INFO3":"+(501)xxxxxxx"},{"MODAL":"CTRY","name":"Benin","INFO2":"BJ","INFO3":"+(229)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Bhutan","INFO2":"BT","INFO3":"+(975)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Bolivia","INFO2":"BO","INFO3":"+(591)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Brazil","INFO2":"BR","INFO3":"+(55)-xx-xxxx-xxxx"},{"MODAL":"CTRY","name":"British Virgin Islands","INFO2":"VG","INFO3":"+1(284)-xxx-xxxx"},{"MODAL":"CTRY","name":"Burkina Faso","INFO2":"BF","INFO3":"(226)xx-xx-xx-xx"},{"MODAL":"CTRY","name":"Burundi","INFO2":"BI","INFO3":"+257-xxxx-xxxx"},{"MODAL":"CTRY","name":"Cambodia","INFO2":"KH","INFO3":"+(855)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Cameroon","INFO2":"CM","INFO3":"237-xxx-xxx-xx"},{"MODAL":"CTRY","name":"Cayman Islands","INFO2":"KY","INFO3":"+1(345)-xxx-xxxx"},{"MODAL":"CTRY","name":"Central African Republic","INFO2":"CF","INFO3":"236-xxxx-xxxx"},{"MODAL":"CTRY","name":"Chile","INFO2":"CL","INFO3":"+(56)xxx-xxx-xxx"},{"MODAL":"CTRY","name":"China","INFO2":"CN","INFO3":"+(86)-xxx-xxxx-xxxx"},{"MODAL":"CTRY","name":"Colombia","INFO2":"CO","INFO3":"+57-xxxxx-xxxxx"},{"MODAL":"CTRY","name":"Costa Rica","INFO2":"CR","INFO3":"+(506)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Cuba","INFO2":"CU","INFO3":"+(53)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Cyprus","INFO2":"CY","INFO3":"+(357)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Democratic Republic of the Congo","INFO2":"CD","INFO3":"+(243)-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Dominica","INFO2":"DM","INFO3":"+1(767)-xxx-xxxx"},{"MODAL":"CTRY","name":"Dominican Republic","INFO2":"DO","INFO3":"18-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Ecuador","INFO2":"EC","INFO3":"+(593)-xxxxx-xxxx"},{"MODAL":"CTRY","name":"Egypt","INFO2":"EG","INFO3":"+(20)-xxxxx-xxxxx"},{"MODAL":"CTRY","name":"El Salvador","INFO2":"SV","INFO3":"+503-xxxx-xxxx"},{"MODAL":"CTRY","name":"Estonia","INFO2":"EE","INFO3":"+(372)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Fiji","INFO2":"FJ","INFO3":"+679-xxx-xxxx"},{"MODAL":"CTRY","name":"Gabon","INFO2":"GA","INFO3":"+(241)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Gambia","INFO2":"GM","INFO3":"+220-xxx-xxxx"},{"MODAL":"CTRY","name":"Georgia","INFO2":"GE","INFO3":"+995xxxx-xxxxx"},{"MODAL":"CTRY","name":"Germany","INFO2":"DE","INFO3":"+49xxx-xx-xx-xx-xx"},{"MODAL":"CTRY","name":"Ghana","INFO2":"GH","INFO3":"+(233)xx-xxxxxxx"},{"MODAL":"CTRY","name":"Grenada","INFO2":"GD","INFO3":"+1(473)-xxx-xxxx"},{"MODAL":"CTRY","name":"Guatemala","INFO2":"GT","INFO3":"+(502)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Guinea","INFO2":"GN","INFO3":"+(224)-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Guinea Bissau","INFO2":"GW","INFO3":"+(245)-xxx-xxxx"},{"MODAL":"CTRY","name":"Guyana","INFO2":"GY","INFO3":"+592-xxx-xxxx"},{"MODAL":"CTRY","name":"Haiti","INFO2":"HT","INFO3":"+509-xxxx-xxxx"},{"MODAL":"CTRY","name":"Honduras","INFO2":"HN","INFO3":"+504-xxxx-xxxx"},{"MODAL":"CTRY","name":"India","INFO2":"IN","INFO3":"+(91)-xx-xxx-xxxxx"},{"MODAL":"CTRY","name":"Indonesia","INFO2":"ID","INFO3":"+(62)-xx-xxxxxxxx"},{"MODAL":"CTRY","name":"Iraq","INFO2":"IQ","INFO3":"+(964)xxx-xxx-xxxx"},{"MODAL":"CTRY","name":"Ivory Coast","INFO2":"CI","INFO3":"+(225)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Jamaica","INFO2":"JM","INFO3":"+1(876)-xxx-xxxx"},{"MODAL":"CTRY","name":"Jordan (USD)","INFO2":"JO","INFO3":"(962)xxxxxxxxx"},{"MODAL":"CTRY","name":"Kenya","INFO2":"KE","INFO3":"+254-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Kuwait","INFO2":"KW","INFO3":"+965-xxxx-xxxx"},{"MODAL":"CTRY","name":"Laos","INFO2":"LA","INFO3":"+856-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Liberia","INFO2":"LR","INFO3":"+231-xxxx-xxxx"},{"MODAL":"CTRY","name":"Lithuania","INFO2":"LT","INFO3":"+(370)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Madagascar","INFO2":"MG","INFO3":"+(261)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Malaysia","INFO2":"MY","INFO3":"+(60)xxxxx-xxxx"},{"MODAL":"CTRY","name":"Mali","INFO2":"ML","INFO3":"+(223)-xx-xxx-xxx"},{"MODAL":"CTRY","name":"Mexico","INFO2":"MX","INFO3":"+(52)-xxx-xxx-xxxx"},{"MODAL":"CTRY","name":"Moldova","INFO2":"MD","INFO3":"+373-xxxx-xxxx"},{"MODAL":"CTRY","name":"Montserrat","INFO2":"MS","INFO3":"+1(664)-xxx-xxxx"},{"MODAL":"CTRY","name":"Morocco","INFO2":"MA","INFO3":"212-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Mozambique","INFO2":"MZ","INFO3":"+(258)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Nepal","INFO2":"NP","INFO3":"977-xxx-xxx-xxxx"},{"MODAL":"CTRY","name":"Nicaragua","INFO2":"NI","INFO3":"+505-xxxx-xxxx"},{"MODAL":"CTRY","name":"Niger","INFO2":"NE","INFO3":"+(227)-xx-xxx-xxx"},{"MODAL":"CTRY","name":"Nigeria","INFO2":"NG","INFO3":"+(234)-xx-xxxx-xxxx"},{"MODAL":"CTRY","name":"Pakistan","INFO2":"PK","INFO3":"+92-xxxxx-xxxxx"},{"MODAL":"CTRY","name":"Palestine","INFO2":"PS","INFO3":"+(972)-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Panama","INFO2":"PA","INFO3":"+507-xxxx-xxxx"},{"MODAL":"CTRY","name":"Paraguay","INFO2":"PY","INFO3":"+(595)-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Peru","INFO2":"PE","INFO3":"+(51)-xxxxx-xxxx"},{"MODAL":"CTRY","name":"Philippines","INFO2":"PH","INFO3":"+63-xxxxx-xxxxx"},{"MODAL":"CTRY","name":"Poland","INFO2":"PL","INFO3":"+(48)xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Puerto Rico","INFO2":"PR","INFO3":"+1(xxx)-xxx-xxxx"},{"MODAL":"CTRY","name":"Republic of the Congo","INFO2":"CG","INFO3":"+(242)-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Romania","INFO2":"RO","INFO3":"+(407)xxxx-xxxx"},{"MODAL":"CTRY","name":"Russia","INFO2":"RU","INFO3":"+(7)-xxxx-xxx-xxx"},{"MODAL":"CTRY","name":"Rwanda","INFO2":"RW","INFO3":"+(250)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Senegal","INFO2":"SN","INFO3":"+221-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Serbia","INFO2":"RS","INFO3":"+(381)-xxxx-xxxxx"},{"MODAL":"CTRY","name":"Somalia","INFO2":"SO","INFO3":"+(252)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"South Africa","INFO2":"ZA","INFO3":"27-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Spain","INFO2":"ES","INFO3":"+(34)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Sri Lanka","INFO2":"LK","INFO3":"+94-xxxxx-xxxx"},{"MODAL":"CTRY","name":"St. Kitts","INFO2":"KN","INFO3":"+1(869)-xxx-xxxx"},{"MODAL":"CTRY","name":"St. Lucia","INFO2":"LC","INFO3":"+1(758)-xxx-xxxx"},{"MODAL":"CTRY","name":"St. Vincent","INFO2":"VC","INFO3":"+1(784)-xxx-xxxx"},{"MODAL":"CTRY","name":"Sudan","INFO2":"SD","INFO3":"+249-xx-xxx-xxxx"},{"MODAL":"CTRY","name":"Swaziland","INFO2":"SZ","INFO3":"+(268)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Togo","INFO2":"TG","INFO3":"(228)xx-xx-xx-xx"},{"MODAL":"CTRY","name":"Tonga","INFO2":"TO","INFO3":"+676-xxx-xxxx"},{"MODAL":"CTRY","name":"Trinidad and Tobago","INFO2":"TT","INFO3":"+1(868)-xxx-xxxx"},{"MODAL":"CTRY","name":"Tunisia","INFO2":"TN","INFO3":"+(216)-xxxx-xxxx"},{"MODAL":"CTRY","name":"Turks and Caicos","INFO2":"TC","INFO3":"+1(649)-xxx-xxxx"},{"MODAL":"CTRY","name":"Uganda","INFO2":"UG","INFO3":"+256-xx-xxxxxxx"},{"MODAL":"CTRY","name":"Ukraine","INFO2":"UA","INFO3":"+380-xx-xxxxxxx"},{"MODAL":"CTRY","name":"United Kingdom","INFO2":"GB","INFO3":"+44-xx-xxxx-xxxx"},{"MODAL":"CTRY","name":"United States","INFO2":"US","INFO3":"1(xxx)xxx-xxxx"},{"MODAL":"CTRY","name":"Uruguay","INFO2":"UY","INFO3":"+598-xxxx-xxxx"},{"MODAL":"CTRY","name":"Vietnam","INFO2":"VN","INFO3":"+84-xxxxx-xxxx"},{"MODAL":"CTRY","name":"Yemen","INFO2":"YE","INFO3":"+(967)-xxx-xxxxxx"},{"MODAL":"CTRY","name":"Zambia","INFO2":"ZM","INFO3":"+(260)-xxx-xxx-xxx"},{"MODAL":"CTRY","name":"Zimbabwe","INFO2":"ZW","INFO3":"+(263)-xxx-xxx-xxx"}];
	//$scope.myCountry = $scope.allCountries[100];

	$scope.sCountryImg = _selectedCountryFlag;
    $scope.sOperatorImg = _selectedOperatorLogo;
	//$scope.accBalanceLed = _accBalanceLed;
	
	$scope.operators = [{"MODAL":"OPER","name":"ATT ","INFO2":"AT","INFO3":"1xxx-xxx-xxxx","INFO4":" 15, 20, 30, 40"},{"MODAL":"OPER","name":"T-Mobile","INFO2":"TL","INFO3":"1xxx-xxx-xxxx","INFO4":" 10, 25, 50"}];
	$scope.opDisabled = "disabled";
	
	$scope.selectCountryAction = function() {
	    $scope.operators = [];
	    $scope.rechargeDetails.country($scope.myCountry.name,$scope.myCountry.INFO2);
	    $scope.opDisabled = "disabled";
		
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {
			/* get operators for selected country */
            $scope.showLoading('',100);

             $http({
                url: 'https://mobileapp.ringvoz.com/V2/operator?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({countrycode:_countryCode,countryname: _country}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
             			$scope.hideLoading();
        				if (data.operators.length > 1) {
        					$scope.operators = data.operators;
        					$scope.opDisabled = "";
        				} else {
        					if (angular.equals(data.operators.name, "No Registry ")) {	
        						$scope.show("noOperatorFound.html");
        					} else {
        						$scope.operators[0] = data.operators;
        						$scope.opDisabled = "";
        					}
        				}
    			  }).
    			  error(function(data, status, headers, config) {
    				$scope.hideLoading();
					myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                });      
		}
	};

	$scope.rechargeAmounts = $scope.rechargeDetails.rechargeAmountsOpt();
	$scope.myAmount = $scope.rechargeAmounts[0];
	
	$scope.selectOperatorAction = function() {
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {
        $scope.showLoading('',100);
		/*spinnerplugin.show({
					overlay: true,   
					timeout:100
				}); 
                */
	    $scope.rechargeDetails.operator($scope.myOperator.name,$scope.myOperator.INFO2);
	   
		$scope.rechargeDetails.rechargeAmountCurrencyValue('');
	    $scope.rechargeDetails.destinationNumber($scope.setPrefixNbr($scope.myOperator.INFO3,0));
		
		//localStorage.rechargeAmounts = [];
		_rechargeAmounts = [];
		$scope.rechargeDetails.isPromotionActive(0);
        
        
             $http({
                url: 'https://mobileapp.ringvoz.com/V2/amount?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({countrycode:_countryCode,operatorcode: _opCode}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
                		$scope.hideLoading();
            		 
            			if (data.promo == '1' && _countryCode == data.country && _opCode == data.operator) {
            			
            				$scope.rechargeDetails.isPromotionActive(1);
            				if (data.filteramount == '1') {
            				   
            					for (i=0;i<data.amounts.length;i++) {
            						if (($scope.parseFloat(data.amounts[i].name) + 0.01) >= $scope.parseFloat(data.amountstart) && ($scope.parseFloat(data.amounts[i].name) + 0.01) <= $scope.parseFloat(data.amountend)) {
            					
            							_rechargeAmounts.push({name: ($scope.parseFloat(data.amounts[i].name) + 0.01).toFixed(2 || 0)});
            						
            						}
            					}
            					$scope.ons.navigator.pushPage('page2.html');
            				} else {
            			
            					for (i=0;i<data.amounts.length;i++) {
            						_rechargeAmounts.push({name: ($scope.parseFloat(data.amounts[i].name) + 0.01).toFixed(2 || 0)});
            					}
            
            					 $scope.ons.navigator.pushPage('page2.html');
            				}
            				
            			} else {
            
            				for (i=0;i<data.amounts.length;i++) {
            					
            					_rechargeAmounts.push({name: ($scope.parseFloat(data.amounts[i].name) + 0.01).toFixed(2 || 0)});
            				}
            				$scope.ons.navigator.pushPage('page2.html');
            				
            			}
            			$scope.choosenCard = $scope.userCreditCardsList[0];
            			$scope.selectCreditCard();
    			  }).
    			  error(function(data, status, headers, config) {
            	    $scope.hideLoading();
        			myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                });              
        

		}
	}
	
	$scope.destNbrDisabled = true;
	$scope.selectAmountAction = function () {
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {
			$scope.rechargeDetails.rechargeAmountCurrencyValue('');
			
			if ($scope.myAmount != '' && $scope.myAmount != null) {
			    $scope.showLoading('',100);

				$scope.rechargeDetails.rechargeAmount($scope.myAmount);
				$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
				$scope.rechargeDetails.rechargeAmountTotal(parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges()));


             $http({
                url: 'https://mobileapp.ringvoz.com/V2/value?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({countrycode:_countryCode,operatorcode: _opCode,amount: (parseFloat($scope.myAmount) - 1.00), isPromotionActive: $scope.rechargeDetails.isPromotionActive()}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
    					$scope.hideLoading();
						$scope.destNbrDisabled = false;
					  if ($scope.rechargeDetails.isPromotionActive() == 1) {
						$scope.rechargeDetails.rechargeAmountCurrencyValue(($scope.parseInteger(data.amount.INFO3) * 2) + ' ' + data.amount.INFO7);
					  } else {
					  
						$scope.rechargeDetails.rechargeAmountCurrencyValue(data.amount.INFO3 + ' ' + data.amount.INFO7);
					  }

    			  }).
    			  error(function(data, status, headers, config) {
    					$scope.hideLoading();
						$scope.destNbrDisabled = true;
						myNavigator.pushPage('error_404.html', { animation : 'slide' } );            
                });            
			}
		}
	}
	
	$scope.myccCountry = $scope.allCountries[100];
	$scope.selectccCountryAction = function() {  
		$scope.rechargeDetails.ccCountry($scope.myccCountry.name,$scope.myccCountry.INFO2);
	}	
	

	 
	$scope.parseFloat = function(value) {
        return parseFloat(value);
    } 
	$scope.parseInteger = function(value) {
        return parseInt(value);
    } 
	

	$scope.rechargeAmounts = [{name: "Selecciona el Valor"}];
	$scope.amountSelected = function (ra) {
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {
			$scope.rechargeDetails.rechargeAmount(ra.name);
			$scope.rechargeDetails.regulatoryCharges(($scope.rechargeDetails.rechargeAmount() * 0.07).toFixed(2 || 0));
			$scope.rechargeDetails.rechargeAmountTotal(parseFloat($scope.rechargeDetails.rechargeAmount()) + parseFloat($scope.rechargeDetails.regulatoryCharges()));

            $http({
                url: 'https://mobileapp.ringvoz.com/V2/value?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({countrycode:_countryCode,operatorcode: _opCode,amount: (parseFloat(ra.name) - 1.00), isPromotionActive: $scope.rechargeDetails.isPromotionActive()}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
        			  if ($scope.rechargeDetails.isPromotionActive() == 1) {
    					$scope.rechargeDetails.rechargeAmountCurrencyValue(($scope.parseInteger(data.amount.INFO3) * 2) + ' ' + data.amount.INFO7);
    				  } else {
    					$scope.rechargeDetails.rechargeAmountCurrencyValue(data.amount.INFO3 + ' ' + data.amount.INFO7);
    				  }        	
        
    			  }).
    			  error(function(data, status, headers, config) {
    				    myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                    
                });   
		}
	}
	 
	
	 $scope.getRechargeAmounts = function (callback){		
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {	
			$scope.rechargeDetails.isPromotionActive(0);
            $http({
                url: 'https://mobileapp.ringvoz.com/V2/amount?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({countrycode:_countryCode,operatorcode: _opCode}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
            		if (data.promo == '1' && _countryCode == data.country && _opCode == data.operator) {
        				if (data.filteramount == '1') {
        					for (i=0;i<data.amounts.length;i++) {
        						if (($scope.parseFloat(data.amounts[i].name) + 0.01) >= $scope.parseFloat(data.amountstart) && ($scope.parseFloat(data.amounts[i].name) + 0.01) <= $scope.parseFloat(data.amountend)) {
        							$scope.rechargeAmounts.push(data.amounts[i]);
        						}
        					}
        				} else {
        					$scope.rechargeAmounts = data.amounts;
        				}
        				$scope.rechargeDetails.isPromotionActive(1);
        			} else {
        				$scope.rechargeAmounts = data.amounts;
        			}
        			callback($scope.rechargeAmounts);
    			  }).
    			  error(function(data, status, headers, config) {
    				     myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                    
                });               

		}
	 }
	
	$scope.ccExpMonths = [{"MODAL":"YR","name":"01","INFO2":"01"},{"MODAL":"YR","name":"02","INFO2":"02"},{"MODAL":"YR","name":"03","INFO2":"03"},{"MODAL":"YR","name":"04","INFO2":"04"},{"MODAL":"YR","name":"05","INFO2":"05"},{"MODAL":"YR","name":"06","INFO2":"06"},{"MODAL":"YR","name":"07","INFO2":"07"},{"MODAL":"YR","name":"08","INFO2":"08"},{"MODAL":"YR","name":"09","INFO2":"09"},{"MODAL":"YR","name":"10","INFO2":"10"},{"MODAL":"YR","name":"11","INFO2":"11"},{"MODAL":"YR","name":"12","INFO2":"12"}];
	$scope.selectExpMonthAction = function() {
		$scope.rechargeDetails.ccExpDateMonth($scope.myExpMonth.name);
	}
	
	$scope.ccExpYears = [{"MODAL":"YR","name":"2015","INFO2":"2015"},{"MODAL":"YR","name":"2016","INFO2":"2016"},{"MODAL":"YR","name":"2017","INFO2":"2017"},{"MODAL":"YR","name":"2018","INFO2":"2018"},{"MODAL":"YR","name":"2019","INFO2":"2019"},{"MODAL":"YR","name":"2020","INFO2":"2020"}];
	$scope.selectExpYearAction = function() {
		$scope.rechargeDetails.ccExpDateYear($scope.myExpYear.name);
	}
	

	$scope.show = function(dlg) {
	    ons.createDialog(dlg).then(function(dialog) {
	      dialog.show();
	    });
	}
	    
	$scope.showPaymentMethods = function(index){
		$scope.show('paymentMethodOptions.html');
	}
		  
	$scope.setPaymentMethodType = function (mType){
		$scope.rechargeDetails.paymentMethod(mType);
	    dialog.hide();
	}

	$scope.validateTransactionDetails = function() {
		var frmIsValid = true;
		if (!_ccFirstName.length > 0) {
			frmIsValid = false;
		}
		if (!_ccLastName.length > 0) {
			frmIsValid = false;
		}
		if (!_ccAddress.length > 0) {
			frmIsValid = false;
		}
		if (!_ccCity.length > 0) {
			frmIsValid = false;	
	    }
	    if (!_ccState.length > 0) {
	    	frmIsValid = false;
	    }
	    if (!_ccZipCode.length > 0) {
	    	frmIsValid = false;	    	
	    }   
	    if (!_paymentMethodId == 66 && !_paymentMethodId == 67 && !_paymentMethodId == 68 && !_paymentMethodId == 69) {
	    	frmIsValid = false; 	
	    }
	   
	    if (_ccExpDateMonth == '' || $scope.parseInteger(_ccExpDateMonth) < 1 || $scope.parseInteger(_ccExpDateMonth) > 12) {
	    	frmIsValid = false;    	
	    }
	    if (_ccExpDateYear == '' || $scope.parseInteger(_ccExpDateYear) < 2014) {
	    	frmIsValid = false;    	
	    }
	    if (_cvv.length < 3) {
	    	frmIsValid = false;
	    }		
	
		 // accept only digits, dashes or spaces
		if (/[^0-9-\s]+/.test(_ccNumber)) {
			frmIsValid = false;
		} else {

			// The Luhn Algorithm. It's so pretty.
			var nCheck = 0, nDigit = 0, bEven = false;
			value = _ccNumber.toString().replace(/\D/g, "");
			
			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n),
				nDigit = $scope.parseInteger(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9) { 
						nDigit -= 9;
					}
				}
		 
				nCheck += nDigit;
				bEven = !bEven;
			}
			frmIsValid = ((nCheck % 10) == 0);
		
		}
		
	    return frmIsValid;
	}

	$scope.validateAccountRechargeDetails = function() {
		var frmIsValid = true;
	
	    if (!_paymentMethodId == 66 && !_paymentMethodId == 67 && !_paymentMethodId == 68 && !_paymentMethodId == 69) {
	    	frmIsValid = false; 	
	    }
		
		if (_registeredCcId == '') {
	    	frmIsValid = false; 	
	    }
		
		if (_rechargeAmount == '' || _rechargeAmount == 0.00) {
	    	frmIsValid = false; 	
	    }

		
	    return frmIsValid;
	}
	
	$scope.validateAccountPinRechargeDetails = function() {
		var frmIsValid = true;
		
		if (_rechargeAmount == '' || _rechargeAmount == 0.00) {
	    	frmIsValid = false; 	
	    }
		if (_newPinBalance == '0' || _newPinBalance == 0 || $scope.parseFloat(_newPinBalance) == 0) {
			frmIsValid = false; 
		}
		if (_tripplePayPin == '') {
			frmIsValid = false; 
		}		
		
	    return frmIsValid;
	}
	
	$scope.isFirstRechargeFollowUpInit = function () {
		if (localStorage.userName == undefined) {
			$scope.rechargeDetails.userName(_ccFirstName);
			$scope.rechargeDetails.userLastName(_ccLastName);
			$scope.rechargeDetails.userAddress(_ccAddress);
			$scope.rechargeDetails.userCity(_ccCity);
			$scope.rechargeDetails.userState(_ccState);
			$scope.rechargeDetails.userCountry(_ccCountryName);
			$scope.rechargeDetails.userZipCode(_ccZipCode);
		}
		
		// Follow up email starting process
		if (localStorage.firstRecharge == undefined) {
            $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz Top-Up MOBILE APP ' + localStorage.verifiedNumber + ' - ' + _destinationNumber, body: '<br>El cliente ha iniciado un proceso de Top-Up<br>Número de celular: ' + _destinationNumber + '<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>País del Cliente: ' + _ccCountryName, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
                   	if (data.response == 'send') {
    					localStorage.firstRecharge = 1;
    					
    				} else {
    					
    				}
   
    			  }).
    			  error(function(data, status, headers, config) {
    			  $scope.hideLoading();
				  myNavigator.pushPage('error_404.html', { animation : 'slide' } );    		
            
                    
                });  
                

		}	
	}
	
	$scope.isFirstRechargeFollowUpSuccess = function () {
		// Follow up email starting process
		if (localStorage.firstRechargeSuccess == undefined) {
            $http({
                url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                method: "POST",
                data: serializeData({subject: 'Ringvoz Top-Up MOBILE APP ' + localStorage.verifiedNumber + ' - ' + _destinationNumber, body: '<br>El cliente ha iniciado un proceso de Top-Up<br>Número de celular: ' + _destinationNumber + '<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>País del Cliente: ' + _ccCountryName, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
                }).
                  success(function(data, status, headers, config) {
        			if (data.response == 'send') {
    					localStorage.firstRechargeSuccess = 1;
    				} else {
    					
    				}
    			  }).
    			  error(function(data, status, headers, config) {
    			  $scope.hideLoading();
				  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
            
                    
                });  

		}	
	}
	
	$scope.setPaymentMethodDetails = function (){
		if (states[networkState] == 'No network connection') {

			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {	
			$scope.showLoading('',100);
				
			$scope.rechargeDetails.registeredCcId('');
			if ($scope.validateTransactionDetails()) {
				$http.get('https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
					success(function(data, status, headers, config) {

					if (angular.isObject(data.cards) && data.cards.length > 0) {
						
						for (i=0;i<data.cards.length;i++) {
							
							if (data.cards[i].INFO3 == $scope.rechargeDetails.ccNumber().toString().substr($scope.rechargeDetails.ccNumber().toString().length - 4)) {
								
								if ($scope.parseInteger(data.cards[i].INFO4) == _paymentMethodId) {
									
									$scope.rechargeDetails.registeredCcId($scope.parseInteger(data.cards[i].INFO1));
									
									
								}
							}
						}
						if ($scope.rechargeDetails.registeredCcId() != '') {
							$scope.hideLoading();
							
							localyticsSession.tagEvent("TopUp_PreTransacProcess");
							window.analytics.trackEvent('InterTopUp', 'PreTransactionProcess');


							myNavigator.pushPage('page1.html', { animation : 'slide' } );
							
						} else {
                        $http({
                            url: 'https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                            method: "POST",
                            data: serializeData({refid: localStorage.refId, name: _ccFirstName + ' ' + _ccLastName, type: _paymentMethodId, cardnumber: _ccNumber, cvv: _cvv, month: _ccExpDateMonth, year: _ccExpDateYear, country: _ccCountry, state: _ccState, city: _ccCity, address: _ccAddress, zip: _ccZipCode}),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                            }).
                              success(function(data, status, headers, config) {
                							if (data.response.INFO2 != "0") {
            									$scope.rechargeDetails.registeredCcId(data.response.INFO2);
            									
            									//$scope.show("topUpTransactionDetails.html");
            									localyticsSession.tagEvent("TopUp_PreTransacProcess");
            									window.analytics.trackEvent('InterTopUp', 'PreTransactionProcess');
            									
            
            									if (localStorage.userName == undefined) {
            										$scope.rechargeDetails.userName(_ccFirstName);
            										$scope.rechargeDetails.userLastName(_ccLastName);
            										$scope.rechargeDetails.userAddress(_ccAddress);
            										$scope.rechargeDetails.userCity(_ccCity);
            										$scope.rechargeDetails.userState(_ccState);
            										$scope.rechargeDetails.userCountry(_ccCountryName);
            										$scope.rechargeDetails.userZipCode(_ccZipCode);
            									}
            									
            									// Follow up email starting process
            									if (localStorage.firstRecharge == undefined) {
            				
            										$http.post('https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n, {subject: 'Ringvoz Top-Up MOBILE APP ' + localStorage.verifiedNumber + ' - ' + _destinationNumber, body: '<br>El cliente ha iniciado un proceso de Top-Up<br>Número de celular: ' + _destinationNumber + '<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>PaÃ­s del Cliente: ' + _ccCountryName, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}).
            										success(function(data, status, headers, config) {
            											
            											
            											if (data.response == 'send') {
            												localStorage.firstRecharge = 1;
            												
            											} else {
            												
            											}
            										}).
            										  error(function(data, status, headers, config) {
            											  $scope.hideLoading();
            											  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
            										});	
            
            									}
            									myNavigator.pushPage('page1.html', { animation : 'slide' } );
            								} else {
            									$scope.show("invalidCreditCard.html");
            									localyticsSession.tagEvent("TopUp_InvalidCardInfo");
            									window.analytics.trackEvent('InterTopUp', 'InvalidCreditCard');
            								}
            								$scope.hideLoading();
                			  }).
                			  error(function(data, status, headers, config) {
                								$scope.show("invalidCreditCard.html");
            									localyticsSession.tagEvent("TopUp_InvalidCardInfo");
            									window.analytics.trackEvent('InterTopUp', 'InvalidCreditCard');
                            }); 
						}
					} else {

							if ($scope.rechargeDetails.registeredCcId() == '') {
                        $http({
                            url: 'https://mobileapp.ringvoz.com/V2/card/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                            method: "POST",
                            data: serializeData({refid: localStorage.refId, name: _ccFirstName + ' ' + _ccLastName, type: _paymentMethodId, cardnumber: _ccNumber, cvv: _cvv, month: _ccExpDateMonth, year: _ccExpDateYear, country: _ccCountry, state: _ccState, city: _ccCity, address: _ccAddress, zip: _ccZipCode}),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                            }).
                              success(function(data, status, headers, config) {
    								$scope.hideLoading();

									if (data.response.INFO2 != "0") {
										$scope.rechargeDetails.registeredCcId(data.response.INFO2);
										
										//$scope.show("topUpTransactionDetails.html");
										localyticsSession.tagEvent("TopUp_PreTransacProcess");
										window.analytics.trackEvent('InterTopUp', 'PreTransactionProcess');
										

										if (localStorage.userName == undefined) {
											$scope.rechargeDetails.userName(_ccFirstName);
											$scope.rechargeDetails.userLastName(_ccLastName);
											$scope.rechargeDetails.userAddress(_ccAddress);
											$scope.rechargeDetails.userCity(_ccCity);
											$scope.rechargeDetails.userState(_ccState);
											$scope.rechargeDetails.userCountry(_ccCountryName);
											$scope.rechargeDetails.userZipCode(_ccZipCode);
										
										}
										
										// Follow up email starting process
										if (localStorage.firstRecharge == undefined) {
					
											$http.post('https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n, {subject: 'Ringvoz Top-Up MOBILE APP ' + localStorage.verifiedNumber + ' - ' + _destinationNumber, body: '<br>El cliente ha iniciado un proceso de Top-Up<br>Número de celular: ' + _destinationNumber + '<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>PaÃ­s del Cliente: ' + _ccCountryName, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}).
											success(function(data, status, headers, config) {
												
												
												if (data.response == 'send') {
													localStorage.firstRecharge = 1;
													
												} else {
													
												}
											}).
											  error(function(data, status, headers, config) {
												  $scope.hideLoading();
												  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
											});	

										}
										myNavigator.pushPage('page1.html', { animation : 'slide' } );
									} else {
										$scope.show("invalidCreditCard.html");
										localyticsSession.tagEvent("TopUp_InvalidCardInfo");
										window.analytics.trackEvent('InterTopUp', 'InvalidCreditCard');
									}                    					
                			  }).
                			  error(function(data, status, headers, config) {
                            $scope.hideLoading();
							myNavigator.pushPage('error_404.html', { animation : 'slide' } );                                  
                							
                            }); 

							} else {
								$scope.hideLoading();
								

								localyticsSession.tagEvent("TopUp_PreTransacProcess");
								window.analytics.trackEvent('InterTopUp', 'PreTransactionProcess');

								if (localStorage.userName == undefined) {
									$scope.rechargeDetails.userName(_ccFirstName);
									$scope.rechargeDetails.userLastName(_ccLastName);
									$scope.rechargeDetails.userAddress(_ccAddress);
									$scope.rechargeDetails.userCity(_ccCity);
									$scope.rechargeDetails.userState(_ccState);
									$scope.rechargeDetails.userCountry(_ccCountryName);
									$scope.rechargeDetails.userZipCode(_ccZipCode);
								
								}
								
								// Follow up email starting process
								if (localStorage.firstRecharge == undefined) {
                                   $http({
                                        url: 'https://mobileapp.ringvoz.com/V2/email?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                                        method: "POST",
                                        data: serializeData({subject: 'Ringvoz Top-Up MOBILE APP ' + localStorage.verifiedNumber + ' - ' + _destinationNumber, body: '<br>El cliente ha iniciado un proceso de Top-Up<br>Número de celular: ' + _destinationNumber + '<br>Valor de la recarga: ' + _rechargeAmount + '<br>Número del Cliente: ' + localStorage.verifiedNumber + '<br>PaÃ­s del Cliente: ' + _ccCountryName, to: 'ppronovost@ringvoz.com;cs@ringvoz.com;webregister@bellvoz.com'}),
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        }
                                        }).
                                          success(function(data, status, headers, config) { 
                   					    									if (data.response == 'send') {
											localStorage.firstRecharge = 1;
											
										} else {
											
										}
                            			  }).
                            			  error(function(data, status, headers, config) {
                                    
                                      $scope.hideLoading();
    									  myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                            							
                                        }); 

								}
								myNavigator.pushPage('page1.html', { animation : 'slide' } );
								
							}
					}
				}).
				error(function(data, status, headers, config) {
					$scope.hideLoading();
					myNavigator.pushPage('error_404.html', { animation : 'slide' } );
				});	
			} else {
				$scope.hideLoading();
				$scope.show("ccWrongInfoProvided.html");
				localyticsSession.tagEvent("TopUp_InvalidCardInfo");
				window.analytics.trackEvent('InterTopUp', 'InvalidCreditCard');
			}
		}
	}
	 
	$scope.provideCcInfoAgain = function (){
		dialog.hide();	
	}
	
	$scope.tryAgainRechargeMobile = function (){
		dialog.hide();	
	}
	
	$scope.rechargeMobile = function (){
		dialog.hide();
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {		
			$scope.isFirstRechargeFollowUpInit();
            $scope.showLoading('processingTransaction.html',100);
 
 
			window.analytics.trackEvent('InterTopUp', 'ProcessingTransaction');
			localyticsSession.tagEvent("TopUP_ProcessingTransaction");

               $http({
                    url: 'https://mobileapp.ringvoz.com/V2/topup?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                    method: "POST",
                    data: serializeData({refid: localStorage.refId, cardid: _registeredCcId, amount: _rechargeAmount, destiny: _destinationNumber, country: _countryCode, operator: _opCode}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                    }).
                      success(function(data, status, headers, config) { 
    			$scope.hideLoading();

				if (data.response.MODAL == 'TIKET') {
					localyticsSession.tagEvent("TopUP_RehargeOperator: " + _operator);
					localyticsSession.tagEvent("TopUP_RehargeCountry: " + _country);
					localyticsSession.tagEvent("TopUP_PaymentMethod: " + _paymentMethod);
					localyticsSession.tagEvent("TopUP_SuccessfulTransaction");
					window.analytics.trackEvent('InterTopUp', 'Success');
					window.analytics.trackEvent('InterTopUp', 'Success', 'DestinationCountry_' + _country);
					window.analytics.trackEvent('InterTopUp', 'Success', 'DestinationOperator_' + _operator);
					window.analytics.trackEvent('InterTopUp', 'Success', 'PaymentMethod_' + _paymentMethod);
					
					
					_updateTransaction = true;
					localStorage.updateBalance = '1';

					$scope.show("InterTopUpSuccess.html");
						
					// Follow up email starting process
					$scope.isFirstRechargeFollowUpSuccess();

					
				} else {
					$scope.hideLoading();
					localyticsSession.tagEvent("TopUP_FailedTransaction");
					window.analytics.trackEvent('InterTopUp', 'Failed');
					$scope.show("InterTopUpFailed.html");
				}
        			  }).
        			  error(function(data, status, headers, config) {
     		    $scope.hideLoading();
			    myNavigator.pushPage('error_404.html', { animation : 'slide' } );
                    }); 
		}
	}    
	
	$scope.displayTopUpHistoryView = 'visible';
	$scope.displayRechargesHistoryView = 'none';
	$scope.displayTopUps = function () {
		$scope.displayTopUpHistoryView = 'visible';
		$scope.displayRechargesHistoryView = 'none';
	}
	
	if (_updateTransaction) {
		$scope.transactionsHistory = []; 
		$http.get('https://mobileapp.ringvoz.com/V2/topuphistory/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
			success(function(data, status, headers, config) {
				$scope.transactionsHistory = data.data.data.DATA;
				_updateTransaction = false;
				$scope.displayTopUpHistoryView = 'visible';
				$scope.displayRechargesHistoryView = 'none';
		}).
			error(function(data, status, headers, config) {
				myNavigator.pushPage('error_404.html', { animation : 'slide' } );
		});
	}

	$scope.getRechargesHistory = function () {
		$scope.rechargesHistory = []; 
		$http.get('https://mobileapp.ringvoz.com/V2/history/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
			success(function(data, status, headers, config) {
				$scope.rechargesHistory = data.data.data.DATA;
				$scope.displayTopUpHistoryView = 'none';
				$scope.displayRechargesHistoryView = 'visible';
		}).
			error(function(data, status, headers, config) {
				myNavigator.pushPage('error_404.html', { animation : 'slide' } );
		});	
	}
	
	
	$scope.closeWindow = function (){
		dialog.hide();	
	}
	$scope.updateUserAccount = function(redirectTo,showMsg) {
		if (showMsg != undefined && showMsg == false) {
			dialog.hide();
		}
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {	
			if (_email.toString().length != 0) {
			    $scope.showLoading('updatingAccount.html',100);
               $http({
                    url: 'https://mobileapp.ringvoz.com/V2/personalinfo?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
                    method: "POST",
                    data: serializeData({refid: localStorage.refId, first: localStorage.userName, last: localStorage.userLastName, email: localStorage.email, address: localStorage.userAddress, city: localStorage.userCity, state: localStorage.userState, country: localStorage.userCountry, zip: localStorage.userZipCode}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                    }).
                      success(function(data, status, headers, config) { 
    				$scope.hideLoading();
					if (data.response.DATA.INFO1 == 'Update Ok ') {
						if (showMsg != undefined && showMsg == true) {
							$scope.show("accountUpdateSuccess.html");
						}
						if (redirectTo != undefined && redirectTo != '') {
							if (redirectTo == 'top_up_options.html') {
								if (_usrLg == "en-US" || _usrLg == "en-CO") {
									document.location = topUpOptionsHome;
								} else {
									document.location = topUpOptionsHome;
								}
							}
						}
					} else {
						if (showMsg != undefined && showMsg == true) {
							$scope.show("accountUpdateError.html");
						}
						if (redirectTo != undefined && redirectTo != '') {
							if (redirectTo == 'top_up_options.html') {
								if (_usrLg == "en-US" || _usrLg == "en-CO") {
									document.location = topUpOptionsHome;
								} else {
									document.location = topUpOptionsHome;
								}
							}
						}
					}        	
            
        			  }).
        			  error(function(data, status, headers, config) {
     		    				    $scope.hideLoading();
						if (showMsg != undefined && showMsg == true) {
							$scope.show("accountUpdateError.html");
						}
						if (redirectTo != undefined && redirectTo != '') {
							if (redirectTo == 'top_up_options.html') {
								if (_usrLg == "en-US" || _usrLg == "en-CO") {
									document.location = topUpOptionsHome;
								} else {
									document.location = topUpOptionsHome;
								}
							}
						}
             
                    }); 



			}

    	}	  
 	};	
	
	$scope.getUserInfo = function() {
		if (states[networkState] == 'No network connection') {
			myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
		} else {	
			           
			$http.get('https://mobileapp.ringvoz.com/V2/personalinfo/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n).
			success(function(data, status, headers, config) {
				if (data.response.MODAL != 'INFO') { 
						if (data.response.INFO1.indexOf('Created') == -1) {
							$scope.rechargeDetails.userName(data.response.INFO1);
						}
						if (data.response.INFO2.indexOf('RingVoz') == -1) {
							$scope.rechargeDetails.userLastName(data.response.INFO2);
						}
						if (data.response.INFO13 != '-') {
							$scope.rechargeDetails.userAddress(data.response.INFO13);
						}
						if (data.response.INFO6 != '-') {
							$scope.rechargeDetails.userCity(data.response.INFO6);
						}
						if (data.response.INFO8 != '-') {
							$scope.rechargeDetails.userState(data.response.INFO8);
						}
						if (data.response.INFO7 != '-') {
							$scope.rechargeDetails.userCountry(data.response.INFO7);
						}
						if (data.response.INFO9 != '-') {
							$scope.rechargeDetails.userZipCode(data.response.INFO9);	
						}															
				} else {

				}
			}).
				error(function(data, status, headers, config) {
                    myNavigator.pushPage('error_NoNetwork.html', { animation : 'slide' } );
                   // console.log(myNavigator.getCurrentPage().options.animation);
			});				
		}	  
	};		

	if (localStorage.userName == undefined || localStorage.userLastName == undefined || localStorage.userName == '' || localStorage.userLastName == '') {
		$scope.getUserInfo();	
	}
	
	$scope.accessNumbers = [];
	$scope.myAccessNumber = null;
    $scope.listAccessNumbers = function() {
	//$scope.showLoading('',100);
    /*    spinnerplugin.show({
				overlay: true,    // defaults to true
				timeout:100
			}); */
		
		//var lg = 'es';
        var tmpLang = navigator.language || navigator.userLanguage
        tmpLang = tmpLang.substr(0,2);
        console.log('language in top up:'+localStorage.lang);
        //localStorage.lang=tmpLang;
        
       // alert(lg);
		/*if (localStorage.lang == "en-US" || localStorage.lang == "en-CO") {
			lg = 'en';
		}*/
		$http({
			url: 'https://mobileapp.ringvoz.com/V2/accessnumber/RingVozApp?user=RingVozApp&pass=t3l0nlin3',
			method: "POST",
			data: serializeData({language: tmpLang}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
			}).success(function(data, status, headers, config) { 
				//$scope.hideLoading();
				$scope.accessNumbers = data;
				$scope.myAccessNumber = $scope.accessNumbers[0];
			}).error(function(data, status, headers, config) {
				//$scope.hideLoading();
			}); 	
	}
	// uncomented hb -- 07/10/2015
/*	if ($scope.accessNumbers.length == 0) {
		$scope.listAccessNumbers();
	} else {
		$scope.myAccessNumber = $scope.accessNumbers[0];
	}*/
	// end uncomented hb -- 07/10/2015
 
   // $scope.accessNumbers = [{"order": "1", "number":"7865331112","displayNumber":"786-533-1112"},{"order": "2", "number":"7865331113","displayNumber":"786-533-1113"},{"order": "3", "number":"9546011361","displayNumber":"954-601-1361"},{"order": "4", "number":"9546011362","displayNumber":"954-601-1362"},{"order": "5", "number":"5613373809","displayNumber":"561-337-3809"},{"order": "6", "number":"7862337881","displayNumber":"786-233-7881"},{"order": "7", "number":"7862337882","displayNumber":"786-233-7882"},{"order": "8", "number":"7862337883","displayNumber":"786-233-7883"},{"order": "9", "number":"7862337884","displayNumber":"786-233-7884"},{"order": "10", "number":"7862337885","displayNumber":"786-233-7885"},{"order": "11", "number":"5715087900","displayNumber":"(57)-1-508-7900"}];
   // $scope.myAccessNumber = $scope.accessNumbers[0];*/
   
   // uncomented hb -- 07/10/2015
 /*   if (localStorage.accessNumber != undefined) {
        $scope.myAccessNumber = localStorage.accessNumber.number;
    } */
	// end uncomment hb -- 07/10/2015
    
    $scope.selectAccessNumberAction = function() {
        localStorage.accessNumber = $scope.myAccessNumber.number;
    }

	$scope.directDialInfo = {
	    internationalNumber: function(newInternationalNumber) {
	    	if (angular.isDefined(newInternationalNumber)) {
	    		_directDialInterNbr = newInternationalNumber;
	    	}
	    	return _directDialInterNbr;
	    },	
	    description: function(newDescription) {
	    	if (angular.isDefined(newDescription)) {
	    		_directDialDescription = newDescription;
	    	}
	    	return _directDialDescription;
	    },	
	    position: function(newPosition) {
	    	if (angular.isDefined(newPosition)) {
	    		_directDialPosition = newPosition;
	    	}
	    	return _directDialPosition;
	    },
	};	 
	$scope.updateDirectDial = function() {
		$http({
			url: 'https://mobileapp.ringvoz.com/V2/directdial?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
			method: "POST",
			data: serializeData({refid: localStorage.refId, number: localStorage.verifiedNumber, description: 'testing', position: 3}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
			}).success(function(data, status, headers, config) { 
				
				
			}).error(function(data, status, headers, config) {
				
				
			});	
	
	}
    
	$scope.userDirectDialNumbers = [{"MODAL":"GET","INFO1":"31293","INFO2":"29495","INFO3":"1132004096","INFO4":"test2","INFO5":"1"},{"MODAL":"GET","INFO1":"31293","INFO2":"29496","INFO3":"1132004096","INFO4":"test2","INFO5":"2"}];
	
	$scope.listUserDirectDialNumbers = function() {

		$http({
			url: 'https://mobileapp.ringvoz.com/V2/directdial/' + localStorage.refId + '?user=' + localStorage.refId + '&pass=' + localStorage.u53t0k5n,
			method: "GET",
			//data: serializeData({refid: localStorage.refId, number: localStorage.verifiedNumber, description: 'testing', position: 3}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
			}).success(function(data, status, headers, config) { 
				
				
				if (angular.isObject(data.data.data.DATA) && data.data.data.DATA.length > 0) {
					$scope.userDirectDialNumbers = data.data.data.DATA;
					//$scope.userDirectDialNumbers = [{"MODAL":"GET","INFO1":"31293","INFO2":"29495","INFO3":"1132004096","INFO4":"test2","INFO5":"1"},{"MODAL":"GET","INFO1":"31293","INFO2":"29496","INFO3":"1132004096","INFO4":"test2","INFO5":"2"}];
						
						_directDialNextPosition = ($scope.parseInteger(data.data.data.DATA.length)) + 1;
					}				

			}).error(function(data, status, headers, config) {
				
				
			});	
		
	
	}
	
	$scope.displayUserDirectDialNumbers = function() {
		$scope.listUserDirectDialNumbers();
		myNavigator.pushPage('directDial.html', { animation : 'slide' } );		
	}
    
    $scope.callDirectDial = function() {
        
        alert('calling contact');
    }
	$scope.editDirectDial = function(interNbr, desc, pos) {
 
        alert(interNbr + ' ' + desc + ' ' + pos);
		$scope.directDialInfo.internationalNumber(interNbr);
		$scope.directDialInfo.description(desc);
		$scope.directDialInfo.position(pos);
		
		myNavigator.pushPage('directDialAddNumber.html', { animation : 'slide' } );
    }	
	$scope.addDirectDial = function() {
		$scope.directDialInfo.internationalNumber('');
		$scope.directDialInfo.description('');
		$scope.directDialInfo.position(0);
 
     
		myNavigator.pushPage('directDialAddNumber.html', { animation : 'slide' } );
    }	
	
  
  
    $scope.showAddDirectDialNbr = function() {
        
        myNavigator.pushPage('directDialAddNumber.html', { animation : 'slide' } );
    }    
    
   
    
    $scope.displayAccessNbrIfSetup = function() {
         if (localStorage.accessNumber == undefined) {
            
           return 'none';
        } else {
           
            return 'visible';
        }
    }
    $scope.hideAccessNbrIfSetup = function() {
         if (localStorage.accessNumber == undefined) {
           
           return 'visible';
        } else {
           
            return 'none';
        }
    }
    
	$scope.displayAccessNumberSetup = function() {
		$scope.listAccessNumbers();
        myNavigator.pushPage('accessNumberSetup.html', { animation : 'slide' } );
       // console.log(myNavigator.getCurrentPage().options.animation);
	}	
	
    $scope.callAccessNumber = function(isSetupPage) {
        if (localStorage.accessNumber == undefined) {
			if (!isSetupPage) {
				$scope.displayAccessNumberSetup();
			} else {
				$scope.callNumber($scope.parseInteger(localStorage.accessNumber));
			}
        } else {
		
			$scope.callNumber($scope.parseInteger(localStorage.accessNumber));
			if (isSetupPage) {
				myNavigator.popPage();
			}
        }
    }
    
    $scope.onSuccessSavingAccessNumber = function() {
	    $scope.show('accessNumberSavedSuccessfully.html');
	};
    $scope.onErrorSavingAccessNumber = function() {
		$scope.show('accessNumberSavedFailed.html');
	}; 
        

		
		
		
		
		


		
		
		
		
		
		
		// onSuccess: Get a snapshot of the current contacts
// uncomment hb -- 07/10/2015
/*	function onSuccess(contacts) {
		for (var i = 0; i < contacts.length; i++) {
			console.log("Display Name = " + contacts[i].displayName);
		}
	}

	// onError: Failed to get the contacts

	function onError(contactError) {
		//alert('onError!');
	}	*/
// end uncomment hb -- 07/10/2015


	$scope.isAccessNumberExists = function() {
		// find all contacts with 'RingVoz - ' in any name field
		var options      = new ContactFindOptions();
		options.filter   = $scope.lg.get("accessNumberLog");
		options.multiple = true;
		var fields       = ["displayName", "nickname"];
		//navigator.contacts.find(fields, onSuccess, onError, options);	
		navigator.contacts.find(fields, function onSuccess(contacts) {
		//for (var i = 0; i < contacts.length; i++) {
		//	console.log("Display Name = " + contacts[i].displayName);
		//}
		if (contacts.length > 0) {
			return true;
		} else {
			return false;
		}
	}, function onError(contactError) {
		return false;
	}, options);	
	}	
		
		
    $scope.addAccessNbrToPhonebook = function() {
		// find all contacts with 'RingVoz - ' in any name field
		var options      = new ContactFindOptions();
		options.filter   = $scope.lg.get("accessNumberLog");
		options.multiple = true;
		var fields       = ["displayName", "nickname"];
		//navigator.contacts.find(fields, onSuccess, onError, options);	
		navigator.contacts.find(fields, function onSuccess(contacts) {
			if (contacts.length == 0) {
				var contact = navigator.contacts.create();
				contact.displayName = $scope.lg.get("accessNumberLog");
				contact.nickname = $scope.lg.get("accessNumberLog"); 
				
				var phoneNumbers = [];
				phoneNumbers[0] = new ContactField('other', $scope.myAccessNumber.number, false);
				contact.phoneNumbers = phoneNumbers;
			
				// populate some fields
				var name = new ContactName();
				contact.name = name;

				// save to device
				contact.save($scope.onSuccessSavingAccessNumber(),$scope.onErrorSavingAccessNumber());
				
				localStorage.accessNumber = $scope.myAccessNumber.number;
				
				$scope.show('accessNumberExist.html');
			} else {
				alert('contact already exists!');
				//$scope.show('accessNumberExist.html');
			}
		}, function onError(contactError) {
			alert('could not find contact!');
			//$scope.show('accessNumberExist.html');
		}, options);	






		// uncomment hb -- 07/10/2015
	
     /*   if ($scope.isAccessNumberExists() === false) {
        
			var contact = navigator.contacts.create();
			contact.displayName = $scope.lg.get("accessNumberLog");
			contact.nickname = $scope.lg.get("accessNumberLog"); 
			//contact.photos = 'https://www.ringvoz.com/imgs/logos/logo_ringvoz-2014.png';
			var phoneNumbers = [];
			phoneNumbers[0] = new ContactField('other', $scope.myAccessNumber.number, false);
			contact.phoneNumbers = phoneNumbers;
		
			// populate some fields
			var name = new ContactName();
			//name.givenName = "Jane";
			//name.familyName = "Doe";
			contact.name = name;

			// save to device
			contact.save($scope.onSuccessSavingAccessNumber(),$scope.onErrorSavingAccessNumber());
			
			localStorage.accessNumber = $scope.myAccessNumber.number;
			
			$scope.show('accessNumberExist.html');
		} else {
			$scope.show('accessNumberExist.html');
		}*/
		// end uncomment hb -- 07/10/2015
    }
   
 
   
   
	$scope.displayAccountInfoSetup = function() {
		myNavigator.pushPage('myAccountInfoSetup.html', { animation : 'slide' } );
	}
});


	

app.controller('DialogController', function($scope) {
	  
	  $scope.show = function(dlg) {
	    ons.createDialog(dlg).then(function(dialog) {
	      dialog.show();
	    });
	  }
	});

app.controller('NotificationController', function($scope) {
	  $scope.alert = function() {
	    ons.notification.alert({message: 'An error has occurred!'});
	  }
	  
	  $scope.confirm = function() {
	    ons.notification.confirm({
	      title: 'Ingresa su correo electronico',
	      //message: 'Provide your email address',
	      callback: function(idx) {
	        switch(idx) {
	          case 0:
	            ons.notification.alert({
	              message: 'Canceling registration...'
	            });
	            break;
	          case 1:
	            ons.notification.alert({
	              message: 'Proceeding Registration...'
	            });
	            break;
	        }
	        document.location='welcome.html';
	      }
	    });
	  }

	  
});