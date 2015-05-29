# js2css
Use plain JavaScript to write your CSS. Build status: (Coming soon)

## Disclaimer
Inspired by the [JS CSS](http://2015.jsconf.us/speakers.html#pourkhomami) talk at [JSConf 2015](http://2015.jsconf.us/), this POC was thrown together in a few hours between sessions.
Let me know what you think and maybe we can make it usable at some points.

## Install
    npm install js2css

## gulp-js2css
````
'use strict';
var gulp = require('gulp');
var js2css = require('gulp-js2css');

gulp.task('default', function() {
    return gulp.src('src/**/*.css.js')
        .pipe(js2css())
        .pipe(gulp.dest('dist'));
});
````

## Usage
    var js2css = require('./lib/js2css.js');
    console.log(js2css({
      body: {
          color: 'red'
      }
    }));

## What else
````
function color() {
	return 'red';
}

module.exports = {
	'div': {
		'color': color,
		margin: 100,
		background: ['jalla', 'moz-jalla', 'ie-jalla'],
		'.header': {
			'font-size': '12px',
			'&.big': {
				fontSize: '14px'
			}
		}
	}
};


/*
div {
	color: red;
	margin: 100;
	background: jalla;
	background: moz-jalla;
	background: ie-jalla;
}
 div .header {
	font-size: 12px;
}
 div .header.big {
	font-size: 14px;
}
*/

````

### Mixins
````
'use strict';
var themeColor = '#BADA55';
var textStyles = function(size) {
	return {
		color: themeColor,
		fontSize: size + 'px',
		lineHeight: size + 'px'
	};
};

var coolPadz = function(pad) {
	return {
		paddingTop: pad * 0.6 + 'px',
		paddingBottom: pad * 0.6 + 'px',
		paddingLeft: pad + 'px',
		paddingRight: pad + 'px',
	};
};

var style = {
	body: {
		color: themeColor,
		p: textStyles(16),
		'.title': {
			color: '#000',
			coolPadz: 40
		}
	}
};

module.exports = {
	styles: style,
	mixins: {
		coolPadz: coolPadz
	}
};

 /*
 body {
	color: #BADA55;
}
 body .title {
	color: #000;
	padding-top: 24px;
	padding-bottom: 24px;
	padding-left: 40px;
	padding-right: 40px;
}
 body p {
	color: #BADA55;
	font-size: 16px;
	line-height: 16px;
}
*/
````

### Global mixins
`js2css.mixins.myGlobalMixn = function(){}`


## Credits
The inspiration came from [Parsha Pourkhomami's talk at JSConf 2015](http://2015.jsconf.us/speakers.html#pourkhomami).
Most of the code was ruthlessly stolen from this project: https://github.com/stolksdorf/Cssjs
