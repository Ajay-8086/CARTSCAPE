const submitBtn = document.getElementById('addBtn');

let subCategories = [];
const categoryName = document.getElementById('categoryName').value;

const addBtn = document.getElementById('subcategoryBtn');
addBtn.addEventListener('click', () => {
    let subCategoryInput = document.getElementById('subCategoryName');
    let subCategory = subCategoryInput.value;

    if (subCategory) {
        subCategories.push(subCategory);
        subCategoryInput.value = ''; 
    }
});


submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const errorMsg = document.querySelector('.errorMg');
    let subCategoryInput = document.getElementById('subCategoryName').value.trim()
    if(subCategoryInput){
        subCategories.push(subCategoryInput);
    }
    const categoryName = document.getElementById('categoryName').value.trim()
    const categoryimage = document.getElementById('imageInput').files[0];
    console.log(categoryName);
    if (!categoryName || !categoryimage) {
        errorMsg.style.visibility = 'visible';
       
        errorMsg.innerHTML = 'Please Fill all Fields';
        setTimeout(() => {
            errorMsg.innerHTML = '';
        }, 3000);
    } else {
        try {
            const formData = new FormData()
            formData.append('subCategory',JSON.stringify(subCategories));
            formData.append('categoryName',JSON.stringify(categoryName));
            formData.append('categoryimage',categoryimage)
            const response = await axios.post('/admin/addcategory', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'  
                }
              });
        
            if (response.status === 200) {  
              errorMsg.style.visibility = 'visible';
              errorMsg.classList.add('success');
              errorMsg.innerHTML = 'Category added';
        
              setTimeout(() => {
                window.location.href = '/admin/category';
              }, 1000);
            } else {
              console.log('Error adding category');
              
            }
          } catch (err) {
            console.error(err);
          }
        }
    });



