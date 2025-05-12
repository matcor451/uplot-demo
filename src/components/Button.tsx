import { ChartContext } from '@/Chart'
import { ReactNode, useContext } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
}

export const Button = ({ children, onClick }: ButtonProps) => {
  const { buttonClassname } = useContext(ChartContext)

  return (
    <button className={buttonClassname} onClick={onClick}>
      {children}
    </button>
  )
}
