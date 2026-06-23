import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AddButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px 12px;
  background: ${({ $active }) => ($active ? "#1a73e8" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border: 1px solid ${({ $active }) => ($active ? "#1a73e8" : "#ddd")};
  border-radius: 6px;
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${({ $active }) => ($active ? "#1557b0" : "#e8e8e8")};
  }
`

export const LineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const LineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`

export const LineLabel = styled.span`
  font-size: 10px;
  color: #555;
  font-family: monospace;
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;

  &:hover {
    color: #e53935;
  }
`

export const LineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const LineId = styled.span`
  font-weight: bold;
  color: #333;
  margin-right: 6px;
`

export const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 20px;
  background: #efefef;
  border-left: 2px solid #ccc;
  border-radius: 0 3px 3px 0;
  font-family: monospace;
  font-size: 10px;
`

export const LinkId = styled.span`
  color: #888;
  min-width: 40px;
`

export const LinkDetail = styled.span`
  color: #555;
  flex: 1;
`

export const TypeRow = styled.div`
  display: flex;
  gap: 6px;
`

export const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 5px 8px;
  background: ${({ $active }) => ($active ? "#333" : "#f0f0f0")};
  color: ${({ $active }) => ($active ? "#fff" : "#666")};
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: ${({ $active }) => ($active ? "#444" : "#e0e0e0")};
  }
`

export const TypeBadge = styled.span<{ $curve: boolean }>`
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ $curve }) => ($curve ? "#ede7f6" : "#e8f0fe")};
  color: ${({ $curve }) => ($curve ? "#7b1fa2" : "#1565c0")};
  font-family: monospace;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

export const LinkActivated = styled.button<{ $on: boolean }>`
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid ${({ $on }) => ($on ? "#34a853" : "#ccc")};
  background: ${({ $on }) => ($on ? "#e6f4ea" : "#f5f5f5")};
  color: ${({ $on }) => ($on ? "#34a853" : "#aaa")};
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: ${({ $on }) => ($on ? "#d4edda" : "#ebebeb")};
  }
`

