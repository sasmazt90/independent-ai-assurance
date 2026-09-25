import type {AISystem,MasterControl} from '../../domain/models'
export function controlAppliesToSystem(control:MasterControl,system:AISystem):boolean{return control.applicability.includes('*')||control.applicability.some(type=>system.systemType.toLowerCase().includes(type.toLowerCase())||type.toLowerCase().includes(system.systemType.toLowerCase()))}
