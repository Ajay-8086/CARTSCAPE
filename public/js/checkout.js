// Add event listener to each radio button
function changingAdrs(adId,address,city,houseNo,pin,altrNo) {
      // Update the checkout form fields with the retrieved data
      document.querySelector('.address_id').value = adId;
      document.querySelector('.address-field').value = address;
      document.querySelector('.city-field').value = city;
      document.querySelector('.house_no-field').value = houseNo;
      document.querySelector('.postalcode-field').value = pin;
      document.querySelector('.altr_number-field').value = altrNo;
    }
const couponRadio = document.querySelectorAll("input[name='couponRadio']");
couponRadio.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const couponCode = radio.value;
      document.getElementById('coupon-input').value = couponCode;
    }
  })
})
// apply coupon code
let couponApplied = false;
async function applyPromoCode(event) {
  event.preventDefault()
  if (couponApplied) {
    return;
  }

  const couponCode = document.querySelector('.couponInput').value
  if (!couponCode) {
    document.querySelector('.couponError').innerHTML = 'Invalid coupon code'
    setTimeout(() => {
      document.querySelector('.couponError').innerHTML = ''
    }, 3000);
  } else {
    try {
      const response = await axios.post('/verify-coupon', {
        coupon: couponCode
      })
      if (response.status == 200) {
        const discount = response.data.discount
        let total = document.getElementById('updatedPrice')
        const totalPrice = total.innerText.replace(/\₹|,/g, '')
        const grandTotal = parseInt(totalPrice) - (parseInt(totalPrice) * parseInt(discount) / 100)
        total.innerText = '₹' + parseInt(grandTotal)
        couponApplied = true
      }
    } catch (error) {
      console.log(error);
    }
  }
}
const continueBtn = document.getElementById('continueBtn');

continueBtn.addEventListener('click', async(event) => {
event.preventDefault();
try {
const products = [];
const productElements = document.querySelectorAll('.list-group-item');
productElements.forEach((productElement) => {
const id = productElement.querySelector('.productIds').innerText;
const quantity = parseInt(productElement.querySelector('.text-muted').innerText.replace('Qty:', ''));
const price = parseFloat(productElement.querySelector('.text-muted.ms-4').innerText.replace('$', ''));

// Gather selected color and size
const selectedColorElement = productElement.querySelector(`#color_${id}`);
const selectedSizeElement = productElement.querySelector(`#size_${id}`);
const selectedColor = selectedColorElement ? selectedColorElement.value : null;
const selectedSize = selectedSizeElement ? selectedSizeElement.value : null;

products.push({ id, quantity, price, selectedColor, selectedSize });
});

let total = document.getElementById('updatedPrice')
const totalPrice = total.innerText.replace(/\₹|,/g, '')

const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked').value;
const email = document.getElementById('typeEmail').value;
const addressId = document.querySelector('.address_id').value

// Send product information to the server using Axios
document.getElementById('preloader').style.display = 'block';
const response = await axios.post('/checkout', { products, email, payment: selectedPaymentMethod, totalPrice, addressId });
document.getElementById('preloader').style.display = 'none';
if (response.status == 200) {
if (response.data.online) {
const amountPaisa = response.data.order.amount 
  var options = {
      "key": 'rzp_test_KPvItqMWEp5C2S',
      "amount": amountPaisa, 
      "currency": "INR",
      "name": "CartScape",
      "description": "Test Transaction",
      "order_id": response.data.order.id,
      "handler":async function (response) {
        const result = await axios.post('/confirm-payment',{
          data:response,
        })
        if(result.data.payment){
          window.location.href = '/my-orders'
        }else{
          window.location.href='/'
        }
         
      },
  };

  var rzp1 = new Razorpay(options);

  rzp1.on('payment.failed', function (response) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
     
    });
  });

  rzp1.open();

} else {
  window.location.href = '/cod-otp';
}
}
} catch (error) {
console.error('Error while sending product information:', error);
}
});