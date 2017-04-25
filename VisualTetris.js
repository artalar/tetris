var LogOn = false;
var figure = false;
var figures = {
	square: {
		left:	[ [1,1], [1,2], [2,1], [2,2] ],
		up:		[ [1,1], [1,2], [2,1], [2,2] ],
		right:	[ [1,1], [1,2], [2,1], [2,2] ],
		down:	[ [1,1], [1,2], [2,1], [2,2] ]
	},
	line: {
		left:	[ [1,1], [1,2], [1,3], [1,4] ],
		up:		[ [-1,3], [0,3], [1,3], [2,3] ],
		right:	[ [1,1], [1,2], [1,3], [1,4] ],
		down:	[ [-1,3], [0,3], [1,3], [2,3] ]
	},
	zigzag: {
		left:	[ [1,1], [1,2], [2,2], [2,3] ],
		up:		[ [0,3], [1,3], [1,2], [2,2] ],
		right:	[ [1,1], [1,2], [2,2], [2,3] ],
		down:	[ [0,3], [1,3], [1,2], [2,2] ]
	},
	zagzig: {
		left:	[ [1,3], [1,2], [2,2], [2,1] ],
		up:		[ [0,2], [1,2], [1,3], [2,3] ],
		right:	[ [1,3], [1,2], [2,2], [2,1] ],
		down:	[ [0,2], [1,2], [1,3], [2,3] ]
	},
	border: {
		left:	[ [1,3], [2,1], [2,2], [2,3] ],
		up:		[ [0,2], [1,2], [2,2], [2,3] ],
		right:	[ [1,1], [1,2], [1,3], [2,1] ],
		down:	[ [0,2], [0,3], [1,3], [2,3] ]
	},
	reborder: {
		left:	[ [1,1], [2,1], [2,2], [2,3] ],
		up:		[ [0,3], [0,2], [1,2], [2,2] ],
		right:	[ [1,1], [1,2], [1,3], [2,3] ],
		down:	[ [0,3], [1,3], [2,3], [2,2] ]
	},
	triangle: {
		left:	[ [1,2], [2,1], [2,2], [2,3] ],
		up:		[ [0,2], [1,2], [1,3], [2,2] ],
		right:	[ [1,1], [1,2], [1,3], [2,2] ],
		down:	[ [0,3], [1,2], [1,3], [2,3] ]
	}}
