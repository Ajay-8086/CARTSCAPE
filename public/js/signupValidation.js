const submitBtn = document.querySelector('.otpSending')
submitBtn.addEventListener('click',async(event)=>{
    event.preventDefault()
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const phone = document.getElementById('phone');
    const confirmPassword = document.getElementById('confirmPassword');
    const userAgreement = document.querySelector('.userAgreement')
    const isChecked = userAgreement.checked;
    const emailMsg = document.getElementById('emailTooltip');
    const passwordMsg = document.getElementById('passwordTooltip');
    const confirmMsg = document.getElementById('confirmTooltips');
    const phoneMsg = document.getElementById('phoneTooltp');    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobilenumregex = /^\d{10}$/
        if (!emailRegex.test(email.value)) {
            emailMsg.style.display = 'block';
            emailMsg.innerHTML = 'Invalid email format';
            setTimeout(() => {   
                emailMsg.style.display = 'none';
            }, 3000);
    }
        else if (!mobilenumregex.test(phone.value)) {
            phoneMsg.style.display = 'block';
            phoneMsg.innerHTML = 'Invalid mobile';
            setTimeout(() => {   
                emailMsg.style.display = 'none';
            }, 3000); 
        } 
       else if (!passwordRegex.test(password.value)) {
            passwordMsg.style.display = 'block';
            passwordMsg.innerHTML = 'Password should be strong';
            setTimeout(() => {   
                emailMsg.style.display = 'none';
            }, 3000);
        } 

        else if (password.value !== confirmPassword.value) {
            confirmMsg.style.display = 'block';
            confirmMsg.innerHTML = 'Password and confirm password should be the same';
            setTimeout(() => {   
                emailMsg.style.display = 'none';
            }, 3000);
        } else if(!isChecked){
            confirmMsg.style.display = 'block';
            confirmMsg.innerHTML = 'please check the user agreement';
            setTimeout(() => {   
                emailMsg.style.display = 'none';
            }, 3000);
        }else{
            try {
                const form  = document.getElementById('signup')
                const formData = new FormData(form)
                const data = Object.fromEntries(formData.entries())
                const response = await axios.post('/signup',{data})
                if(response.status==200){
                    const phone = response.data.phone
                    window.location.href = `/verify-otp?phone=${phone}`
                }
            } catch (error) {
                if(error.response.status==400){
                    window.location.href = '/login'
                }
                console.log(error);
            }
        }
})
