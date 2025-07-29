import {Header, Navigator} from '../../../components';
import '../../../src/app/globals.css';
//@ts-ignore

export const metadata={
    title:'next',
    description:'descrpcion registro'
}
export default function RootLayout ({
    children,
}:{children:React.ReactNode
}){
    return(
        <div>
            <Header/>
            {children}
        </div>
    )
}