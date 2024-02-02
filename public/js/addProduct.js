const addProductForm = document.getElementById('addProductForm')
const submitBtn = document.getElementById('submitbtn')
submitBtn.addEventListener('click',async(event)=>{
    event.preventDefault()
    const productName = document.getElementById('productName').value
    const description = document.getElementById('productDescription').value
    const price = document.getElementById('productPrice').value
    const stock = document.getElementById('productStock').value
    const category = document.getElementById('productCategory').value
    const discount = document.getElementById('productDiscount').value
    const subCategory = document.getElementById('subCategory').value
    const color = document.getElementById('productColors').value
    const size = document.getElementById('productSize').value
    const errorMsg = document.querySelector('.errorMg')
    if(!productName || !description || !price || !stock || !category || !discount || !subCategory || !color || !size ){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Please Fill all Fields'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }else{
        const form = new FormData(addProductForm)
        try{
            const response = await fetch('/admin/addproduct', {
                method: 'POST',
                body: form,
            });
            const result = await response.json()
            if(!response.ok){
                errorMsg.style.visibility = 'visible'
                errorMsg.innerHTML = result.error
                setTimeout(() => {
                    errorMsg.innerHTML = ''
                }, 3000);
                }
                else{
                    if(result.success){
                        
                        setTimeout(() => {
                            window.location.href = '/admin/product'
                        }, 1000);

                    }
            }
        }catch (err) {
            console.error('Error during form submission:', err);
        }
    }
    

})