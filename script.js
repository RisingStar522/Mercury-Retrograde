var tl = new TimelineMax({repeat:-1});


tl.add(TweenMax.to("#facebook", 4, {morphSVG:"#pinterest", repeat:0, shapeIndex:-3}) );

tl.add(TweenMax.to("#facebook", 4, {morphSVG:"#google_8_"})    );

tl.add(TweenMax.to("#facebook", 4, {morphSVG:"#twitter"}));
tl.add(TweenMax.to("#facebook", 4, {morphSVG:"#facebook"}) );