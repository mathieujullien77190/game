import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`

export const AddButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1.5px solid ${({ $active }) => ($active ? "#FF5630" : "#3A6FD8")};
  background: ${({ $active }) => ($active ? "#fff0ed" : "#f0f4ff")};
  color: ${({ $active }) => ($active ? "#FF5630" : "#3A6FD8")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

export const HelpList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const HelpCard = styled.div<{ $selected: boolean }>`
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3A6FD8" : "#ddd")};
  border-radius: 8px;
  padding: 8px 10px;
  background: ${({ $selected }) => ($selected ? "#f0f4ff" : "#fafafa")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const HelpId = styled.span`
  font-size: 11px;
  font-family: monospace;
  color: #999;
`

export const HelpPreviewText = styled.span`
  font-size: 11px;
  color: #555;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 13px;
  padding: 0 2px;
  &:hover { color: #FF5630; }
`

export const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`

export const Label = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
`

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  &:focus { outline: none; border-color: #3A6FD8; }
`

export const ArrowRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const ArrowButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 4px;
  border: 1.5px solid ${({ $active }) => ($active ? "#3A6FD8" : "#ddd")};
  background: ${({ $active }) => ($active ? "#3A6FD8" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  font-size: 11px;
  cursor: pointer;
`

export const Preview = styled.div`
  background: #f5f5f7;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
`

export const PreviewBox = styled.div<{ $arrow: string }>`
  position: relative;
  background: white;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  color: #333;
  max-width: 180px;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  ${({ $arrow }) => $arrow === "left" && `
    &::before {
      content: "";
      position: absolute;
      left: -8px; top: 50%; transform: translateY(-50%);
      border: 8px solid transparent;
      border-right-color: #ddd;
      border-left: none;
    }
    &::after {
      content: "";
      position: absolute;
      left: -6px; top: 50%; transform: translateY(-50%);
      border: 7px solid transparent;
      border-right-color: white;
      border-left: none;
    }
  `}
  ${({ $arrow }) => $arrow === "right" && `
    &::before {
      content: "";
      position: absolute;
      right: -8px; top: 50%; transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: #ddd;
      border-right: none;
    }
    &::after {
      content: "";
      position: absolute;
      right: -6px; top: 50%; transform: translateY(-50%);
      border: 7px solid transparent;
      border-left-color: white;
      border-right: none;
    }
  `}
  ${({ $arrow }) => $arrow === "top" && `
    &::before {
      content: "";
      position: absolute;
      top: -8px; left: 50%; transform: translateX(-50%);
      border: 8px solid transparent;
      border-bottom-color: #ddd;
      border-top: none;
    }
    &::after {
      content: "";
      position: absolute;
      top: -6px; left: 50%; transform: translateX(-50%);
      border: 7px solid transparent;
      border-bottom-color: white;
      border-top: none;
    }
  `}
  ${({ $arrow }) => $arrow === "bottom" && `
    &::before {
      content: "";
      position: absolute;
      bottom: -8px; left: 50%; transform: translateX(-50%);
      border: 8px solid transparent;
      border-top-color: #ddd;
      border-bottom: none;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: -6px; left: 50%; transform: translateX(-50%);
      border: 7px solid transparent;
      border-top-color: white;
      border-bottom: none;
    }
  `}
`
