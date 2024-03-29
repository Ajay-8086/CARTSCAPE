
//Gettitng wish list count ================================================================>
function wishlistCount(count){
    const counts = document.getElementById('wishlistCount')
    counts.innerHTML = count !==0 ? count :''
}
//showing wishlist count and updating it===================================================>
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('/wishlistcount');
        if (response.status === 200 && response.data.isLogged && response.data.count > 0) {
            wishlistCount(response.data.count);
            const wishlistedProducts = response.data.wishlist.productId;
            wishlistedProducts.forEach(element => {
                const wishlistBtn = document.querySelector(`.wish${element}`);
                if (wishlistBtn) {
                    wishlistBtn.classList.add('red');
                }
            });
        } else {
            wishlistCount('');
            document.querySelector('.wishlistTitle').innerHTML = 'Your Wishlist is Empty';
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

//Adding item to wishlist =========================================================>
async function addToWhislist(productId,event){
    try {
        event.stopPropagation()
      const wishlist = document.querySelector(`.wish${productId}`)
      const response = await axios.post('/addtoWhislist?productId='+productId)
     
      if(response.data.success){
        wishlist.classList.add('red')
      }else{
       
        wishlist.classList.remove('red')
    }
    wishlistCount(response.data.count)
    } catch (error) {
            if(error.response.status==401){
                const myModal = new mdb.Modal(document.getElementById('exampleModal'));
                myModal.show();
            } else{
                console.log('error');
            }
        }
    }
   

  //Delete item from the wishlist==========================================================>

  async function deleteWishList(productId){
    try {
        const response = await axios.delete(`/wishlist_remove?id=${productId}`)
        if(response.status==200){
            document.querySelector('.wishing'+productId).remove()
             wishlistCount(response.data.count)
           if(response.data.count==0){
            document.querySelector('.wishlistTitle').innerHTML='your Wishlist is Empty'
           }
        }else{
            console.log('error occured');
        }
    } catch (error) {
        console.log('error');
    }
}