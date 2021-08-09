// 源自 https://github.com/spencerwooo/bit-webvpn-converter，重写了 encrypt_URL()（原名 encryptUrl()），新增 decrypt_URL()。
// https://github.com/spencerwooo/bit-webvpn-converter/blob/c97806011cc3113a5090d7b7f919c7d868bd090d/src/components/convert.ts

import { aesjs } from "/aes-js.js";

const utf8 = aesjs.utils.utf8
const hex = aesjs.utils.hex
const AesCfb = aesjs.ModeOfOperation.cfb
const magic_word = 'wrdvpnisthebest!'

const textRightAppend = (text, mode) => {
    const segmentByteSize = mode === 'utf8' ? 16 : 32
    if (text.length % segmentByteSize === 0) {
        return text
    }

    const appendLength = segmentByteSize - (text.length % segmentByteSize)
    let i = 0
    while (i++ < appendLength) {
        text += '0'
    }
    return text
}

const encrypt = (text, key, iv) => {
    const textLength = text.length
    text = textRightAppend(text, 'utf8')

    const keyBytes = utf8.toBytes(key)
    const ivBytes = utf8.toBytes(iv)
    const textBytes = utf8.toBytes(text)

    const aesCfb = new AesCfb(keyBytes, ivBytes, 16)
    const encryptBytes = aesCfb.encrypt(textBytes)

    return (
        hex.fromBytes(ivBytes) +
        hex.fromBytes(encryptBytes).slice(0, textLength * 2)
    )
}

const decrypt = (text, key) => {
    const textLength = (text.length - 32) / 2
    text = textRightAppend(text, 'hex')

    const keyBytes = utf8.toBytes(key)
    const ivBytes = hex.toBytes(text.slice(0, 32))
    const textBytes = hex.toBytes(text.slice(32))

    const aesCfb = new AesCfb(keyBytes, ivBytes, 16)
    const decryptBytes = aesCfb.decrypt(textBytes)

    return utf8.fromBytes(decryptBytes).slice(0, textLength)
}

/**
 * 猜测 URL 协议类型
 * @param {string} url_str 
 * @returns 补足协议类型的 URL
 */
function guess_protocol(url_str) {
    if (!url_str.includes('://')) {
        if (url_str.includes('.bit.edu.cn'))
            return 'http://' + url_str;
        else
            return 'https://' + url_str;
    } else
        return url_str;
}

/**
 * 普通 URL 转 VPN URL
 * @param {string} url_str 
 * @returns VPN URL
 * @version 1.0
 * @description 与 0.0 版的区别：此版本返回值是完整 URL，使用 URL API（无需特别处理 IPv6）。
 * @see decrypt_URL
 */
function encrypt_URL(url_str) {
    const url = new URL(guess_protocol(url_str));

    const protocol = url.protocol.slice(0, -1).toLowerCase(), // "https:" -> "https"
        port = url.port,
        pathname_etc = url.pathname + url.search + url.hash;

    const protocol_and_port = port ? `${protocol}-${port}` : protocol,
        cipher = encrypt(url.hostname, magic_word, magic_word);

    return `https://webvpn.bit.edu.cn/${protocol_and_port}/${cipher}${pathname_etc}`
}

/**
 * VPN URL 转普通 URL
 * @param {string} url_str 
 * @returns 普通 URL
 * @version 1.1
 * @description 非 VPN URL 将返回 null。
 * @see encrypt_URL
 */
function decrypt_URL(url_str) {
    const url = new URL(guess_protocol(url_str));
    if (url.hostname !== 'webvpn.bit.edu.cn' || url.pathname == '' || url.pathname == '/')
        return null;


    const [empty_str, protocol_and_port, cipher] = url.pathname.split('/', 3),
        pathname_etc = url.pathname.slice(`/${protocol_and_port}/${cipher}`.length) + url.search + url.hash;

    const hostname = decrypt(cipher, magic_word); // hostname 无法修改
    const host_etc = new URL('nothing:' + hostname);

    const match_obj = protocol_and_port.match(
        /^(?<protocol>[-0-9a-z]+?)(-(?<port>\d+))?$/);
    if (match_obj == null)
        return null;
    // 以下两个 URL API 都会自动转换。
    host_etc.protocol = match_obj.groups.protocol; // 此后 host_etc.href 结尾会有“/”
    host_etc.port = match_obj.groups.port;

    return host_etc.href.slice(0, -1) + pathname_etc;
}


export { encrypt_URL, decrypt_URL };
