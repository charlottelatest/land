// Promise.race but for success
const race = (promises) => {
  const newPromises = promises.map(
    (p) => new Promise((resolve, reject) => p.then((v) => v && resolve(v), reject))
  )
  newPromises.push(Promise.all(promises).then(() => false))
  return Promise.race(newPromises)
}
// GM_xmlhttpRequest promise wrapper
const gmFetch = (url, { method = 'GET', headers, anonymous } = {}) =>
  new Promise((onload, onerror) => {
    let xhr = new XMLHttpRequest();
    GM_xmlhttpRequest({ url, method, headers, anonymous, onload, onerror })
})
const parseHTML = (str) => {
  const tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str
  return tmp
}
const avid = 'ABW-087'
const preview = async () => {
  const check = async (src) => (await gmFetch(src, { method: 'head' })).status === 200
  const srcs = (src) =>
    ['dmb', 'dm', 'sm'].map((i) => src.replace(/_(dmb|dm|sm)_/, `_${i}_`))
  const r18 = async () => {
    try {
      const res = await gmFetch(
        `https://www.r18.com/common/search/order=match/searchword=${avid}`
      )
      const video_tag = parseHTML(res.responseText).querySelector('.js-view-sample')
      const src = ['high', 'med', 'low']
        .map((i) => video_tag.getAttribute('data-video-' + i))
        .find((i) => i)
      for (let i of srcs(src)) {
        if (await check(i)) {
          console.log('r18', i)
          return i
        }
      }
    } catch (_) {}
  }
  const prestige = async () => {
    try {
      const res = await gmFetch(
        `https://www.prestige-av.com/goods/goods_list.php?q=${avid}&m=search&p=1&s=date`
      )
      const dom = parseHTML(res.responseText)
      const url = dom.querySelectorAll('#body_goods > ul > li > a')
      const name = [...url].map((i) =>
        new URL(i.href).searchParams.get('sku').toUpperCase()
      )
      for (let n of name) {
        n = 'https://www.prestige-av.com/sample_movie/' + n + '.mp4'
        if (await check(n)) {
          console.log('prestige', n)
          return n
        }
      }
    } catch (_) {}
  }
  const dmm = async () => {
    try {
      const res = await gmFetch(`https://www.dmm.co.jp/search/=/searchstr=${avid}`, {
        anonymous: true,
        headers: { 'User-Agent': 'Android' },
      })
      const dom = parseHTML(res.responseText)
      const src = dom.querySelector('a.play-btn').href
      for (let i of srcs(src)) {
        if (await check(i)) {
          console.log('dmm', i)
          return i
        }
      }
    } catch (_) {}
  }
  let src = await race([r18(), prestige(), dmm()])
}
preview()