import { getSystemInfo } from 'zmp-sdk'
import {
  App as ZaloMiniApp,
  SnackbarProvider,
} from 'zmp-ui'
import type { AppProps } from 'zmp-ui/app'
import type { FC, ReactNode } from 'react'

import { ToastContainer } from '../components/ui/ToastContainer'
import MiniApp from '../MiniApp'

const SnackbarProviderWrapper = SnackbarProvider as unknown as FC<{ children: ReactNode }>

const Layout = () => {
  const theme = getSystemInfo().zaloTheme as AppProps['theme']

  return (
    <ZaloMiniApp theme={theme}>
      <SnackbarProviderWrapper>
        <MiniApp />
        <ToastContainer />
      </SnackbarProviderWrapper>
    </ZaloMiniApp>
  )
}

export default Layout

