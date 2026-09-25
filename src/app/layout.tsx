import type {Metadata} from 'next'
import './globals.css'
export const metadata:Metadata={title:'Independent AI Assurance',description:'Independent assurance for AI systems.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html suppressHydrationWarning><body>{children}</body></html>}
