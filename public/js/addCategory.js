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

    // Get the tags and input elements from the DOM 
    const tags = document.getElementById('tags'); 
    const input = document.getElementById('subCategoryName'); 

    // Add an event listener for keydown on the input element 
    input.addEventListener('keydown', function (event) { 

        // Check if the key pressed is 'Enter' 
        if (event.key === 'Enter') { 
          
            // Prevent the default action of the keypress 
            // event (submitting the form) 
            event.preventDefault(); 
          
            // Create a new list item element for the tag 
            const tag = document.createElement('li'); 
          
            // Get the trimmed value of the input element 
            const tagContent = input.value.trim(); 
          
            // If the trimmed value is not an empty string 
            if (tagContent !== '') { 
          
                // Set the text content of the tag to  
                // the trimmed value 
                tag.innerText = tagContent; 

                // Add a delete button to the tag 
                tag.innerHTML += '<button class="delete-button">X</button>'; 
                  
                // Append the tag to the tags list 
                tags.appendChild(tag); 
                  
                // Clear the input element's value 
                input.value = ''; 
            } 
        } 
    }); 

    // Add an event listener for click on the tags list 
    tags.addEventListener('click', function (event) { 

        // If the clicked element has the class 'delete-button' 
        if (event.target.classList.contains('delete-button')) { 
          
            // Remove the parent element (the tag) 
            event.target.parentNode.remove(); 
        } 
    }); 