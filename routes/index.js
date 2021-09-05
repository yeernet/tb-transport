var express = require('express');
var cheerio = require('cheerio');
var router  = express.Router();
var fs      = require('fs')
const path  = require( 'path' )
var { parse } = require('node-html-parser')
var request = require('superagent')

const a = {
  'author' : {
    'user_id'      : 335934799,
    'user_name'    : 'wtqlhy',
    'name_u'       : 'wtqlhy&ie=utf-8',
    'user_sex'     : 2,
    'portrait'     : 'tb.1.e13d028e._wq7YE1GUDGNQ89h7UKByQ',
    'is_like'      : 1,
    'level_id'     : 4,
    'level_name'   : '\u5229\u5251',
    'cur_score'    : 47,
    'bawu'         : 0,
    'props'        : null,
    'user_nickname': '\u6c42\u4f5b\u2103'
  },
  'content': {
    'post_id'    : 139691132628,
    'is_anonym'  : false,
    'open_id'    : 'tieba',
    'open_type'  : '',
    'date'       : '2021-06-06 16:29',
    'vote_crypt' : '',
    'post_no'    : 3,
    'type'       : '0',
    'comment_num': 0,
    'is_fold'    : 0,
    'ptype'      : '0',
    'is_saveface': false,
    'props'      : null,
    'post_index' : 2,
    'pb_tpoint'  : null
  }
}

/* GET home page. */
router.get('/p/:tid', async function(req, res, next) {
  console.log(req.params)
  console.log(req.query)
  const tid = req.params.tid
  const pn = req.query.pn || 1
  const see_lz = req.query.see_lz || 0
  // res.render('index', { title: 'Express' });
  try {
    const { text } = await request('get', `https://tieba.baidu.com/p/${tid}?pn=${pn}&ajax=1&see_lz=${see_lz}`)
    // console.log(text)
    await new Promise(function ( resolve, reject) {
      // const file = fs.readFileSync( path.resolve('public/posts.html'))
      // console.log(file.toString())
      // const $ = cheerio.load(file)
      // const contentImgs = $('.p_content img')

      // console.log(contentImgs)
      // const document = parse(file.toString())
      const document = parse(`
<html lang="zh">
  <head>
    <meta name="referrer" content="never" >
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>1111</title>
    <style>
      a{
        color: #06f;
        text-decoration: none;
      }
      html, body, ul, li, ol {
        padding: 0;
        margin: 0;
        list-style: none;
      }
      .p_author * {display: inline !important;}
      .p_author {
        display: flex;
        align-items: center;
      }
      .p_author .icon img {
        height: 1.5em;
      }
      .d_author {
        background-color: #eee;
        padding: 0 .5em;
      }

      .d_post_content{
        overflow: auto;
      }
      .d_post_content img{
        height: auto;
        max-width: 100%;
      }
      .d_post_content_main {
        padding: .5em;
      }

      img.BDE_Image {
        display: block;
      }
      
      #ajax-content{
        order: 3;
      }
      #ajax-up {
        order: 2;
      }
      #ajax-down {
        order: 4;
      }
      #ajax-title {
        order: 1;
        width: 100%;
      }
      #ajax-script {
        order: 5;
      }
      
      .core_title_txt {
        width: 100% !important;
        padding: .5em;
        margin: 0;
        font-size: 20px;
      }
    </style>
  </head>
  <body>
  
  </body>
</html>
      `)

      const tb = parse(text)
      ;[...tb.querySelectorAll('script')].forEach( node => {
        node.parentNode.removeChild( node )
      } )
      document.querySelector('body').appendChild(tb)

      // ;[...document.querySelectorAll('.p_forbidden_tip')].forEach( node => node.parentNode.removeChild(node) )
      // ;[...document.querySelectorAll('.l_badge')].forEach( node => node.parentNode.removeChild(node) )
      // ;[...document.querySelectorAll('.core_reply')].forEach( node => node.parentNode.removeChild(node) )
      const hides = [
        '.p_author>.d_icons',
        // '.d_nameplate',
        // '.p_forbidden_tip',
        // '.l_badge',
        '.user-hide-post-position',
        '.core_reply',
        '.l_thread_manage',
        '.d_badge_title',
        '.save_face_bg',
        '.user-hide-post-down',
        '.achievement_medal_section',
        '.p_favthread',
      ]
      ;[...document.querySelectorAll(hides.join())].forEach( node => {
        node.parentNode.removeChild( node )
      } )

      // const contentImages = document.querySelectorAll('.p_content img.BDE_Image')
      // ;[...contentImages].forEach( (i, index) => {
      //   index === 0 && console.log(i)
      //   // el1.parentNode.replaceChild(el2, el1)
      //   const src = i._attrs && i._attrs.src || i.attributes.src.value
      //   const iframe = parse(`<iframe src="${src}" width="${i._attrs.width}" height="${i._attrs.height}"></iframe>`)
      //   i.replaceWith(iframe)
      // })

      const c= document.querySelector('#ajax-content')
      // console.log(c.parentNode)

      document.querySelector('#ajax-content').parentNode.setAttribute('style', 'display: flex; flex-direction: column')

      resolve(document.innerHTML)

    }).then( f => {
      res.setHeader('content-type', 'text/html')
      // res.send(f.toString().replace(/<img/g, '<imgs'))
      res.send(f)

    })
  } catch ( e ) {
    res.send('系统错误')
    console.error(e)
  }


});

module.exports = router;


