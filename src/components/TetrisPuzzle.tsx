import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import { RefreshCw, Trophy } from 'lucide-react'

const BOARD_WIDTH = 4
const BOARD_HEIGHT = 7
const CELL_SIZE = 60

const SHAPES = {
  I: { id: 'I', color: 'from-cyan-400 to-cyan-600',     cells: [[1, 1, 1, 1]], hidden: false, noRotate: false },
  O: { id: 'O', color: 'from-yellow-300 to-yellow-500', cells: [[1, 1], [1, 1]],             hidden: false, noRotate: false },
  L: { id: 'L', color: 'from-orange-400 to-orange-600', cells: [[1, 0], [1, 0], [1, 1]],     hidden: false, noRotate: false },
  T: { id: 'T', color: 'from-purple-400 to-purple-600', cells: [[1, 1, 1], [0, 1, 0]],       hidden: false, noRotate: false },
  J: { id: 'J', color: 'from-blue-500 to-blue-700',     cells: [[0, 1], [0, 1], [1, 1]],     hidden: false, noRotate: false },
  J2: { id: 'J2', color: 'from-blue-500 to-blue-700',  cells: [[0, 1], [0, 1], [1, 1]],     hidden: true,  noRotate: true  },
  L2: { id: 'L2', color: 'from-orange-400 to-orange-600', cells: [[1, 0], [1, 0], [1, 1]], hidden: true,  noRotate: true  },
  S: { id: 'S', color: 'from-green-400 to-green-600',   cells: [[0, 1, 1], [1, 1, 0]],       hidden: false, noRotate: false },
  Z: { id: 'Z', color: 'from-red-400 to-red-600',       cells: [[1, 1, 0], [0, 1, 1]],       hidden: false, noRotate: false },
}

type Piece = {
  id: string; color: string; cells: number[][]
  currentCells: number[][]; isPlaced: boolean; x: number | null; y: number | null
  hidden: boolean; noRotate: boolean
}

const rotateMatrix = (m: number[][]): number[][] => {
  const rows = m.length, cols = m[0].length
  const out = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out[c][rows - 1 - r] = m[r][c]
  return out
}

export type TetrisPuzzleHandle = {
  startHiddenPieceDrag: (clientX: number, clientY: number, pieceId?: string) => void
}

