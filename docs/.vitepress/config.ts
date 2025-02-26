/*
 * @Author: weisheng
 * @Date: 2023-07-27 10:26:09
 * @LastEditTime: 2025-02-26 23:33:48
 * @LastEditors: weisheng
 * @Description: 
 * @FilePath: /uni-mini-router/docs/.vitepress/config.ts
 * 记得注释
 */
import { defineConfig } from 'vitepress';

export default defineConfig({
  base: process.env.BASE_URL || "/uni-mini-router/",
  title: `Uni Mini Router`,
  description: '一个基于vue3和Typescript的轻量级uni-app路由库',
  head: [
    ['link', { rel: 'icon', href: `${process.env.BASE_URL || "/uni-mini-router/"}favicon.ico` }],
    ['script', {}, `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?43e96134ee5fd0ab364786f7a00a1048";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  `]
  ],
  themeConfig: {
    logo: '/logo.png',
    lastUpdated: {
      text: '最后更新'
    },
    editLink: {
      pattern: 'https://github.com/Moonofweisheng/uni-mini-router/edit/master/docs/:path',
      text: '为此页提供修改建议',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Moonofweisheng/uni-mini-router' },
      { icon: { svg: '<svg t="1692699544299" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4184" width="200" height="200"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z" fill="#6D6D72" p-id="4185"></path></svg>' }, link: "https://gitee.com/fant-mini/uni-mini-router", ariaLabel: 'Gitee' },
      { icon: { svg: '<svg t="1694688365239" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4048" width="200" height="200"><path d="M980.79827 694.105946c-21.144216-122.796973-109.844757-203.250162-109.844757-203.250162 12.647784-111.477622-33.792-131.26573-33.792-131.26573C827.392 14.668108 530.985514 20.67373 524.730811 20.839784 518.476108 20.67373 222.01427 14.668108 212.300108 359.590054c0 0-46.467459 19.788108-33.819676 131.26573 0 0-88.700541 80.453189-109.817081 203.250162 0 0-11.291676 207.484541 101.403676 25.40627 0 0 25.350919 69.161514 71.790703 131.26573 0 0-83.082378 28.256865-75.997405 101.625081 0 0-2.87827 81.836973 177.401081 76.218811 0 0 126.699243-9.852541 164.753297-63.515676l16.605405 0 0.276757 0 16.633081 0c38.026378 53.635459 164.725622 63.515676 164.725622 63.515676 180.224 5.618162 177.401081-76.218811 177.401081-76.218811 7.029622-73.368216-75.997405-101.625081-75.997405-101.625081 46.439784-62.104216 71.790703-131.26573 71.790703-131.26573C992.034595 901.590486 980.79827 694.105946 980.79827 694.105946z" p-id="4049" fill="#6D6D72"></path></svg>' }, link: "https://qm.qq.com/cgi-bin/qm/qr?k=O1Z3pal6StL39qHtABqR54Tb56igr90O&jump_from=webapi&authKey=MtVWfi/EQbT03wW7tKXv4bmyKYHBHtzI8VewlzSsOdxFjN0wbgNy17np9Z9yC4Z8", ariaLabel: 'QQ' }
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: 'OOURGSMU49',
        apiKey: 'ab86779c0c2d0fc6e2ba6064d6eac1f5',
        indexName: 'uni-mini-router',
      },
    },

    footer: {
      message: `Released under the MIT License.`,
      copyright: 'Copyright © 2023-present weisheng',
    },
    nav: [
      { text: '指南',  link: '/guide/installation',activeMatch: '/guide/'},
      { text: '捐赠作者', link: '/reward/reward', activeMatch: '/reward/' },
      {
        text: 'Wot Design Uni',
        link: 'https://wot-design-uni.netlify.app/'
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          link: '/guide/introduction',
        },
        {
          text: '安装',
          link: '/guide/installation',
        },
        {
          text: '配置',
          link: '/guide/quick-use',
        },
        {
          text: '入门',
          link: '/guide/usage',
        },
        {
          text: 'API文档',
          link: '/guide/api',
        },
        {
          text: '更新日志',
          link: '/guide/changelog',
        },
        {
          text: '常见问题',
          link: '/guide/common-problems',
        }
      ],
      '/reward/': [
        {
          text: '捐赠作者',
          link: '/reward/reward',
        },
      ]
    }
    
  },

})