import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick: () => void
}

export const Button = ({ children, onClick }: ButtonProps) => (
  <button className='border-2 cursor-pointer' onClick={onClick}>
    {children}
  </button>
)