# CodeBoy
2D platformer engine in JavaScript.

## Features
- Constructing levels is as easy as adding additional level objects (containing coordinates and size) to the corresponding object-arrays. All objects are automatically processed by the rerender function.
```javascript
blocks = [{x: 90, y: 270, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 180, y: 270, width: 30, height: 30, image: imageBlock, name: "block"}];
```
- Removing or "killing" a level object can be achieved using the splice method.
```javascript
if (onTop && item.name === "bullet") {
          cannonbullets.splice(y, 1);
          stomp.play();
          land();
        };
```
- Separate vertical and horizontal collision detection applied to all level objects (static and animated). This results in  automated resolution of character attacks (vertical top-down collision) and character damage (horizontal and vertical bottom-up collision).
- Defining a hostile object is a matter of modifying an if-statement.
```javascript
if (onSide && item.name === "bullet" && imageBoyPosition[1] + imageBoyPosition[3] > item.y) {
          theme.pause();
          death.play();
          landed = false;
          setTimeout(function(){ window.location.reload() }, 3100);
        };
```
- Gravity can be activated on demand by calling the land function. Once again, the vertical collision detection is used to determine the length of the fall. Fall damage can be implemented by adding a counter to the first if-statement.
```javascript
function land() {
  var interval = setInterval(function() {
    if (!checkVerticalCollision()) {
      imageBoyPosition[1] += 10;
      rerender();
    };
    if(checkVerticalCollision()) {
      landed = true;
      rerender();
      clearInterval(interval);
    };
  }, 30);
};
```
