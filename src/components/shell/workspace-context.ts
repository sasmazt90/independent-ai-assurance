import {createContext,useContext} from 'react'

export type ThemePreference='light'|'dark'|'system'
export type WorkspaceContextValue={organizationId:string;setOrganizationId:(id:string)=>void;theme:ThemePreference;setTheme:(theme:ThemePreference)=>void}

export const WorkspaceContext=createContext<WorkspaceContextValue|null>(null)

export function useWorkspace(){
 const value=useContext(WorkspaceContext)
 if(!value)throw new Error('Workspace context is unavailable')
 return value
}
