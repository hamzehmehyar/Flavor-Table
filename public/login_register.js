
const registerForm = document.getElementById("registerForm");

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");


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

                username: usernameInput.value,
                password: passwordInput.value

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