const email = document.getElementById('email');
const password = document.getElementById('password');
const phone = document.getElementById('phone');
const confirmPassword = document.getElementById('confirmPassword');

const emailMsg = document.getElementById('emailTooltip');
const passwordMsg = document.getElementById('passwordTooltip');
const confirmMsg = document.getElementById('confirmTooltips');
const phoneMsg = document.getElementById('phoneTooltp');

const signup = document.getElementById('signupButton')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const mobilenumregex = /^\d{10}$/

email.onblur = () => {
    if (emailRegex.test(email.value)) {
        emailMsg.style.display = 'none';
        
    } else {
        emailMsg.style.display = 'block';
        emailMsg.innerHTML = 'Invalid email format';
    }
}
phone.onblur = ()=>{
    if (mobilenumregex.test(phone.value)) {
        phoneMsg.style.display = 'none';
        
    } else {
        phoneMsg.style.display = 'block';
        phoneMsg.innerHTML = 'Invalid mobile';
    }
}

password.onblur = () => {
    if (passwordRegex.test(password.value)) {
        passwordMsg.style.display = 'none';
    } else {
        passwordMsg.style.display = 'block';
        passwordMsg.innerHTML = 'Password should be strong';
    }
}

confirmPassword.onblur = () => {
    if (password.value !== confirmPassword.value) {
        confirmMsg.style.display = 'block';
        confirmMsg.innerHTML = 'Password and confirm password should be the same';
    } else {
        confirmMsg.style.display = 'none';
    }
}
