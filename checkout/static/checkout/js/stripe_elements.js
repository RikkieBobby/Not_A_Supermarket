document.addEventListener('DOMContentLoaded', function() {
    const stripe_public_key = document.getElementById('id_stripe_public_key').textContent;
    const client_secret = document.getElementById('id_client_secret').textContent;

    const stripe = Stripe(stripe_public_key);
    const elements = stripe.elements();

    const style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    const card = elements.create('card', {style: style, hidePostalCode: true});
    card.mount('#card-element');

    card.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', function(ev) {
        ev.preventDefault();

        console.log('Form submission started.');

        const saveInfoCheckbox = document.getElementById('id-save-info');
        const saveInfo = saveInfoCheckbox ? saveInfoCheckbox.checked : false;
        const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;
        const postData = {
            'csrfmiddlewaretoken': csrfToken,
            'client_secret': client_secret,
            'save_info': saveInfo,
        };
        const url = '/checkout/cache_checkout_data/';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Include CSRF token in headers
            },
            body: JSON.stringify(postData),
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log('Received data from cache_checkout_data endpoint:', data);

            stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: form.full_name.value.trim(),
                        email: form.email.value.trim(),
                        phone: form.phone_number.value.trim(),
                        address: {
                            line1: form.street_address1.value.trim(),
                            line2: form.street_address2.value.trim(),
                            city: form.town_or_city.value.trim(),
                            state: form.county.value.trim(),
                            country: form.country.value.trim(),
                        },
                    },
                },
                shipping: {
                    name: form.full_name.value.trim(),
                    phone: form.phone_number.value.trim(),
                    address: {
                        line1: form.street_address1.value.trim(),
                        line2: form.street_address2.value.trim(),
                        city: form.town_or_city.value.trim(),
                        state: form.county.value.trim(),
                        postal_code: form.postcode.value.trim(),
                        country: form.country.value.trim(),
                    },
                },
            }).then(function(result) {
                if (result.error) {
                    console.error('Error from Stripe:', result.error);
                    const errorDiv = document.getElementById('card-errors');
                    const html = `
                        <span class="icon" role="alert">
                        <i class="fas fa-exclamation-circle"></i>
                        </span>
                        <span>${result.error.message}</span>`;
                    errorDiv.innerHTML = html;
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        console.log('Payment succeeded, submitting form.');
                        form.submit();
                    }
                }
            }).catch(function(error) {
                console.error('Error confirming card payment:', error);
            });
        }).catch(function(error) {
            console.error('Error during fetch:', error);
        });
    });
});
