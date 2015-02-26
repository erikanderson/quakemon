var app = angular.module('quakemon');

app.animation('.my-repeat-animation', function() {
  return {
    enter : function(element, done) {
      jQuery(element).css({
        position:'relative',
        left:-10,
        opacity:0
      });
      jQuery(element).animate({
        left:0,
        opacity:1
      }, done);
    },

    leave : function(element, done) {
      jQuery(element).css({
        position:'relative',
        left:0,
        opacity:1
      });
      jQuery(element).animate({
        left:-10,
        opacity:0
      }, done);
    },

    move : function(element, done) {
      jQuery(element).css({
        opacity:0.5
      });
      jQuery(element).animate({
        opacity:1
      }, done);
    }
  };
});