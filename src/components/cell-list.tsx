import React from 'react'
import { useTypedSelector } from '../hooks/use-typed-selector'

const CellList: React.FC = () => {
  useTypedSelector((state) => state);
  return (
    <div>
      Cell List
    </div>
  )
}

export default CellList
