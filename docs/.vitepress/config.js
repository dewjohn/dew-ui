module.exports = {
  title: 'dew-UI',
  description: 'dew - UI',
  themeConfig: {
    lastUpdated: '最后更新时间',
    docsDir: 'docs',
    editLnks: true,
    editLinkText: '编辑此网站',
    repo: '',
    footer: {
      message: 'Released under the License.',
      copyright: 'Copyright 2024 - present dewUI'
    },
    nav: [
      { text: '指南', link: '/guide/installation', activeMatch: '/guide/' },
      { text: '组件', link: '/component/icon', activeMatch: '/component/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quickStart' }
          ]
        }
      ],
      '/component/': [
        {
          text: '基础组件',
          items: [{ text: 'Icon', iink: '/component/icon' }]
        }
      ]
    }
  }
}
