import React from 'react'
import {Header,Navigator} from '../../../components'
export const metadata={
    title:'next',
    description:'next informe'
}
export default function RootLayout({
    children,
}:{children:React.ReactNode}){
    return(
        <div>
            <Header/>
            <Navigator/>
            {children}
        </div>
    )
}


