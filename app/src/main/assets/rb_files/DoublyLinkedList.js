// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
// Copyright 2015 Rui Li, University of Texas at Dallas. All rights reserved.
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

var LINKED_LIST_START_X = 100;
var LINKED_LIST_START_Y = 200;
var LINKED_LIST_ELEM_WIDTH = 70;
var LINKED_LIST_ELEM_HEIGHT = 30;


var LINKED_LIST_INSERT_X = 250;
var LINKED_LIST_INSERT_Y = 50;

var LINKED_LIST_ELEMS_PER_LINE = 8;
var LINKED_LIST_ELEM_SPACING = 100;
var LINKED_LIST_LINE_SPACING = 100;

var TOP_POS_X = 180;
var TOP_POS_Y = 100;
var TOP_LABEL_X = 130;
var TOP_LABEL_Y =  100;

var TOP_ELEM_WIDTH = 30;
var TOP_ELEM_HEIGHT = 30;

var TAIL_POS_X = 180;
var TAIL_LABEL_X = 130;

var PUSH_LABEL_X = 50;
var PUSH_LABEL_Y = 30;
var PUSH_ELEMENT_X = 120;
var PUSH_ELEMENT_Y = 30;

function DoublyLinkedList()
{
	this.addControls();

}

DoublyLinkedList.prototype = new Algorithm();
DoublyLinkedList.prototype.constructor = DoublyLinkedList;
DoublyLinkedList.superclass = Algorithm.prototype;

DoublyLinkedList.prototype.init = function(am, w, h)
{
	DoublyLinkedList.superclass.init.call(this, am, w, h);
	this.nextIndex = 0;
	this.commands = [];
	this.first = null;
	this.last = null;
	this.tail_pos_y = h - LINKED_LIST_ELEM_HEIGHT;
	this.tail_label_y = this.tail_pos_y;
	this.setup();
}

DoublyLinkedList.prototype.setup = function()
{
	this.headID = this.nextIndex++;
	this.headLabelID = this.nextIndex++;

	this.tailID = this.nextIndex++;
	this.tailLabelID = this.nextIndex++;

	this.leftoverLabelID = this.nextIndex++;
	
	this.cmd("CreateLabel", this.headLabelID, "Head", TOP_LABEL_X, TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);
	this.cmd("SetNull", this.headID, 1);
	
	
	this.cmd("CreateLabel", this.tailLabelID, "Tail", TAIL_LABEL_X, this.tail_label_y);
	this.cmd("CreateRectangle", this.tailID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TAIL_POS_X, this.tail_pos_y);
	this.cmd("SetNull", this.tailID, 1);
	
	this.cmd("CreateLabel", this.leftoverLabelID, "", PUSH_LABEL_X, PUSH_LABEL_Y);
	
	
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();		
	
}

DoublyLinkedList.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("number", "");
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this),4);
	this.insertButton = addControlToAlgorithmBar("Button", "Ins");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("number", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this),4);
	this.deleteButton = addControlToAlgorithmBar("Button", "Del");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("number", "");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this),4);
	this.findButton = addControlToAlgorithmBar("Button", "Find");
	this.findButton.onclick = this.findCallback.bind(this);
	
	this.l2rButton = addControlToAlgorithmBar("Button", "->");
	this.l2rButton.onclick = this.l2rCallback.bind(this);
	this.r2lButton = addControlToAlgorithmBar("Button", "<-");
	this.r2lButton.onclick = this.r2lCallback.bind(this);

}

DoublyLinkedList.prototype.reset = function()
{
	this.nextIndex = 0;
}

DoublyLinkedList.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value;
	// Get text value
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "")
	{
		// set text value
		this.insertField.value = "";
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

DoublyLinkedList.prototype.deleteCallback = function(event)
{
	var deletedValue = this.deleteField.value;
	if (deletedValue != "")
	{
		deletedValue = this.normalizeNumber(deletedValue, 4);
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);		
	}
}


DoublyLinkedList.prototype.findCallback = function(event)
{
	var findValue = parseInt(this.findField.value);
	if (findValue != "")
	{
		findValue = this.normalizeNumber(findValue, 4);
		this.findField.value = "";
		this.implementAction(this.findElement.bind(this),findValue);		
	}
}

