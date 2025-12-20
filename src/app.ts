import 'zmp-ui/zaui.css'
import '@/css/tailwind.scss'
import '@/css/app.scss'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Layout from '@/components/layout'
import appConfig from '../app-config.json'

if (!(window as any).APP_CONFIG) {
  ;(window as any).APP_CONFIG = appConfig
}

const rootElement = document.getElementById('app')
if (rootElement) {
  createRoot(rootElement).render(React.createElement(Layout))
}

