import React, { useEffect } from 'react'
import { MobileLayout } from '../../components/shared/MobileLayout'
import { isMobileBrowser } from '../../utils/helperFunctions'

export const Saved = () => {

    useEffect(()=> {
        alert(`isMobileBrowserTest: ${isMobileBrowser()}`)
    }, [])
    
  return (
    <MobileLayout>
        Saved
    </MobileLayout>
  )
}
