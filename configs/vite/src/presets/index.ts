import { createJetLinksPreset } from './JetLinks'

export const createPreset = ( framework = 'jetlinks') => {
    const presets = {
        jetlinks: createJetLinksPreset
    }

    return presets[framework]
}