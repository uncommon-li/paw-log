export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'bird' | 'reptile' | 'fish' | 'other'
export type PetSex = 'male' | 'female' | 'unknown'

export interface Pet {
  id: string
  name: string
  species: PetSpecies
  breed?: string
  sex: PetSex
  dateOfBirth?: string        // ISO 8601 YYYY-MM-DD
  isDateOfBirthApproximate: boolean
  weightUnit: 'kg' | 'lbs'
  color?: string
  microchipId?: string
  avatarDataUrl?: string      // base64 data URL
  notes?: string
  createdAt: string
  updatedAt: string
}
