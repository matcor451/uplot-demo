import { ReactNode, useContext } from 'react'

import { ChartContext } from '@/Chart'

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
