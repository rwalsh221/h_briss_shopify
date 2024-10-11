const displayForm = (currentUrl) => {
  const formId = currentUrl.split('#')[1];
  loginForm = document.getElementById('login');
  recoverForm = document.getElementById('recover');

  switch (formId) {
    case 'login':
      loginForm.style.display = 'block';
      recoverForm.style.display = 'none';
      break;
    case 'recover':
      recoverForm.style.display = 'block';
      loginForm.style.display = 'none';
      break;
    default:
      loginForm.style.display = 'block';
      recoverForm.style.display = 'none';
      break;
  }
};

window.addEventListener('hashchange', () => {
  displayForm(window.location.href);
});

displayForm(window.location.href);
