function upgrade_plan(){
    const email = document.querySelector('#upgrade_email').value;
    const role = document.querySelector('#plan_value').value;
    console.log('email of user ',email)
    console.log('this role you selected ', role)
    let id = sessionStorage.getItem("id");
    console.log('get Id-->',id);

    if(email == '' || role == ''){
        alert('Enter valid cred..')
    }else{
        fetch('/upgrade', {
            method: 'POST',
            headers: {
                Authorization: 'jayesh',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, role, id
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log('Ressponce role is->', res.role)
            if (res.val == true) {
                console.log('Jayesh')
                // alert('Upgraded to '+res.role)
                setTimeout(redirLogin, 2000);
            } else {
                console.log('bhagwat')
                alert('Not Update')
            }
        })
    }
}

function redirLogin(){
    window.location.href = 'http://localhost:3000/';
}

document.querySelector('#upgrade').addEventListener('click', (e) => {
    e.preventDefault();
    upgrade_plan();
});