var nextFigureName = GetRandomFigureName(figures);
var y = 20, x = 10;
var gameFieldData = CreateFieldData(y,x);
var gameField = document.createElement('div');
var nextFigureField = CreateFieldData(2,4);
var score = 0;
var notes = document.createElement('div');
var intervalNumber;
var headField = document.createElement('div');
var centre = document.createElement('div');
centre.style.margin = "0 auto";
centre.style.display = "table";
document.body.appendChild(centre);
centre.appendChild(headField);
gameField.style.backgroundColor = "#F7DDC3";
gameField.style.width = 23*x + "px";
centre.appendChild(gameField);
HTMLView(gameFieldData);
notes.innerHTML = "<br><br>Use arrow buttons for move figure." +
"<br>\"ArrowUP\" - rotate figure." +
"<br>\"Space\" - for start and pause." +
"<br>\"F5\" - for new game."
centre.appendChild(notes);
RenewFigure();
document.onkeydown = function(event){UseButton(event.code)}
Play()
function lo9(str, alert){
	if(LogOn){
		if(alert){
			alert(str);
		}
		else{
			console.log(str);
		}
	}
}
function GetObjectCopy(inputObject) {
	return JSON.parse(JSON.stringify(inputObject));
}
function CreateFieldData(y,x) {
	lo9('.CreateFieldData: y: ' + y + ', x: ' + x)
	var result = [];
	result.push(GetLine("*", "*", x))
	for(var i = 0; i < y; ++i){
		result.push(GetLine("_", "*", x))
	}
	result.push(GetLine("*", "*", x))
	lo9('.CreateFieldData: output result is: ' + result)
	return result;
}
function FillGameField(div) {
	var table = document.createElement('table');
	table.style
	table.appendChild()
}
function GetRandomFigureName(figures){
	lo9(".GetRandomFigureName: input figures is: " + figures);
	var intropy = [];
	for(var figureName in figures){intropy.push(figureName)}
	var rand = (Math.random() * intropy.length + "")[0]; //[0] - round
	lo9(".GetRandomFigureName: random name is: " + intropy[rand]);
	return intropy[rand];
}
function RenewFigure(){
	lo9('.RenewFigure: old figure is:' + JSON.stringify(figures))
	var name = nextFigureName;
	nextFigureName = GetRandomFigureName(figures);
	var shift;
	if(name == "line"){
		var shift = Math.ceil(x/2) - 2;
	}else{
		var shift = Math.ceil(x/2) - 1
	}
	figure = {};
	figure.name = name;
	figure.color = GetColorSymbolByName(name)
	figure.position = "left"
	lo9('.RenewFigure: name:' + name)
	figure.startDots = GetObjectCopy(figures[name]["left"])
	figure.shift = [0, shift];
	ViewHead();
	lo9('.RenewFigure: new figure is:' + figure)
}
function GetColorSymbolByName(name) {
	switch(name){
		case "square":
			return "1";
		case "line":
			return "2";
		case "zigzag":
			return "3";
		case "zagzig":
			return "4";
		case "border":
			return "5";
		case "reborder":
			return "6";
		case "triangle":
			return "7";
	}
}
function GetShiftPosition(figure){
	lo9(".GetShiftPosition: figure is" + JSON.stringify(figure))
	if(!figure){return false}
	var result = [];
	for(var i = 0; i < figure.startDots.length; i++){
		result.push([
			figure.startDots[i][0] + figure.shift[0], //y
			figure.startDots[i][1] + figure.shift[1] //x
		]);
	}
	lo9(".GetShiftPosition: shift position is: " + result)
	return result;
}
function GetLine(backgroundSymbol, borderSymbol, count) {
	lo9(".GetLine: backgroundSymbol is: " + backgroundSymbol)
	lo9(".GetLine: borderSymbol is: " + borderSymbol)
	lo9(".GetLine: count is: " + count)
	var line = [borderSymbol];
	for(var i = 0; i < count; ++i){
		line.push(backgroundSymbol);
	}
	line.push(borderSymbol);
	lo9('.GetLine: output line is : ' + line)
	return line;
}
function GetSimbolFromLandscape(cordinats, gameFieldData) {
	lo9(".GetSimbolFromLandscape: cordinats is: " + cordinats);
	return gameFieldData[cordinats[0]][cordinats[1]];
}
function ViewFigureOnLandscape(figure, gameFieldData) {
	lo9(".ViewFigureOnLandscape: figure is: " + JSON.stringify(figure))
	lo9(".ViewFigureOnLandscape: gameFieldData is: " + JSON.stringify(gameFieldData))
	if(figure.length == 4){
		var dots = GetObjectCopy(figure);
		var char = GetColorSymbolByName(nextFigureName);
	}else{
		var dots = GetShiftPosition(figure);
		var char = figure.color;
	}
	
	var outputlandscape = GetObjectCopy(gameFieldData);
	if(!dots){
		lo9(".ViewFigureOnLandscape: coordinats is empty");
		return outputlandscape;
	}
	for(var i = 0; i < dots.length; ++i){
		var y = dots[i][0];
		var x = dots[i][1];
		lo9(".ViewFigureOnLandscape: y: " + y + ", x: " + x);
		outputlandscape[y][x] = char;
	}
	lo9(".ViewFigureOnLandscape: output gameFieldData: " + JSON.stringify(outputlandscape));
	return outputlandscape;
}
function GetShift(figure, direction) {
	lo9('.GetShift: figure: ' + JSON.stringify(figure));
	lo9('.GetShift: direction: ' + direction);
	var shiftFigure = GetObjectCopy(figure);
	switch(direction){
		case "ArrowDown":
			shiftFigure.shift[0] += 1;
			shiftFigure.shift[1] += 0;
			if(ChekDirection(GetShiftPosition(shiftFigure))){
				return shiftFigure;
			}else{
				return false;
			}
		case "ArrowLeft":
			shiftFigure.shift[0] += 0;
			shiftFigure.shift[1] += -1;
			break;
		case "ArrowRight":
			shiftFigure.shift[0] += 0;
			shiftFigure.shift[1] += 1;
			break;
		case "ArrowUp":
			lo9('.GetShift: RotateFigure next');
			RotateFigure(shiftFigure);
			break;
		default:
			return false;
	}
	lo9('.GetShift: shift is: ' + shiftFigure.shift);
	return ChekDirection(GetShiftPosition(shiftFigure)) ? shiftFigure : false;
}
function RotateFigure(figure) {
	lo9(".RotateFigure: input figure is " + figure);
	switch (figure.position){
		case "left":
			figure.position = "up";
			break;
		case "up":
			figure.position = "right";
			break;
		case "right":
			figure.position = "down";
			break;
		case "down":
			figure.position = "left";
			break;
	}
	figure.startDots = GetObjectCopy(figures[figure.name][figure.position]);
	lo9(".RotateFigure: ratate figure is " + figure);
}
function ChekDirection(cordinats){
	lo9(".ChekDirection: cordinats is: " + JSON.stringify(cordinats))
	for(var i = 0; i < cordinats.length; ++i){
		if(GetSimbolFromLandscape(cordinats[i], gameFieldData) != '_'){
			lo9('.ChekDirection: direction not assigned');
			return false;
		}
	}
	lo9(".ChekDirection: direction assigned")
	return true;
}
function ConvertToLandscape(figure) {
	lo9(".ConvertToLandscape: figure is" + JSON.stringify(figure));
	gameFieldData = ViewFigureOnLandscape(figure, gameFieldData);
	for(var line = gameFieldData.length - 2; line > 0; --line){
		if(gameFieldData[line].indexOf("_") == -1){
			++score;
			ClearLineAndFallingLandscape(line);
			line++;
		}
	}
	function ClearLineAndFallingLandscape(line) {
		lo9(".ConvertToLandscape: " + (line+1) + " line is full");
		for(var i = line; i > 1; --i){
			gameFieldData[i] = gameFieldData[i-1];
		}
		gameFieldData[0] = GetLine("*", "*", x);
		gameFieldData[1] = GetLine("_", "*", x);
	}
}
function GetColor(option){
	switch(option){
		case "*":
			return "#665544";
		case "1":
			return "#8b8bd6"; //square
		case "2":
			return "C390D4"; //line
		case "3":
			return "#FAFA70"; //zigzag
		case "4":
			return "#FAEF50"; //zagzig
		case "5":
			return "#FCB474"; //border
		case "6":
			return "#FC9D74"; //reborder
		case "7":
			return "#73ba73"; //triangle
		default:
			return "#F7DDC3";
	}
}
function HTMLView(gameFieldData){
	lo9(".HTMLView: input gameFieldData: " + gameFieldData);
	var htmlFormat = '<table height=\'' + 20*y + '\' width=\'' + 23*x + '\'>';
	for(var str = 0; str < gameFieldData.length; str++){
		htmlFormat += '<tr>';
		for(var ceil = 0; ceil < gameFieldData[str].length; ++ceil){
			var color = GetColor(gameFieldData[str][ceil]);
			htmlFormat += '<td bgcolor = \'' + color + '\' ></td>';
		}
		htmlFormat += '</tr>';
	}
	lo9(".HTMLView: output htmlFormat: " + htmlFormat);
	gameField.innerHTML = htmlFormat
}
function ViewHead(){
	var headHTML = '';
	headHTML +=  '<table height=\'' + 5*y +'\' width=\'' + 23*x +
	'\'><tr><th rowspan=\'6\' ' +
	'height=\'' + 2*y + '\' width=\'' + 11*x + '\'><b>SCORES	:<br>' + score + '</th>'
	tmpnextFigureLandscape = ViewFigureOnLandscape(figures[nextFigureName].left, nextFigureField)
	for(var str = 0; str < tmpnextFigureLandscape.length; str++){
		headHTML += '<tr bgcolor ="#F7DDC3" >';
		for(var ceil = 0; ceil < tmpnextFigureLandscape[str].length; ++ceil){
			var color = GetColor(tmpnextFigureLandscape[str][ceil]);
			headHTML += '<th bgcolor = \'' + color + '\' ></th>';
		}
		headHTML += '</tr>';
	}
	headField.innerHTML = headHTML +=  '</th></tr></table>';
}
function AutoFigureFall(){ //job
	var reload = false; //renew speed
	lo9(".AutoFigureFall: Start");
	if(!figure){
		RenewFigure();
		if(!ChekDirection(GetShiftPosition(figure))){
			HTMLView(ViewFigureOnLandscape(figure, gameFieldData))
			alert("Game over! Your score is: " + score);
			Stop();
		}
	}else{
		var newFigure = GetShift(figure, "ArrowDown");
		if(newFigure){
			figure = newFigure;
		}else{
			ConvertToLandscape(figure);
			figure = false;
			reload = true;
		}
	}
	HTMLView(ViewFigureOnLandscape(figure, gameFieldData));
	if(reload){
		Stop();
		Play()
	}
}
function UseButton(key) {
	switch(key){
		case "Space":
			if(intervalNumber){
				Stop();
			}else{
				Play();
			}
			break;
		case "ArrowDown":
			if(!figure) return;
			AutoFigureFall();
			break;
		case "ArrowUp":
		case "ArrowRight":
		case "ArrowLeft":
			if(!figure) return;
			var newFigure = GetShift(figure, key);
			if(newFigure){
				figure = newFigure;
				HTMLView(ViewFigureOnLandscape(figure, gameFieldData))
			}
	}
}
function Play(){
	intervalNumber = (setInterval(AutoFigureFall, 700 - score*2)); //time period lower, when score up
}
function Stop(){
	clearInterval(intervalNumber);
	intervalNumber = undefined;
}