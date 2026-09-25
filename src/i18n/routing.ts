import {createNavigation} from 'next-intl/navigation'
export const routing={locales:['en','de','tr'] as const,defaultLocale:'en' as const,localePrefix:'always' as const}
export const {Link,redirect,usePathname,useRouter}=createNavigation(routing)
