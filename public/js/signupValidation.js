const signupForm = document.getElementById('signup')
const submitBtn = document.querySelector('.btn-success')
const errorMsg = document.querySelector('.error')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const mobilenumregex = /^\d{10}$/

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault() 
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const phone = document.getElementById('phone');
    const confirmPassword = document.getElementById('confirmPassword');
    if(!email.value || !password.value  || !phone.value  || !confirmPassword.value ){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Please Fill all Fields'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }else if(!emailRegex.test(email.value)){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'Invalid email format'
        setTimeout(() => {
            errorMsg.innerHTML = ''
        }, 3000);
    }else if(!mobilenumregex.test(phone.value)){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'invalid phone format'
        setTimeout(()=>{
            errorMsg.innerHTML = ''
        },3000) 
    }else if(!passwordRegex.test(password.value)){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'invalid password format'
        setTimeout(()=>{
            errorMsg.innerHTML = ''
        },3000)
    }else if(password.value !== confirmPassword.value){
        errorMsg.style.visibility = 'visible'
        errorMsg.innerHTML = 'password and confirm password must be equal'
}
else{
    console.log(true);
}
})  