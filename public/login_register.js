
const registerForm = document.getElementById("registerForm");

const loginForm = document.getElementById("loginForm");


//register inputs
const usernameInput = document.getElementById("usernameRegister");

const emailInput = document.getElementById("emailRegister");

const passwordInput = document.getElementById("passwordRegister");

//login inputs
const usernameLogin = document.getElementById("username");
const passwordLogin = document.getElementById("password");

if(registerForm){

    registerForm.addEventListener("submit" , async (e) => {

        e.preventDefault();


        try {
            
            const res = await axios.post('/user/register' , {


                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value

            });

            alert('You are now registered , you can login now !');
            window.location.href = 'login.html'


        } catch (error) {

            alert('Registration failed');
            console.log(error);
            
            
        }


    })

};

if(loginForm){

    loginForm.addEventListener("submit" , async(e) => {

        e.preventDefault();

        try {
            
            const res = await axios.post('/user/login' , {

                username: usernameLogin.value,
                password: passwordLogin.value

            });

            localStorage.setItem('token' , res.data.token);
            alert("login successful");
            window.location.href = 'flavortable.html'


        } catch (error) {

            alert('login failed');
            console.log(error);
            
        }


    });

}