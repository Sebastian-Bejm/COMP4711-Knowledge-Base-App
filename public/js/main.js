var check = function() {
    if (document.getElementById('password').value ==
      document.getElementById('confirm_password').value) {
      document.getElementById('password_message').style.display = 'block';
      document.getElementById('password_message').style.color = 'green';
      document.getElementById('password_message').innerHTML = "Passwords match";
    } else {
      document.getElementById('password_message').style.display = 'block';
      document.getElementById('password_message').style.color = 'red';
      document.getElementById('password_message').innerHTML = "Passwords don't match!";
    }
  }