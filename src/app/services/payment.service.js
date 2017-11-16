function PaymentService($http, $q) {
  const service = {
    getPaymentDetails: function (salePrice) {
      var deferred = $q.defer();

      $http.post('https://preprod.paymeservice.com/api/generate-sale', {
        seller_payme_id: "MPL14985-68544Z1G-SPV5WK2K-0WJWHC7N",
        sale_price: salePrice,
        currency: "USD",
        product_name: "Payment for files",
        installments: "1",
        language: "en"
      }).then((res) => {
        if (res && res.data && res.data.status_code === 0) {
          deferred.resolve(res.data);
        } else {
          deferred.reject(res.data);
        }
      }, (err) => {
        deferred.reject(err.data);
        console.error("error while trying to generate payment")
      });

      return deferred.promise;
    }
  };

  return service;
}

export default angular.module('feTaskApp.payment', [])
  .factory('PaymentService', PaymentService)
  .name;
