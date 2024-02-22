
function redirectToProduct(productId) {
    window.location.href = "/products_page?id=" + productId;
}

document.addEventListener('DOMContentLoaded',async()=>{

    function wishlistCount(count){
        const counts = document.getElementById('wishlistCount')
        counts.innerHTML = count !==0 ? count :''
    }

    function cartCount(count){
        const counts = document.getElementById('cartCount')
        if (count == null || count === undefined || count === 0) {
            counts.innerHTML = '';
          } else {
            counts.innerHTML = count;
          }   
    }

    try {
        const response = await axios.get('/cartcount')
        if(response.status==401){
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty please login'
        }
        else if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
            cartCount(response.data.count);
            const cartProducts = response.data.cart.productId
            console.log(cartProducts);
            cartProducts.forEach(product=>{
                console.log(product);
                let id =product.id
                console.log(id);
               let cartBtn = document.querySelector(`.cart${id}`)
               cartBtn.innerText="Go to cart"
                cartBtn.setAttribute('href', '/view_cart')
            })
        } else {
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty'
        }
   } catch (error) {
    console.log(error);
   }

//    ----------------------------------------------------------------------------------
try {

    const response = await axios.get('/wishlistcount')
    if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
        wishlistCount(response.data.count);
        const wishlistedProducts = response.data.wishlist.productId;
        wishlistedProducts.forEach(element => {
            console.log('wishlist',element);
            const wishlistBtn =  document.querySelector(`.wish${element}`)
            wishlistBtn.classList.add('red')
        });
    } else {
        wishlistCount('');
        document.querySelector('.wishlistTitle').innerHTML='your Wishlist is Empty'
    }
} catch (error) {
console.log(error);
}



})





