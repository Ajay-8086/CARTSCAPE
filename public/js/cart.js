function cartCount(count){
    const counts = document.getElementById('cartCount')
    counts.innerHTML = count !==0 ? count :''
}

document.addEventListener('DOMContentLoaded',async function(){
    try {
        const response = await axios.get('/cartcount')
        if(response.status==401){
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty please login'
        }
        else if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
            const cartProducts = response.data.cart.productId.map(item => item.id);
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const productId = product.querySelector('.cartBtn').getAttribute('data-product-id');
                if (cartProducts.includes(productId)) {
                    document.getElementById('cart' + productId).innerText="Go to cart"
                    document.getElementById('cart' + productId).setAttribute('href', '/view_cart')
                }
            });
            cartCount(response.data.count);
        } else {
            cartCount('');
            document.querySelector('.cartTitle').innerHTML='Your Cart is empty'
        }
   } catch (error) {
    console.log(error);
   }
})

async function addingToCart(productId){
    try {
        console.log('fdsh');
        console.log(productId);
        const response  = await axios.post('/addtocart',{id:productId})
        console.log('res',response);
        if (response.status === 401) {
            const myModal = new mdb.Modal(document.getElementById('exampleModal'));
            myModal.show();
          }else{
            document.getElementById('cart' + productId).innerText="Go to cart"
            document.getElementById('cart' + productId).setAttribute('href', '/view_cart')
            cartCount(response.data.count)
          }
    } catch (error) {
        console.log(error.message);
    }
}