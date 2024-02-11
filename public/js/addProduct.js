const addProductForm = document.getElementById('addProductForm')
const submitBtn = document.getElementById('submitbtn')
submitBtn.addEventListener('click',async(event)=>{
    event.preventDefault()
    const productName = document.getElementById('productName').value.trim()
    const description = document.getElementById('productDescription').value.trim()
    const price = document.getElementById('productPrice').value.trim()
    const stock = document.getElementById('productStock').value.trim()
    const category = document.getElementById('productCategory').value.trim()
    const discount = document.getElementById('productDiscount').value.trim()
    const subCategory = document.getElementById('subCategory').value.trim()
    const color = document.getElementById('productColors').value.trim()
    const size = document.getElementById('productSize').value.trim()
    const returnPolicy = document.getElementById('returnPolicy').checked
    const errorMsg = document.querySelector('.errorMg')
    if(productName =='' || description=='' || price=='' || stock=='' || category=='' || discount=='' || subCategory=='' || color=='' || size==''|| returnPolicy=='' ){
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
                    errorMsg.style.visibility = 'visible'
                errorMsg.innerHTML = result.success
                    if(result.success){
                        setTimeout(() => {
                            errorMsg.innerHTML = ''
                            window.location.href = '/admin/product'
                        }, 1000);

                    }
            }
        }catch (err) {
            console.error('Error during form submission:', err);
        }
    }
    

})