DoublyLinkedList.prototype.l2rCallback = function(event)
{
	this.implementAction(this.l2r.bind(this),"");
}

DoublyLinkedList.prototype.l2r = function (ignored) 
{
	this.commands=[];
	var pointer = this.first;
	while (pointer!=null) {
		this.cmd("SetText",this.leftoverLabelID,"Visiting "+pointer.data);
		this.cmd("SetHighlight",pointer.graphicID,1);
		this.cmd("Step");
		this.cmd("SetHighlight",pointer.graphicID,0);
		pointer = pointer.next;
	}
	this.cmd("SetText",this.leftoverLabelID,"");
	return this.commands;
}

DoublyLinkedList.prototype.r2lCallback = function(event) 
{
	this.implementAction(this.r2l.bind(this),"");
}

DoublyLinkedList.prototype.r2l = function(event) 
{
	this.commands=[];
	var pointer = this.last;
	while (pointer!=null) {
		this.cmd("SetText",this.leftoverLabelID,"Visiting "+pointer.data);
		this.cmd("SetHighlight",pointer.graphicID,1);
		this.cmd("Step");
		this.cmd("SetHighlight",pointer.graphicID,0);
		pointer = pointer.prev;
	}
		this.cmd("SetText",this.leftoverLabelID,"");
	return this.commands;
}

DoublyLinkedList.prototype.findElement = function(findValue)
{
	this.commands = [];
	var pointer = this.first;
	while (pointer!=null) {
			this.cmd("SetHighlight", pointer.graphicID, 1);
			this.cmd("Step");
			this.cmd("SetHighlight", pointer.graphicID, 0);
			if (pointer.data==findValue) {
				this.cmd("SetText",this.leftoverLabelID, " Found "+findValue);
				return this.commands;
			}
			pointer = pointer.next;
		}
	this.cmd("SetText",this.leftoverLabelID, findValue+" Not Found ");
	return this.commands;
}

DoublyLinkedList.prototype.insertElement = function(insertedValue)
{
	this.commands = new Array();	
	this.cmd("SetText", this.leftoverLabelID, " Inserting "+insertedValue);

	var nodeID = this.nextIndex++;
	this.cmd("CreateDoublyLinkedList",nodeID, insertedValue ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, 
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);
	this.cmd("Step");

	if (this.first==null) {
		this.first = new DoublyLinkedListNode(nodeID, insertedValue);
		this.last = this.first;
		this.cmd("connect",this.first.graphicID,this.headID);
		this.cmd("connect",this.first.graphicID,this.tailID,"#000000",0.0,true,"",1);
	} else {
		var newNode = new DoublyLinkedListNode(nodeID, insertedValue);

		this.cmd("Disconnect", this.first.graphicID,this.headID);
		this.cmd("connect",newNode.graphicID,this.headID);
		this.cmd("connect",newNode.graphicID,this.first.graphicID,"#000000",0.5,true,"",1);
		this.cmd("connect",this.first.graphicID,newNode.graphicID,"#000000",0.5,0);

		newNode.next = this.first;
		this.first.prev = newNode;
		this.first = newNode;
	}

	this.resetLinkedListPositions();

	this.cmd("Step");			
	return this.commands;
}

