(function(){
	angular.module("QuickDonate", [])
			.controller("UserController", UserController)
			.controller("WishController", WishController)
			.service("UserService", UserService)
			.service("WishService", WishService);
	
	
	UserController.$inject = ['UserService'];
	function UserController(UserService) {
		var userCtrl = this;
		userCtrl.search = function(id) {
			var promise = UserService.search(id);
			promise.then(function(result){
				userCtrl.user = result;
			}).catch(function(error){
				console.log("UserService could not get a User record " + error);
			});
		}
	}
	
	UserService.$inject = ['$http'];
	function UserService($http) {
		var userService = this;
		
		userService.search = function(id) {
			var response = $http({
				method : 'GET',
				url : ('http://localhost:8080/quickdonate/application/user/' + id)
			}).then(function(result){
				var user = result.data; 
				return user;
			});
			return response;
		};
	}
	
	WishController.$inject = ['WishService'];
	function WishController(WishService) {
		var wishCtrl = this;
		wishCtrl.showEditForm = false;
		wishCtrl.wishes = []; 
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
		
		wishCtrl.getWish = function(id) {
			var promise = WishService.getWish(id);
			promise.then(function(result){
				wishCtrl.wish = result;
			}).catch(function(error){
				console.log("WishService could not get a Wish record " + error);
			});
		};
		
		wishCtrl.getWishes = function() {
			getWishes();
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
		
		wishCtrl.updateWish = function(wish) {
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
			markWishAsFulfilled(wishCtrl.wish)
			console.log('Payment Success Response', response);
		}

		function onPaymentFailureHandler (response) {
			console.log('Payment Failure Response', response);
		}
		
		Instamojo.configure({
	        handlers: {
	          onSuccess: onPaymentSuccessHandler,
	          onFailure: onPaymentFailureHandler
	        }
	    });
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
		
	}
	
})();