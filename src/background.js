import { convert } from '/common/convert.js'

chrome.contextMenus.create({
    "title": '转换并在新标签页打开',
    "id": 'convert-and-open',
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'convert-and-open')
        return;

    chrome.tabs.create({
        url: convert(info.pageUrl).url,
        index: tab.index + 1
    });
});

