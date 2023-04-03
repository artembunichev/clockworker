import { AnimationSequence } from '../entities/animation'

export const getRowSequence = ( row: number, length: number ): AnimationSequence => {
  return Array.from( { length } ).map( ( _, index ) => [ row, index ] )
}
