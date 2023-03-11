module.exports = {
  'detect-test-mode': {
    create( context ) {
      const detectTestMode = ( comment ) => {
        if ( comment.value.toLowerCase().includes( 'test-mode' ) ) {
          context.report( comment, 'You are in a test mode' );
        }
      };

      return {
        Program( node ) {
          const comments = context.getSourceCode().getAllComments();
          comments.forEach( detectTestMode );
        },
      };
    },
  },
};
