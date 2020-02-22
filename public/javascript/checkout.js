/*const stripe = Stripe('pk_test_ci94TqhPSMbllAUyE7VGiGky00y8d9QVWr');
console.log(1);
var $form = $('checkout-form'); 

$form.submit(function(e){
  console.log(1);
  document.write(1);
  $form.find('button').prop('disabled',true);
  stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  },stripeResponseHandler);
 return false;
});
function stripeResponseHandler(status, response){
  if (response.error){
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('d-none');
    $form.find('button').prop('disabled',false);
  }
  else{
    var token = response.id;
    $form.append($('<input type= "d-none" name="stripeToken" />').val(token));
    $form.get(0).submit();
  }
}*/

const stripe = Stripe('pk_test_ci94TqhPSMbllAUyE7VGiGky00y8d9QVWr'); // Your Publishable Key
const elements = stripe.elements();

// Create our card inputs
var style = {
  base: {
    color: "#000000"
  }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.getElementById('Payment-form');
const errorEl = document.querySelector('#card-errors');
console.log('cart is empty 1');

// Give our token to our form
const stripeTokenHandler = token => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);
  console.log('cart is empty 2');
  form.submit();
}

// Create token from card data
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

/*form.addEventListener('submit', e => {
  e.preventDefault();
 document.write(1);
  stripe.createToken(card).then(res => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  })
})
*/


