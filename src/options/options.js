import { encrypt_URL, decrypt_URL } from '../common/convert.js'

const original = document.querySelector('input#original'),
    webvpn = document.querySelector('input#webvpn');

/**
 * 更新 URL
 * @param {string} target 要更新的目标，'original' 或 'webvpn'
 */
function update_URL(target) {
    const [from, to] = target == 'original' ? [webvpn, original] : [original, webvpn];
    const from_URL = from.value;
    if (!from_URL)
        throw "未填写 URL。";

    try {
        const convert = target == 'original' ? decrypt_URL : encrypt_URL;
        const to_URL = convert(from_URL);
        if (to_URL)
            to.value = to_URL;
    } catch (e) {
        throw e;
    }
}

original.addEventListener('input', event => {
    try {
        update_URL('webvpn');
    } catch (e) {
        if (e instanceof TypeError && e.message.includes('Invalid URL'))
            return;
    }
});
webvpn.addEventListener('input', event => {
    try {
        update_URL('original');
    } catch (e) {
        // 忽略所有错误
    }
});

document.querySelector('#url-converter').addEventListener('keyup', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;

    const event_target = event.target.id;
    if (!['original', 'webvpn'].includes(event_target))
        return;

    if (event.key == 'Enter') {
        try {
            if (event_target == 'original') {
                update_URL('webvpn');
                window.open(webvpn.value, "_blank");
            } else {
                update_URL('original');
                window.open(original.value, "_blank");
            }
            event.preventDefault();
        } catch (error) {
            return;
        }
    }
});
