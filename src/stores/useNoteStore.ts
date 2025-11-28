// stores/useNoteStore.ts
import { create } from 'zustand'

export interface Note {
  id: string
  x: number
  y: number
  width: number
  height: number
  content: string
  color: string
}

export interface Connection {
  id: string
  fromNoteId: string
  toNoteId: string
  points: { x: number; y: number }[]
}

interface NotesState {
  notes: Note[]
  connections: Connection[]
  selectedNoteId: string | null
  editingNoteId: string | null
  tempConnection: { fromNoteId: string; x: number; y: number } | null
  addNote: (note: Omit<Note, 'id'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  selectNote: (id: string | null) => void
  startEditing: (id: string) => void
  stopEditing: () => void
  startConnection: (fromNoteId: string, x: number, y: number) => void
  updateTempConnection: (x: number, y: number) => void
  completeConnection: (toNoteId: string) => void
  deleteConnection: (id: string) => void
  recalculateConnections: (noteId?: string) => void
}

// Função para calcular pontos da curva
const calculateCurvePoints = (fromNote: Note, toNote: Note) => {
  const startX = fromNote.x + fromNote.width
  const startY = fromNote.y + fromNote.height / 2
  const endX = toNote.x
  const endY = toNote.y + toNote.height / 2

  const midX = (startX + endX) / 2
  const curveIntensity = 50

  return [
    { x: startX, y: startY },
    { x: midX, y: startY - curveIntensity },
    { x: midX, y: endY + curveIntensity },
    { x: endX, y: endY }
  ]
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  connections: [],
  selectedNoteId: null,
  editingNoteId: null,
  tempConnection: null,

  addNote: (note) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      notes: [...state.notes, { ...note, id }],
      selectedNoteId: id,
      editingNoteId: id
    }))
  },

  updateNote: (id, updates) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      )
      
      // Recalcular conexões IMEDIATAMENTE
      const updatedConnections = state.connections.map(connection => {
        const fromNote = updatedNotes.find(n => n.id === connection.fromNoteId)
        const toNote = updatedNotes.find(n => n.id === connection.toNoteId)
        
        if (!fromNote || !toNote) return connection
        
        // Se a nota movida está relacionada a esta conexão
        if (connection.fromNoteId === id || connection.toNoteId === id) {
          const newPoints = calculateCurvePoints(fromNote, toNote)
          return { ...connection, points: newPoints }
        }
        
        return connection
      })
      
      return {
        notes: updatedNotes,
        connections: updatedConnections
      }
    })
  },

  deleteNote: (id) => {
    const state = get()
    set({
      notes: state.notes.filter((note) => note.id !== id),
      connections: state.connections.filter(
        (conn) => conn.fromNoteId !== id && conn.toNoteId !== id
      ),
      selectedNoteId: null,
      editingNoteId: null
    })
  },

  selectNote: (id) => {
    set({ selectedNoteId: id, editingNoteId: null })
  },

  startEditing: (id) => {
    set({ editingNoteId: id })
  },

  stopEditing: () => {
    set({ editingNoteId: null })
  },

  startConnection: (fromNoteId, x, y) => {
    set({ tempConnection: { fromNoteId, x, y } })
  },

  updateTempConnection: (x, y) => {
    const { tempConnection } = get()
    if (tempConnection) {
      set({ tempConnection: { ...tempConnection, x, y } })
    }
  },

  completeConnection: (toNoteId) => {
    const { tempConnection, notes, connections } = get()
    if (!tempConnection) return

    const fromNote = notes.find((n) => n.id === tempConnection.fromNoteId)
    const toNote = notes.find((n) => n.id === toNoteId)

    // Verificar se já existe uma conexão entre estas notas
    const connectionExists = connections.some(
      conn => 
        (conn.fromNoteId === fromNote?.id && conn.toNoteId === toNote?.id) ||
        (conn.fromNoteId === toNote?.id && conn.toNoteId === fromNote?.id)
    )

    if (!fromNote || !toNote || fromNote.id === toNote.id || connectionExists) {
      set({ tempConnection: null })
      return
    }

    const points = calculateCurvePoints(fromNote, toNote)

    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      connections: [...state.connections, { 
        id, 
        fromNoteId: tempConnection.fromNoteId, 
        toNoteId, 
        points 
      }],
      tempConnection: null
    }))
  },

  deleteConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id)
    }))
  },

  // Esta função não é mais necessária pois as conexões são atualizadas automaticamente
  recalculateConnections: (noteId?: string) => {
    // Função mantida para compatibilidade, mas a lógica foi movida para updateNote
    const { notes, connections } = get()
    
    const updatedConnections = connections.map(connection => {
      const fromNote = notes.find(n => n.id === connection.fromNoteId)
      const toNote = notes.find(n => n.id === connection.toNoteId)
      
      if (!fromNote || !toNote) return connection
      
      if (noteId && connection.fromNoteId !== noteId && connection.toNoteId !== noteId) {
        return connection
      }
      
      const newPoints = calculateCurvePoints(fromNote, toNote)
      return { ...connection, points: newPoints }
    })
    
    set({ connections: updatedConnections })
  }
}))