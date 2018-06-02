(function(){
	angular.module("QuickDonate", [])
			.controller("WishController", WishController)
			.service("WishService", WishService);
	
	WishController.$inject = ['WishService'];
	function WishController(WishService) {
		var wishCtrl = this;
		wishCtrl.showEditForm = false;
		wishCtrl.showDonorAadharIdForm = false;
		wishCtrl.wishes = [];
		wishCtrl.error = {
				isError : false,
				message : ""
		};
		getWishes();
		
		function getWishes() {
			var promise = WishService.getWishes();
			promise.then(function(result){
				wishCtrl.wishes = result;
			}).catch(function(error){
				console.log("WishService could not get Wishes " + error);
			});
		}
		
		function clear() {
			wishCtrl.wish = {
					message : '',
					amount : ''
			};
		}
		
		wishCtrl.getWishes = function() {
			getWishes();
		};
		
		wishCtrl.performOperation = function(operation, wish) {
			switch(operation) {
				case "creating" : wishCtrl.createWish(wish);
								break;
				case "updating" : wishCtrl.createWish(wish);
								  break;
				case "deleting" : wishCtrl.deleteWish(wish.id);
								break;
				case "fulfilling" : wishCtrl.fulfillWish(wish);
								break;
				default : console.log("Invalid operation in wish gallery!");
			}
		}
		
		wishCtrl.authenticate = function(operation, wish) {
			wishCtrl.error.isError = false;
			var authenticationObject = {};
			if (operation === 'fulfilling') {
				authenticationObject = {
						  "aadhaar_id" : wish.donorAadharId,
						  "otp" : "123456",
						  "txn_id" : "547039586626" 
						};
			} else {
				authenticationObject = {
						  "aadhaar_id" : wish.beneficiaryAadharId,
						  "otp" : "123456",
						  "txn_id" : "547039586626" 
						};
			} 
			var promise = WishService.authenticateWish(authenticationObject, wish);
			promise.then(function(result){
				console.log("Beneficiary/Donor is authenticated using Aadhar AUTH API for operation " + operation);
				wishCtrl.performOperation(operation, wish);
			}).catch(function(error){
				if (error.data.code == 'REQUEST_VALIDATION_FAILED') {
					wishCtrl.error.isError = true;
					wishCtrl.error.message = "Please give correct Aadhar ID while " + operation + " a wish!";
				}
				console.log("Error : User could not be authenticated using Aadhar AUTH API : " + error.data.code + ":" + error.data.message);
			});
		};
		
		wishCtrl.showDonorDetails = function(wish) {
			wishCtrl.wish = {
					id : wish.id,
					message : wish.message,
					amount : wish.amount,
					beneficiaryName : wish.beneficiaryName,
					beneficiaryAccount : {
						virtualPaymentAddress : wish.beneficiaryAccount.virtualPaymentAddress
					},
					beneficiaryAadharId : wish.beneficiaryAadharId,
					donorAadharId : wish.donorAadharId
				};
			wishCtrl.error.isError = false;
			wishCtrl.showEditForm = false;
			wishCtrl.showDonorAadharIdForm = true;
		};
		
		wishCtrl.getWish = function(id) {
			var promise = WishService.getWish(id);
			promise.then(function(result){
				wishCtrl.wish = result;
			}).catch(function(error){
				console.log("WishService could not get a Wish record " + error);
			});
		};
		
		wishCtrl.createWish = function(wish) {
			if (wish.id > 0){
				var promise = WishService.updateWish(wish.id, wish);
				promise.then(function(result){
					//successfully updated
					clear();
					getWishes();
				}).catch(function(error){
					console.log("WishService could not update a wish " + error);
				});
			} else {
				var promise = WishService.createWish(wish);
				promise.then(function(result){
					//successfully created
					clear();
					getWishes();
				}).catch(function(error){
					console.log("WishService could not create a wish " + error);
				});
			}
			wishCtrl.showEditForm = false;
		};
		
		wishCtrl.showWish = function(wish) {
			wishCtrl.wish = {
				id : wish.id,
				message : wish.message,
				amount : wish.amount,
				beneficiaryName : wish.beneficiaryName,
				beneficiaryAccount : {
					virtualPaymentAddress : wish.beneficiaryAccount.virtualPaymentAddress
				},
				beneficiaryAadharId : wish.beneficiaryAadharId
			};
			wishCtrl.error.isError = false;
			wishCtrl.showDonorAadharIdForm = false;
			wishCtrl.showEditForm = true;
		};
		
		wishCtrl.deleteWish = function(id) {
			var promise = WishService.deleteWish(id);
			promise.then(function(result){
				//Successfully deleted
				getWishes();
			}).catch(function(error){
				console.log("WishService could not delete a Wish " + error);
			});
			wishCtrl.showEditForm = false;
		};
		
		wishCtrl.fulfillWish = function(wish) {
			wishCtrl.wish = wish;
			Instamojo.open('https://test.instamojo.com/@priyatalwalkar/lbe946e9572114de995407d452c721ac9/');
		};
		
		function markWishAsFulfilled(wish) {
			var promise = WishService.fulFillWish(wish);
			promise.then(function(result){
				getWishes();
			}).catch(function(error){
				console.log("WishService could not fulfill a Wish " + error);
			});
		}
		
		function onPaymentSuccessHandler (response) {
			wishCtrl.showDonorAadharIdForm = false;
			markWishAsFulfilled(wishCtrl.wish)
			console.log('Payment Success Response', response);
		}

		function onPaymentFailureHandler (response) {
			console.log('Payment Failure Response', response);
		}
		
		if (Instamojo != undefined) {
			Instamojo.configure({
		        handlers: {
		          onSuccess: onPaymentSuccessHandler,
		          onFailure: onPaymentFailureHandler
		        }
		    });
		}
	}
	
	WishService.$inject = ['$http'];
	function WishService($http) {
		var wishService = this;
		
		wishService.getWish = function(id) {
			var response = $http({
				method : 'GET',
				url : ('http://localhost:8080/quickdonate/application/wish/' + id)
			}).then(function(result){
				var wish = result.data;
				return wish;
			});
			return response;
		};
		
		wishService.getWishes = function() {
			var response = $http({
				method : 'GET',
				url : ('http://localhost:8080/quickdonate/application/wish')
			}).then(function(result){
				var wishes = result.data;
				return wishes;
			});
			return response;
		};
		
		wishService.createWish = function(wish) {
			var response = $http({
				method : 'POST',
				url : ('http://localhost:8080/quickdonate/application/wish'),
				data : wish
			}).then(function(result){
				return result;
			});
			return response;
		};
		
		wishService.updateWish = function(id, wish) {
			var response = $http({
				method : 'PUT',
				url : ('http://localhost:8080/quickdonate/application/wish/' + id),
				data : wish
			}).then(function(result){
				return result;
			});
			return response;
		};
		
		wishService.deleteWish = function(id) {
			var response = $http({
				method : 'DELETE',
				url : ('http://localhost:8080/quickdonate/application/wish/' + id)
			}).then(function(result){
				return result;
			});
			return response;
		};
		
		wishService.fulFillWish = function(wish) {
			var response = $http({
				method : 'PUT',
				url : ('http://localhost:8080/quickdonate/application/wish/fulfill/' + wish.id),
				data : wish
			}).then(function(result){
				return result;
			});
			return response;
		};
		
		wishService.authenticateWish = function(authenticationObject, wish) {
			var response = $http({
				method : 'POST',
				url : ('https://ext.digio.in:444//test/otpkyc'),
				data : authenticationObject
			}).then(function(result){
				return result;
			});
			return response;
		};
	}
	
})();