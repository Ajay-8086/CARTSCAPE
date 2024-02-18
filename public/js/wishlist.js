//Gettitng wish list count ================================================================>
function wishlistCount(count){
    const counts = document.getElementById('wishlistCount')
    counts.innerHTML = count !==0 ? count :''
}

//showing wishlist count and updating it===================================================>
document.addEventListener('DOMContentLoaded',async function(){
    try {
        const response = await axios.get('/wishlistcount')
        if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
            const wishlistedProducts = response.data.wishlist.productId;
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const productId = product.querySelector('.wishlist-icon').getAttribute('data-product-id');
                if (wishlistedProducts.includes(productId)) {
                    document.getElementById('wish' + productId).classList.add('red');
                }
            });
            wishlistCount(response.data.count);
        } else {
            wishlistCount('');
        }
   } catch (error) {
    console.log(error);
   }
})
//Adding item to wishlist =========================================================>
async function addToWhislist(productId){
    try {
      const wishlist = document.getElementById(`wish${productId}`)
      const response = await axios.post('/addtoWhislist?productId='+productId)
      if (response.status === 401) {
        const myModal = new mdb.Modal(document.getElementById('exampleModal'));
        myModal.show();
      }
      if(response.data.success){
        wishlist.classList.add('red')
      }else{
       
        wishlist.classList.remove('red')
    }
    wishlistCount(response.data.count)
    } catch (error) {
      console.log(error);
    }
  }

  //Delete item from the wishlist==========================================================>

  async function deleteWishList(productId){
    try {
        const response = await axios.delete(`/wishlist_remove?id=${productId}`)
        if(response.status==200){
            document.querySelector('.wish'+productId).remove()
            wishlistCount(response.data.count)
        }else{
            console.log('error occured');
        }
    } catch (error) {
        console.log('error');
    }
}