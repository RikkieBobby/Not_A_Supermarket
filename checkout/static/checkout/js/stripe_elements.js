document.addEventListener('DOMContentLoaded', function() {
    const stripe_public_key = document.getElementById('id_stripe_public_key').textContent;
    const client_secret = document.getElementById('id_client_secret').textContent;

    // Initialize Stripe with the public key
    const stripe = Stripe(stripe_public_key);
    const elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    const style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    // Create an instance of the card Element.
    const card = elements.create('card', {style: style, hidePostalCode: true});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Handle form submission.
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();;

        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: form.full_name.value,
                    email: form.email.value,
                    address: {
                        line1: form.street_address1.value,
                        line2: form.street_address2.value,
                        city: form.town_or_city.value,
                        state: form.county.value,
                        postal_code: form.postcode.value,
                        country: form.country.value,
                    },
                },
            },
        });

        if (error) {
            // Show error to your customer
            console.error(error.message);
        } else {
            // The payment has been processed!
            if (paymentIntent.status === 'succeeded') {
                form.submit();
            }
        }
    });
});
