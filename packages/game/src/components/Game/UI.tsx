import styled from "styled-components"

export const Lobby = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`

export const PlayButton = styled.button`
  padding: 16px 48px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 3px;

  &:hover {
    background: #444;
  }
`

export const RestartButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
  }
`

export const PauseButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? "#333" : "rgba(255,255,255,0.85)")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  z-index: 10;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`
