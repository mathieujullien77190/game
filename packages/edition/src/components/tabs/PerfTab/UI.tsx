import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Empty = styled.div`
  padding: 8px;
  font-family: monospace;
  font-size: 11px;
  color: #999;
`

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px 1fr;
  gap: 8px;
  padding: 0 8px 4px;
`

export const HeaderCell = styled.span`
  font-family: monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px 1fr;
  gap: 8px;
  align-items: center;
  padding: 5px 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`

export const Cell = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: #333;
`

export const BarCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const BarTrack = styled.div`
  position: relative;
  flex: 1;
  height: 10px;
  background: #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
`

export const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, p.$pct)}%;
  background: #333;
`

export const PctLabel = styled.span`
  flex-shrink: 0;
  width: 34px;
  text-align: right;
  font-family: monospace;
  font-size: 9px;
  color: #555;
`

export const Total = styled.div`
  padding: 6px 8px;
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  color: #555;
`
