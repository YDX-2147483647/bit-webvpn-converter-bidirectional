# BIT WebVPN URL 双向转换器

![GitHub all releases](https://img.shields.io/github/downloads/YDX-2147483647/bit-webvpn-converter-bidirectional/total)

这个转换器相互转换内外 URL（普通校内网 URL 与校外网 WebVPN URL）。

> 校外无法访问普通 URL，校内无法访问 WebVPN URL。

转换原理源自 [spencerwooo/🥑 WEBVPN URL Converter](https://github.com/spencerwooo/bit-webvpn-converter)（及其[网页](https://webvpn.vercel.app/)）。此项目并不打算再做一个这样的网页，而是做成浏览器插件。

> ⚠ Firefox 版及功能列表请移步[另一仓库](https://github.com/YDX-2147483647/bit-webvpn-converter-web-extension)。（这里是 Chromium 版）
>
> 由于此仓库 fork 而来，而源仓库针对网页，不太方便。计划逐步转移过去。

## 安装方式

1. 下载[release](https://github.com/YDX-2147483647/bit-webvpn-converter-bidirectional/releases)中的`.crx`文件并解压。（或利用仓库中的`/src/`文件夹）
2. 访问`edge://extensions`（或`chrome://extensions`），在左下角（或右上角）打开“开发人员模式”（或“开发者模式”）。
3. 在同页面的右上角“加载解压缩的扩展”（或左上角“加载已解压的扩展程序”），选择刚刚的文件夹。

