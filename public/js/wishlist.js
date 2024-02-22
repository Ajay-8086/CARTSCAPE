
//Gettitng wish list count ================================================================>


//showing wishlist count and updating it===================================================>
//Adding item to wishlist =========================================================>
async function addToWhislist(productId){
    try {
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
           const countsResult =  wishlistCount(response.data.count)
           if(!countsResult){
            document.querySelector('.wishlistTitle').innerHTML='your Wishlist is Empty'
           }
        }else{
            console.log('error occured');
        }
    } catch (error) {
        console.log('error');
    }
}