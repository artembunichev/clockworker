import { ExpandedDirection, PrimitiveDirection, XY } from 'project-utility-types/plane';
import { isEqual } from 'shared/lib/is-equal';

import { ViewDirections } from '../entities/animation-controller';

export const getMovementDirection = ( start: XY, end: XY ): ExpandedDirection | null => {
  if ( isEqual( start, end ) ) {
    return null;
  }

  var direction: ExpandedDirection = '' as ExpandedDirection;
  if ( start.y < end.y ) {
    direction += 'down';
  } else if ( start.y > end.y ) {
    direction += 'up';
  }

  if ( start.x < end.x ) {
    direction += 'right';
  } else if ( start.x > end.x ) {
    direction += 'left';
  }

  return direction as ExpandedDirection;
};

export const getReversedPrimitiveDirection = ( direction: PrimitiveDirection ): PrimitiveDirection => {
  if ( direction === 'down' ) {
    return 'up';
  } else if ( direction === 'right' ) {
    return 'left';
  } else if ( direction === 'up' ) {
    return 'down';
  } else {
    return 'right';
  }
};

export const convertMovementDirectionToViewDirection = (
  direction: ExpandedDirection,
): ViewDirections => {
  return direction.includes( 'right' )
    ? ViewDirections.RIGHT
    : direction.includes( 'left' )
    ? ViewDirections.LEFT
    : direction.includes( 'down' )
    ? ViewDirections.DOWN
    : ViewDirections.UP;
};

export const convertExpandedDirectionToPrimitiveDirection = (
  direction: ExpandedDirection,
): PrimitiveDirection => {
  return direction.includes( 'right' )
    ? 'right'
    : direction.includes( 'left' )
    ? 'left'
    : direction.includes( 'down' )
    ? 'down'
    : 'up';
};

// убирает направления, компенсирующие друг друга (пример: вверх-вниз)
export const compensatePrimitiveMovementDirections = (
  directions: Array<PrimitiveDirection>,
): Array<PrimitiveDirection> => {
  return directions.filter( ( direction ) => {
    return directions.every( ( d ) => d !== getReversedPrimitiveDirection( direction ) );
  } );
};

export const getSingleMovementDirection = (
  directions: Array<PrimitiveDirection>,
): ExpandedDirection | null => {
  const filteredDirections = compensatePrimitiveMovementDirections( directions );

  if ( filteredDirections.length ) {
    const movementDirection: ExpandedDirection = filteredDirections
      // сортируем, чтобы названия направлений получались в едином формате
      .sort( ( _, b ) => ( b === 'down' || b === 'up' ? 1 : -1 ) )
      .join( '' ) as ExpandedDirection;

    return movementDirection;
  }

  return null;
};