const TetrisPuzzle = forwardRef<TetrisPuzzleHandle>((_, ref) => {
  const [pieces, setPieces] = useState<Piece[]>(
    Object.values(SHAPES).map(s => ({ ...s, currentCells: s.cells, isPlaced: false, x: null, y: null }))
  )
  const [dragState, setDragState] = useState<any>(null)
  const [gameWon, setGameWon] = useState(false)
  const lastTapRef = useRef(0)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setGameWon(pieces.every(p => p.isPlaced)) }, [pieces])

  const isValidMove = useCallback((cells: number[][], x: number, y: number, pieceIndex: number, cur: Piece[]) => {
    const rows = cells.length, cols = cells[0].length
    if (x < 0 || y < 0 || x + cols > BOARD_WIDTH || y + rows > BOARD_HEIGHT) return false
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (cells[r][c] === 1) {
          const bX = x + c, bY = y + r
          for (let i = 0; i < cur.length; i++) {
            if (i === pieceIndex || !cur[i].isPlaced) continue
            const o = cur[i], oX = bX - o.x!, oY = bY - o.y!
            if (oY >= 0 && oY < o.currentCells.length && oX >= 0 && oX < o.currentCells[0].length && o.currentCells[oY][oX] === 1) return false
          }
        }
    return true
  }, [])

  const rotatePiece = useCallback((index: number) => {
    setPieces(prev => {
      const next = [...prev]
      const piece = next[index]
      if (piece.noRotate) return next
      const rotated = rotateMatrix(piece.currentCells)
      if (piece.isPlaced) {
        if (isValidMove(rotated, piece.x!, piece.y!, index, next))
          next[index] = { ...piece, currentCells: rotated }
      } else {
        next[index] = { ...piece, currentCells: rotated }
      }
      return next
    })
  }, [isValidMove])

  const startDrag = (index: number, clientX: number, clientY: number, isFromBoard = false, overrideOffset?: { x: number, y: number }) => {
    let offsetX: number, offsetY: number
    if (overrideOffset) {
      offsetX = overrideOffset.x
      offsetY = overrideOffset.y
    } else if (isFromBoard) {
      offsetX = 0; offsetY = 0 // will be set by caller via getBoundingClientRect
    } else {
      const piece = pieces[index]
      const cols = piece.currentCells[0].length
      const rows = piece.currentCells.length
      offsetX = (cols * (CELL_SIZE + 4) - 4) / 2
      offsetY = (rows * (CELL_SIZE + 4) - 4) / 2
    }
    setDragState({ index, isFromBoard, startX: clientX, startY: clientY, currentX: clientX, currentY: clientY, offsetX, offsetY })
    if (isFromBoard)
      setPieces(prev => { const n = [...prev]; n[index] = { ...n[index], isPlaced: false }; return n })
  }

  // Expose startHiddenPieceDrag so AboutSection can initiate drag of the J piece
  useImperativeHandle(ref, () => ({
    startHiddenPieceDrag(clientX: number, clientY: number, pieceId = 'J2') {
      const idx = pieces.findIndex(p => p.id === pieceId)
      if (idx === -1 || pieces[idx].isPlaced) return
      const piece = pieces[idx]
      const cols = piece.currentCells[0].length
      const rows = piece.currentCells.length
      startDrag(idx, clientX, clientY, false, {
        x: (cols * (CELL_SIZE + 4) - 4) / 2,
        y: (rows * (CELL_SIZE + 4) - 4) / 2,
      })
    }
  }))

  const handleStartInteraction = (e: any, index: number, isFromBoard = false) => {
    if (gameWon) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      rotatePiece(index); lastTapRef.current = 0; setDragState(null); return
    }
    lastTapRef.current = now

    let offsetX: number, offsetY: number
    if (isFromBoard) {
      const rect = e.currentTarget.getBoundingClientRect()
      offsetX = clientX - rect.left
      offsetY = clientY - rect.top
    } else {
      const piece = pieces[index]
      const cols = piece.currentCells[0].length
      const rows = piece.currentCells.length
      offsetX = (cols * (CELL_SIZE + 4) - 4) / 2
      offsetY = (rows * (CELL_SIZE + 4) - 4) / 2
    }

    setDragState({ index, isFromBoard, startX: clientX, startY: clientY, currentX: clientX, currentY: clientY, offsetX, offsetY })
    if (isFromBoard)
      setPieces(prev => { const n = [...prev]; n[index] = { ...n[index], isPlaced: false }; return n })
  }

  const handleMove = useCallback((e: any) => {
    if (!dragState) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragState((prev: any) => ({ ...prev, currentX: clientX, currentY: clientY }))
  }, [dragState])

  const handleEndDrag = useCallback(() => {
    if (!dragState || !boardRef.current) return
    const { index, currentX, currentY, offsetX, offsetY } = dragState
    const boardRect = boardRef.current.getBoundingClientRect()
    const pieceLeft = currentX - offsetX
    const pieceTop  = currentY - offsetY
    const dropX = Math.round((pieceLeft - boardRect.left) / (CELL_SIZE + 4))
    const dropY = Math.round((pieceTop  - boardRect.top)  / (CELL_SIZE + 4))
    setPieces(prev => {
      const next = [...prev]
      const piece = next[index]
      if (isValidMove(piece.currentCells, dropX, dropY, index, next))
        next[index] = { ...piece, isPlaced: true, x: dropX, y: dropY }
      else
        next[index] = { ...piece, isPlaced: false, x: null, y: null }
      return next
    })
    setDragState(null)
  }, [dragState, isValidMove])

  useEffect(() => {
    if (!dragState) return
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEndDrag)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEndDrag)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEndDrag)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEndDrag)
    }
  }, [dragState, handleMove, handleEndDrag])

  const ghost = (() => {
    if (!dragState || !boardRef.current) return null
    const boardRect = boardRef.current.getBoundingClientRect()
    const pieceLeft = dragState.currentX - dragState.offsetX
    const pieceTop  = dragState.currentY - dragState.offsetY
    const gx = Math.round((pieceLeft - boardRect.left) / (CELL_SIZE + 4))
    const gy = Math.round((pieceTop  - boardRect.top)  / (CELL_SIZE + 4))
    return isValidMove(pieces[dragState.index].currentCells, gx, gy, dragState.index, pieces) ? { x: gx, y: gy } : null
  })()

  const reset = () => setPieces(prev => prev.map(p => ({ ...p, isPlaced: false, x: null, y: null })))

  const draggingPiece = dragState ? pieces[dragState.index] : null
  const isHiddenDrag = draggingPiece?.hidden ?? false

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden touch-none rounded-3xl">
      <div className="w-full max-w-sm flex justify-end items-center mb-4 px-2">
        <button onClick={reset} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-xs shadow-lg border border-slate-700 transition-all">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <div className="flex flex-row gap-6 items-center justify-center w-full max-w-2xl px-2">
        {/* Board */}
        <div className="relative p-1.5 bg-slate-900 rounded-xl shadow-2xl border-2 border-slate-800 flex-shrink-0">
          <div
            ref={boardRef}
            className="relative grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
            }}
          >
            {Array(BOARD_HEIGHT).fill(0).map((_, y) =>
              Array(BOARD_WIDTH).fill(0).map((__, x) => (
                <div key={`${x}-${y}`} className="w-full h-full bg-slate-950 rounded border border-slate-800/40" />
              ))
            )}

            {/* Ghost */}
            {ghost && dragState && (
              <div
                className="absolute pointer-events-none transition-all duration-75"
                style={{
                  top: ghost.y * (CELL_SIZE + 4),
                  left: ghost.x * (CELL_SIZE + 4),
                  display: 'grid',
                  gridTemplateColumns: `repeat(${pieces[dragState.index].currentCells[0].length}, ${CELL_SIZE}px)`,
                  gap: '4px',
                }}
              >
                {pieces[dragState.index].currentCells.map((row, ry) =>
                  row.map((cell, cx) =>
                    cell
                      ? <div key={`${ry}-${cx}`} className="w-[60px] h-[60px] bg-white/5 rounded-md border-2 border-dashed border-white/20" />
                      : <div key={`${ry}-${cx}`} />
                  )
                )}
              </div>
            )}

            {/* Placed pieces */}
            {pieces.map((p, i) => p.isPlaced && (
              <div
                key={p.id}
                onMouseDown={e => handleStartInteraction(e, i, true)}
                onTouchStart={e => handleStartInteraction(e, i, true)}
                className="absolute cursor-grab active:cursor-grabbing z-10"
                style={{
                  top: p.y! * (CELL_SIZE + 4),
                  left: p.x! * (CELL_SIZE + 4),
                  display: 'grid',
                  gridTemplateColumns: `repeat(${p.currentCells[0].length}, ${CELL_SIZE}px)`,
                  gap: '4px',
                }}
              >
                {p.currentCells.map((row, ry) =>
                  row.map((cell, cx) =>
                    cell ? (
                      <div key={`${ry}-${cx}`} className={`w-[60px] h-[60px] rounded-md bg-gradient-to-br ${p.color} border border-white/20 shadow-inner flex items-center justify-center`}>
                        <div className="w-10 h-10 rounded border-t border-white/30 border-l border-white/20 bg-black/5" />
                      </div>
                    ) : <div key={`${ry}-${cx}`} />
                  )
                )}
              </div>
            ))}

            {/* Win overlay */}
            {gameWon && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center border-4 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <Trophy size={40} className="text-amber-500 mb-2 animate-bounce" />
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Solved!</h2>
                <button onClick={reset} className="mt-4 px-5 py-1.5 bg-white text-slate-950 font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-xl">
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vertical tray — hidden pieces are excluded */}
        <div className="w-20 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-2 self-stretch flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-8 py-2 w-full">
            {pieces.map((p, i) => !p.isPlaced && !p.hidden && (
              <div
                key={p.id}
                onMouseDown={e => handleStartInteraction(e, i)}
                onTouchStart={e => handleStartInteraction(e, i)}
                className="relative cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
              >
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${p.currentCells[0].length}, 14px)` }}>
                  {p.currentCells.map((row, ry) =>
                    row.map((cell, cx) => (
                      <div key={`${ry}-${cx}`} className={`w-3.5 h-3.5 rounded-sm ${cell ? `bg-gradient-to-br ${p.color} shadow-sm` : 'bg-transparent'}`} />
                    ))
                  )}
                </div>
              </div>
            ))}
            {pieces.every(p => p.isPlaced) && (
              <div className="text-[10px] text-slate-700 font-bold tracking-widest uppercase">Clear</div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay — hidden piece: no overlay, only ghost. Normal pieces: show overlay */}
      {dragState && !isHiddenDrag && createPortal(
        <div
          className="pointer-events-none opacity-80 drop-shadow-2xl"
          style={{
            position: 'fixed',
            left: dragState.currentX,
            top: dragState.currentY,
            zIndex: 9999,
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            gridTemplateColumns: `repeat(${pieces[dragState.index].currentCells[0].length}, ${CELL_SIZE}px)`,
            gap: '4px',
          }}
        >
          {pieces[dragState.index].currentCells.map((row, ry) =>
            row.map((cell, cx) =>
              cell ? (
                <div key={`${ry}-${cx}`} className={`w-[60px] h-[60px] rounded-md bg-gradient-to-br ${pieces[dragState.index].color} border border-white/40 shadow-2xl`} />
              ) : <div key={`${ry}-${cx}`} />
            )
          )}
        </div>,
        document.body
      )}
    </div>
  )
})

TetrisPuzzle.displayName = 'TetrisPuzzle'
export default TetrisPuzzle
