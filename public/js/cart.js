window.onload = async function (){
    try {
        const response = await axios.get('/cartcount')
        if(response.status==401){
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty please login'
        }
        else if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
            cartCount(response.data.count);
        } else {
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty'
        }
   } catch (error) {
    console.log(error);
   }
}

//Getting cart count==============================================================================================>
function cartCount(count){
    const counts = document.getElementById('cartCount')
    if (count == null || count === undefined || count === 0) {
        counts.innerHTML = '';
      } else {
        counts.innerHTML = count;
      }   
}


async function addingToCart(productId,event){
    try {
        event.stopPropagation()
        const response  = await axios.post('/addtocart',{id:productId})
        if (response.status == 200) {
            document.querySelector('.cart' + productId).innerText="Go to cart"
            cartCount(response.data.count)
            document.querySelector('.cart' + productId).setAttribute('href', '/view_cart')
        }
    } catch (error) {
        if(error.response.status===401){
            const myModal = new mdb.Modal(document.getElementById('exampleModal'));
            myModal.show();
        }
        else{
            console.log(error);
        }
    }
}

function updatingTotal(price){
   const totalPrice = document.querySelector('.totalPrice')
    let total = totalPrice.innerText.replace(/\$|,/g, '')
    let  totalAmount = parseInt(total)+parseInt(price)
    totalPrice.innerText = '$'+totalAmount 
    const discount = document.querySelector('.discount')
    let discountAmount = parseInt(totalAmount*.05)
    discount.innerText = '-$'+discountAmount
    const tax = document.querySelector('.tax') 
    let taxAmount = parseInt(totalAmount*.01)
    tax.innerText='$'+taxAmount 
    const grantTotal = document.querySelector('.grandTotal')
    grantTotal.innerText ='$'+( taxAmount + totalAmount - discountAmount  )
    
}

async function quantityChange(id,operation,stock){
    const quantityInput =  document.querySelector('.quantity-input'+id)
    const discountedPrice = document.querySelector('.discount'+id)
    const originalPrice = document.querySelector('.price'+id)
    let price = originalPrice.innerText.replace(/\$|,/g, '')
    let discount = discountedPrice.innerText.replace(/\$|,/g, '')
    let quantity = parseInt(quantityInput.value)
    let priceOfAnItem = parseInt(discount/quantity)
    let originaPriceOfAnItem = parseInt(price/quantity)
    if(quantity>1 && operation=='decrease'){
        quantity--;
        quantityInput.value = quantity
        discountedPrice.innerText ='$'+(parseInt(discount) -parseInt( priceOfAnItem))
        originalPrice.innerText = '$'+(parseInt(price)-parseInt( originaPriceOfAnItem))
        updatingTotal(priceOfAnItem*-1)
        if(parseInt(quantityInput.value) < stock){
            document.querySelector('.stockDetails'+id).innerText = ''
        }else{
            document.querySelector('.stockDetails'+id).innerText = 'Out of stock'
        }
    }else if(operation=='increase'){
        quantity++
        quantityInput.value = quantity
        discountedPrice.innerText ='$'+(parseInt(discount) +parseInt( priceOfAnItem))
        originalPrice.innerText = '$'+(parseInt(price)+parseInt( originaPriceOfAnItem))
        updatingTotal(priceOfAnItem)
        if(parseInt(quantityInput.value) < stock){
            document.querySelector('.stockDetails'+id).innerText = ''
        }else{
            document.querySelector('.stockDetails'+id).innerText = 'Out of stock'
        }
    }else{
        return
    }
try {
    await  axios.patch(`/cart_quanatity`,{
        id:id,
        quantity:quantity
    })
} catch (error) {
    console.log(error);
}
}

async function removeFromCart(id){
    try {
       const discountedPrice =  document.querySelector('.discount'+id).innerText
        let discount = discountedPrice.replace(/\$|,/g, '')
        const response  = await  axios.delete(`/remove_cart?id=${id}`)
        if(response.status==200){
            document.querySelector('.cartDetails'+id).remove()
            updatingTotal(discount*-1)
              cartCount(response.data.count)
            if(response.data.count==0){
                document.querySelector('.cartTitle').innerHTML='Your Cart is empty'
            }
        }else{
            console.log('error');
        }
    } catch (error) {
        console.log(error);

    }
}
