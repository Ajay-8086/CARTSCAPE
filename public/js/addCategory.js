const addCategory = document.getElementById('categoryForm');
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
    let subCategoryInput = document.getElementById('subCategoryName').value
    if(subCategoryInput){
        subCategories.push(subCategoryInput);
    }
    const categoryName = document.getElementById('categoryName').value
    const categoryimage = document.getElementById('imageInput').value;
    console.log(categoryName);
    if (categoryName==='') {
        errorMsg.style.visibility = 'visible';
       
        errorMsg.innerHTML = 'Please Fill all Fields';
        setTimeout(() => {
            errorMsg.innerHTML = '';
        }, 3000);
    } else {
        try {
            const response = await fetch('/admin/addcategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subCategory: subCategories, categoryName ,categoryimage}),
            });
            if(!response.ok){
                console.log('error');
            }else{
                const result = await response.json();
                errorMsg.style.visibility = 'visible'
                errorMsg.classList.add('success')
                errorMsg.innerHTML = 'Category added'
                setTimeout(() => {
                    
                window.location.href = '/admin/category'
                }, 1000);
            }

        } catch (err) {
            console.log(err.errorMsg);
        }
    }
});
