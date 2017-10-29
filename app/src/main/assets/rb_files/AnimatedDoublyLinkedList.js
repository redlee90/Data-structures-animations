// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function AnimatedDoublyLinkedList(id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor)
{
	this.init(id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor);
}

AnimatedDoublyLinkedList.prototype = new AnimatedObject();
AnimatedDoublyLinkedList.prototype.constructor = AnimatedDoublyLinkedList;
AnimatedDoublyLinkedList.superclass = AnimatedObject.prototype;


AnimatedDoublyLinkedList.prototype.init = function(id, val, wth, hgt, linkPer, verticalOrientation, linkPosEnd, numLab, fillColor, edgeColor)
{
	
	AnimatedDoublyLinkedList.superclass.init.call(this);

	this.w = wth;
	this.h = hgt;
	this.backgroundColor = fillColor;
	this.foregroundColor = edgeColor;
	
	this.vertical = verticalOrientation;
	this.linkPositionEnd = linkPosEnd;
	this.linkPercent = linkPer;
	
	this.numLabels = numLab;
	
	this.labels = [];
	this.labelPosX = [];
	this.labelPosY = [];
	this.labelColors = [];
	this.nullPointer = false;
	
	this.currentHeightDif = 6;
	this.maxHeightDiff = 5;
	this.minHeightDiff = 3;
	
	
	
	for (var i = 0; i < this.numLabels; i++)
	{
		this.labels[i] = "";
		this.labelPosX[i] = 0;
		this.labelPosY[i] = 0;
		this.labelColors[i] = this.foregroundColor;
	}
	
	this.labels[0] = val;
	this.highlighted = false;
	this.objectID = id;	
}

		
		
AnimatedDoublyLinkedList.prototype.left = function()
{
	if (this.vertical)
	{
		return this.x - this.w / 2.0; 
	}
	else if (this.linkPositionEnd)
	{
		return this.x - ((this.w * (1 - this.linkPercent)) / 2);
	}
	else
	{
		return this.x  - (this.w * (this.linkPercent + 1)) / 2;
	}
}
		

AnimatedDoublyLinkedList.prototype.setNull = function(np)
{
	if (this.nullPointer != np)
	{		   
		this.nullPointer = np;
	}
	
}

AnimatedDoublyLinkedList.prototype.getNull = function()
{
	return this.nullPointer;   
}

AnimatedDoublyLinkedList.prototype.right = function()
{
	if (this.vertical)
	{
		return this.x + this.w / 2.0; 
	}
	else if (this.linkPositionEnd)
	{
		return this.x + ((this.w * (this.linkPercent + 1)) / 2);
	}
	else
	{
		return this.x + (this.w * (1 - this.linkPercent)) / 2;
	}
} 

AnimatedDoublyLinkedList.prototype.top = function()
{
	if (!this.vertical)
	{
		return this.y - this.h / 2.0; 			   
	}
	else if (this.linkPositionEnd)
	{
		return this.y - (this.h * (1 -this.linkPercent)) / 2;   
	}
	else
	{
		return this.y - (this.h * (1 + this.linkPercent)) / 2;   
	}
}

AnimatedDoublyLinkedList.prototype.bottom = function()
{
	if (!this.vertical)
	{
		return this.y + this.h / 2.0; 			   
	}
	else if (this.linkPositionEnd)
	{
		return this.y + (this.h * (1 +this.linkPercent)) / 2;   
	}
	else
	{
		return this.y + (this.h * (1 - this.linkPercent)) / 2;   
	}
}


// TODO: Should we move this to the draw function, and save the
//       space of the arrays?  Bit of a leftover from the Flash code,
//       which did drawing differently
AnimatedDoublyLinkedList.prototype.resetTextPosition = function()
{
	this.labelPosY[0] = this.y;
	this.labelPosX[0] = this.left() +  this.w/2;		
}


AnimatedDoublyLinkedList.prototype.getTailPointerAttachPos = function(fromX, fromY, anchor)
{
	if (anchor==0) {
		return [this.left()+this.w*this.linkPercent/2, this.y];								
	} else if (anchor==1) {
		return [this.right()-this.w*this.linkPercent/2, this.y];
	}
}


AnimatedDoublyLinkedList.prototype.getHeadPointerAttachPos = function(fromX, fromY, anchor) 
{
	if (anchor==null) {
		return this.getClosestCardinalPoint(fromX, fromY);
	}
	else if (anchor==0) {
		return [this.left(),this.y];
	} else  {
		return [this.right(),this.y];
	}
	//return this.getClosestCardinalPoint(fromX, fromY);			
}


AnimatedDoublyLinkedList.prototype.setWidth = function(wdth)
{
	this.w = wdth;
	this.resetTextPosition();
}


AnimatedDoublyLinkedList.prototype.setHeight = function(hght)
{
	this.h = hght;
	this.resetTextPosition();
}

AnimatedDoublyLinkedList.prototype.getWidth = function()
{
	return this.w;
}

AnimatedDoublyLinkedList.prototype.getHeight = function()
{
	return this.h;
}

