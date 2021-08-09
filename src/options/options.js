import { encrypt_URL, decrypt_URL } from '/convert.js'

const original = document.querySelector('input#original'),
    webvpn = document.querySelector('input#webvpn');

function update_webvpn() {
    const original_URL = original.value;
    if (!original_URL)
        return;

    try {
        const webvpn_URL = encrypt_URL(original_URL);
        if (webvpn_URL)
            webvpn.value = webvpn_URL;
    } catch (e) {
        if (e instanceof TypeError) {
            if (e.message.includes('Invalid URL'))
                return;
        }
        throw e;
    }
}

function update_original() {
    const webvpn_URL = webvpn.value;
    if (!webvpn_URL)
        return;

    try {
        const original_URL = decrypt_URL(webvpn_URL);
        if (original_URL)
            original.value = original_URL;
    } catch (e) {
        if (e instanceof TypeError) {
            if (e.message.includes('Invalid URL'))
                return;
        }
        throw e;
    }
}

original.addEventListener('input', update_webvpn);
webvpn.addEventListener('input', update_original);
