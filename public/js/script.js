const phonenumber = document.getElementById('phonenumber'),
    message = document.getElementById('message'),
    envoyer = document.getElementById('envoyer'),
    reponse = document.getElementById('reponse');

envoyer.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function(data) {
    reponse.innerHTML = `<h4> Le message a ete envoyer au <b>${data.phone}</b> avec succes.</h4>`;
    message.value = '';
    phonenumber.value = '';
});

// la fonction send
function send(e) {
    const phone = phonenumber.value.replace(/\D/g, '');
    const msg = message.value;
    if (phone !== '' || msg !== '') {
        fetch('/', {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ phone: phone, msg: msg })
            })
            .then(function(res) {
                console.log(res);
            })
            .catch(function(err) {
                console.log(err);
            })
    }
};