AnimatedDoublyLinkedList.prototype.draw = function(context)
{
	var startX;
	var startY;
	
	startX = this.left();
	startY = this.top();
	
	if (this.highlighted)
	{
		context.strokeStyle = "#ff0000";
		context.fillStyle = "#ff0000";
		
		context.beginPath();
		context.moveTo(startX - this.highlightDiff,startY- this.highlightDiff);
		context.lineTo(startX+this.w + this.highlightDiff,startY- this.highlightDiff);
		context.lineTo(startX+this.w+ this.highlightDiff,startY+this.h + this.highlightDiff);
		context.lineTo(startX - this.highlightDiff,startY+this.h + this.highlightDiff);
		context.lineTo(startX - this.highlightDiff,startY - this.highlightDiff);				
		context.closePath();
		context.stroke();
		context.fill();
	}
	context.strokeStyle = this.foregroundColor;
	context.fillStyle = this.backgroundColor;
	
	context.beginPath();
	context.moveTo(startX ,startY);
	context.lineTo(startX + this.w, startY);
	context.lineTo(startX + this.w, startY + this.h);
	context.lineTo(startX, startY + this.h);
	context.lineTo(startX, startY);
	context.closePath();
	context.stroke();
	context.fill();
		
	var i;
	
	startY = this.top();
	startX = this.left() + this.w*this.linkPercent;
	context.beginPath();
	context.moveTo(startX ,startY);
	context.lineTo(startX, startY + this.h);
	startX = this.right() - this.w*this.linkPercent;
	context.moveTo(startX ,startY);
	context.lineTo(startX, startY + this.h);
	context.closePath();
	context.stroke();
	
	if  (!this.vertical && this.linkPositionEnd)
	{
		startX = this.right() - this.w * this.linkPercent;
		startY = this.top();
		
		context.beginPath();
		context.moveTo(startX, startY + this.h);
		context.lineTo(startX, startY);
		if (this.nullPointer)
		{	
			context.lineTo(this.right(), startY + this.h);
		}
		context.closePath();
		context.stroke();		
		
	}
	else // (!vertical && !linkPositionEnd)
	{
		startX = this.left()  + this.w * this.linkPercent;
		startY = this.top() ;
		
		context.beginPath();
		context.moveTo(startX, startY + this.h);
		context.lineTo(startX, startY);
		if (this.nullPointer)
		{	
			context.lineTo(this.left(), startY);
		}
		context.closePath();
		context.stroke();	
	}
	
	
	context.textAlign = 'center';
	context.font         = '10px sans-serif';
	context.textBaseline   = 'middle'; 
	context.lineWidth = 1;
	
	
	this.resetTextPosition();
	for (i = 0; i < this.numLabels; i++)
	{
		context.fillStyle = this.labelColors[i];
		context.fillText(this.labels[i], this.labelPosX[i], this.labelPosY[i]); 
	}
}


AnimatedDoublyLinkedList.prototype.setTextColor = function(color, textIndex)
{
	
	this.labelColors[textIndex] = color;
}

AnimatedDoublyLinkedList.prototype.getTextColor = function(textIndex)
{
	return this.labelColors[textIndex];
}

AnimatedDoublyLinkedList.prototype.getText = function(index)
{
	return this.labels[index];  
}

AnimatedDoublyLinkedList.prototype.setText = function(newText, textIndex)
{
	this.labels[textIndex] = newText;
	this.resetTextPosition();
}

AnimatedDoublyLinkedList.prototype.createUndoDelete = function() 
{		
	return new UndoDeleteLinkedList(this.objectID, this.numLabels, this.labels, this.x, this.y, this.w, this.h, this.linkPercent,
									this.linkPositionEnd, this.vertical, this.labelColors, this.backgroundColor, this.foregroundColor, 
									this.layer, this.nullPointer);
}

AnimatedDoublyLinkedList.prototype.setHighlight = function(value)
{
	if (value != this.highlighted)
	{
		this.highlighted = value;
	}
}

function UndoDeleteLinkedList(id, numlab, lab, x, y, w, h, linkper, posEnd, vert, labColors, bgColor, fgColor, l, np)
{
	this.objectID = id;
	this.posX = x;
	this.posY = y;
	this.width = w;
	this.height = h;
	this.backgroundColor= bgColor;
	this.foregroundColor = fgColor;
	this.labels = lab;
	this.linkPercent = linkper;
	this.verticalOrentation = vert;
	this.linkAtEnd = posEnd;
	this.labelColors = labColors
	this.layer = l;
	this.numLabels = numlab;
	this.nullPointer = np;
}

UndoDeleteLinkedList.prototype = new UndoBlock();
UndoDeleteLinkedList.prototype.constructor = UndoDeleteLinkedList;


UndoDeleteLinkedList.prototype.undoInitialStep =function(world)
{
	world.addLinkedListObject(this.objectID,this.labels[0], this.width, this.height, this.linkPercent, this.verticalOrentation, this.linkAtEnd, this.numLabels, this.backgroundColor, this.foregroundColor);
	world.setNodePosition(this.objectID, this.posX, this.posY);
	world.setLayer(this.objectID, this.layer);
	world.setNull(this.objectID, this.nullPointer);
	for (var i = 0; i < this.numLabels; i++)
	{
		world.setText(this.objectID, this.labels[i], i);
		world.setTextColor(this.objectID, this.labelColors[i], i);
	}
}
