export type HealthRecordType =
  | 'vaccination'
  | 'vet_visit'
  | 'medication'
  | 'weight_entry'
  | 'dental'
  | 'surgery'
  | 'note'

interface HealthRecordBase {
  id: string
  petId: string
  type: HealthRecordType
  recordedAt: string   // ISO date when event happened
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface VaccinationRecord extends HealthRecordBase {
  type: 'vaccination'
  vaccineName: string
  administeredBy?: string
  lotNumber?: string
  nextDueDate?: string  // drives reminder
  isBooster: boolean
}

export interface VetVisitRecord extends HealthRecordBase {
  type: 'vet_visit'
  clinicName?: string
  veterinarianName?: string
  reasonForVisit: string
  diagnosis?: string
  treatmentSummary?: string
  followUpDate?: string  // drives reminder
  cost?: number
}

export interface MedicationRecord extends HealthRecordBase {
  type: 'medication'
  medicationName: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  refillDate?: string          // drives reminder
  prescribedBy?: string
  isOngoing: boolean
  recurringIntervalDays?: number  // auto-reschedule: 30 = monthly, 90 = quarterly, etc.
}

export interface WeightEntry extends HealthRecordBase {
  type: 'weight_entry'
  weight: number
  unit: 'kg' | 'lbs'
}

export interface DentalRecord extends HealthRecordBase {
  type: 'dental'
  procedure: string
  nextCleaningDate?: string  // drives reminder
}

export interface SurgeryRecord extends HealthRecordBase {
  type: 'surgery'
  procedureName: string
  surgeonName?: string
  clinicName?: string
  followUpDate?: string  // drives reminder
}

export interface NoteRecord extends HealthRecordBase {
  type: 'note'
  title: string
}

export type HealthRecord =
  | VaccinationRecord
  | VetVisitRecord
  | MedicationRecord
  | WeightEntry
  | DentalRecord
  | SurgeryRecord
  | NoteRecord
