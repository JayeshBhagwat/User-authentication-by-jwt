function register(){
    const username = document.querySelector('#reg_name').value;
    const email = document.querySelector('#reg_email').value;
    const password = document.querySelector('#reg_pass').value;

    // select role dropdown values
    const role = document.querySelector("#register_plan").value;
    console.log('role---',role)

    document.querySelector('#reg_name').value = '';
    document.querySelector('#reg_email').value = '';
    document.querySelector('#reg_pass').value = '';

    if(username == '' || email == '' || password == '' || role == ''){
        alert('please fill sections')
    }else{
        fetch('/register', {
            method: 'POST',
            headers: {
                Authorization: 'jayesh',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role,
                username,
                email,
                password,
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            if (res) {
                alert('User ADDED successfully!')
                setTimeout(redirLogin, 2000);
            } else {
                alert('Please Enter Valid Credential...')
            }
        })
    }    
}
function redirLogin() {
    window.location.href = "http://localhost:3000/";
}

function login(){
    // const abc = document.getElementById('abc')
    // abc.textContent
    // console.log('whole span--', abc);

    const email = document.querySelector('#logemail').value;
    const password = document.querySelector('#logpass').value;
    if(email == '' && password == ''){
        alert('Enter Email And Password to login')
    }else if(email == ''){
        alert('Please Enter Email')
    }else if(password == ''){
        alert('Please Enter password')
    }else{
        fetch('/login', {
            method: 'POST',
            headers: {
                Authorization: 'jayesh',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then((res) => res.json())
            .then((res) => {
                console.log('Response from user ', res.myuser)
                if (res.user_value === false){
                    alert('Invalied User..')
                }else if(res.val === false){
                    // alert('Please Renew Subcription')
                    console.log('ID IS --> ',res.id)
                    let id = res.id;
                    sessionStorage.setItem("id", id); // to check user id

                    sessionStorage.setItem("usr",res.myuser) // set username to show on html
                    
                    window.location.href = "dashboard_trial.html";
                }else if(res.val) {
                    console.log('LOG IN BY ROLE ---',res.role)

                    if(res.role == 'free'){
                        sessionStorage.setItem("usr", res.myuser)
                        window.location.href = "dashboard_trial.html";

                    }else if(res.role == 'basic'){
                        sessionStorage.setItem("usr", res.myuser)
                        window.location.href = "dashboard_basic.html";

                    }else if(res.role == 'premium'){
                        sessionStorage.setItem("usr", res.myuser)
                        window.location.href = "dashboard_premium.html";
                    }
                    // setTimeout(redirdashboard, 1000);
                } else {
                    alert('Invalid Password..')
                }
            })
    }
}

// function redirdashboard(){
//     window.location.href = "main_page.html";
// }

document.querySelector('#register_btn').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("hello register");    
    register();
});

document.querySelector('#submit_btn').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("hello login");
    login();
});