DoublyLinkedList.prototype.deleteElement = function(deletedValue)
{
	this.commands = [];
	var pointer = this.first;
	while (pointer!=null) {
			this.cmd("SetHighlight", pointer.graphicID, 1);
			this.cmd("Step");
			this.cmd("SetHighlight", pointer.graphicID, 0);
			if (pointer.data==deletedValue) {
				this.cmd("SetText",this.leftoverLabelID, " Deleting "+deletedValue);
				
				if (pointer==this.first && pointer.next!=null) {
					pointer.next.prev = null;
					this.first = pointer.next;
					this.cmd("Disconnect",pointer.graphicID,this.headID);
					this.cmd("connect",pointer.next.graphicID,this.headID);
					this.cmd("Disconnect",pointer.graphicID,pointer.next.graphicID);
					this.cmd("Disconnect",pointer.next.graphicID,pointer.graphicID);
					this.cmd("Delete",pointer.graphicID);
					this.resetLinkedListPositions();
					this.cmd("Step");
					
				} else if (pointer==this.first && pointer.next==null) {
					this.first = null;
					this.last = null;
					this.cmd("Disconnect",pointer.graphicID,this.headID);
					this.cmd("Disconnect",pointer.graphicID,this.tailID);
					this.cmd("Delete",pointer.graphicID);
					this.resetLinkedListPositions();
					this.cmd("Step");

				} else if (pointer!=this.first && pointer.next==null) {
					pointer.prev.next = null;
					this.last = pointer.prev;
					this.cmd("Disconnect",pointer.graphicID,this.tailID);
					this.cmd("Disconnect",pointer.graphicID,pointer.prev.graphicID);
					this.cmd("Disconnect",pointer.prev.graphicID,pointer.graphicID);
					this.cmd("connect",pointer.prev.graphicID,this.tailID,"#000000",0.0,true,"",1);
					this.cmd("Delete",pointer.graphicID);
					this.resetLinkedListPositions();
					this.cmd("Step");
					
				} else { // pointer!=this.first && pointer.next!=null
					pointer.prev.next = pointer.next;
					pointer.next.prev = pointer.prev;
					this.cmd("Disconnect",pointer.prev.graphicID,pointer.graphicID);
					this.cmd("Disconnect",pointer.graphicID,pointer.prev.graphicID);
					this.cmd("Disconnect",pointer.graphicID,pointer.next.graphicID);
					this.cmd("Disconnect",pointer.next.graphicID,pointer.graphicID);
					this.cmd("connect",pointer.prev.graphicID,pointer.next.graphicID,"#000000",0.5,true,"",1);
					this.cmd("connect",pointer.next.graphicID,pointer.prev.graphicID,"#000000",0.5);
					this.cmd("Delete",pointer.graphicID);
					this.resetLinkedListPositions();
					this.cmd("Step");	
				}
				return this.commands;
			}
			pointer = pointer.next;
		}
	this.cmd("SetText",this.leftoverLabelID, deletedValue+" Not Found ");
	return this.commands;			
}

DoublyLinkedList.prototype.resetLinkedListPositions = function()
{
	var pointer = this.first;
	var count=0;
	while (pointer!=null)
	{
		var nextX = count % LINKED_LIST_ELEMS_PER_LINE * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		if (nextX + LINKED_LIST_ELEM_WIDTH> canvas.width) {
			canvas.width = nextX + LINKED_LIST_ELEM_WIDTH + 20;
			objectManager.width = canvas.width;
		}
		var nextY = Math.floor(count / LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_LINE_SPACING + LINKED_LIST_START_Y;
		this.cmd("Move", pointer.graphicID, nextX, nextY);		
		pointer = pointer.next;	
		count++;	
	}
}

DoublyLinkedList.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.l2rButton.disabled = true;
	this.r2lButton.disabled = true;
}

DoublyLinkedList.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
	this.l2rButton.disabled = false;
	this.r2lButton.disabled = false;
}


/////////////////////////////////////////////////////////
// Doubly Linked List node
////////////////////////////////////////////////////////


function DoublyLinkedListNode(id, val)
{
	this.graphicID = id;
	this.data = parseInt(val);
	this.prev = null;
	this.next = null;
}

/////////////////////////////////////////////////////////
// Setup stuff
////////////////////////////////////////////////////////


var currentAlg;

function initDLL()
{
	var animManag = initCanvas();
	currentAlg = new DoublyLinkedList();

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var canvasWidth = windowWidth;
	var canvasHeight = windowHeight - $("#algoControlSection").height() - $("#generalAnimationControlSection").height()-60;
	$("#canvasWrapper").css("width",canvasWidth);
	$("#canvasWrapper").css("height",canvasHeight);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	objectManager.width = canvas.width;
	objectManager.height = canvas.height;
	currentAlg.init(animManag,canvas.width,canvas.height);
}