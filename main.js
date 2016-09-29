function Budget(category, amount, due, paid, autobill){
	this.category = category;
	this.amount = amount;
	this.due = due;
	this.paid = paid;
	this.autobill = autobill;
}

var budget = new Object();
budget.all = [
	new Budget('Health Insurance',318,19, false, false),
	new Budget('Dental Insurance',34.89,1, false, false),
	new Budget('Auto Insurance',39.20,16, false, false),
	new Budget('Electric',200,19, false, false),
	new Budget('Water',75,19, false, false),
	new Budget('Phone',48,9, false, false),
	new Budget('Internet',60,16, false, false),
	new Budget('Mortgage',184.88,1, false, false),
	new Budget('Skype',2.99,12, false, true),
	new Budget('Spotify',10,16, false, true),
	new Budget('Freshbooks',30,8, false, true),
	new Budget('Data Plan',16.24,12, false, true),
	new Budget('Merchant Fees',65,2, false, false),
	new Budget('Trash Service',17,30, false, false)
];
//Sort in acending order
budget.all.sort(function(a,b){return a.due - b.due});
budget.getMax = function(){
	var total = 0;
	for(var i = 0; i < budget.all.length; i++){
		total += budget.all[i].amount;
	}
	return total.toFixed(2);
};
budget.max = budget.getMax();
budget.current = Number(budget.max);
budget.getTotalPaid = function(){
	var total = 0;
	for(var i = 0; i < budget.all.length; i++){
		if(budget.all[i].paid){
			total += budget.all[i].amount;
		}
	}
	return total;
};
budget.paid = budget.getTotalPaid();
budget.total = function(){
	var total = 0;
	for(var i = 0; i < budget.all.length; i++){
		if(budget.all[i].paid === false){
			total += budget.all[i].amount;	
		}
	}
	return Number(total.toFixed(2));
};
budget.form = document.getElementById("budgetForm");

var bill = new Object();
bill.getNextDue = function(){
	var nextBill;
	var nextDueDate = 31;
	for(var i = 0; i < budget.all.length; i++){
		var b = budget.all[i];
		if(nextDueDate >= b.due && b.paid === false){
			nextDueDate = b.due;
			nextBill = b;
		}
	}
	if(nextDueDate === 31){
		return false;	
	} else {
		return nextBill;
	}
};
bill.drawNextDue = function(){
	var b = bill.getNextDue();
	var nextBill = document.getElementById("nextBill");
	nextBill.innerHTML = "";
	if(b){
		var textNode = document.createTextNode(b.category + " is due next. ");
	} else {
		var textNode = document.createTextNode("Congratulations! You win!");
	}
	nextBill.appendChild(textNode);	
};
bill.update = function(){
	bill.daysCovered();
	bill.drawNextDue();
};
bill.daysCovered = function(){
	var nextBill = bill.getNextDue().due;
	var daysBetween = (Date.parse(new Date(2013,date.budgetMonth,nextBill)) - Date.parse(new Date(2013,date.currentMonth,date.day))) / (24 * 3600 * 1000);
	document.getElementById("days-covered").innerHTML = "Bills paid: " + daysBetween + " days";
	return daysBetween;
};

var list = new Object();
list.build = function(){
	var listElement = document.getElementById("list");
	for(var i = 0; i < budget.all.length; i++){
		var li = document.createElement("li");
		var category = document.createTextNode(budget.all[i].category);
		var input = document.createElement("input");
		input.type = "checkbox";
		if(budget.all[i].paid){
			input.checked = true;
		}
		li.appendChild(input);
		li.appendChild(category);
		listElement.appendChild(li);
	}
};

var date = new Object();
date.day = new Date().getDate();
date.currentMonth = new Date().getMonth();
date.budgetMonth = 10;
date.textMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
date.textMonth = date.textMonths[date.budgetMonth];

var balance = new Object();
balance.current = Number(prompt("How much do you have in your bank account?"));
balance.minimum = 0;
balance.element = document.getElementById("min-balance");
balance.left = function(){
	var element = document.getElementById("current-balance");
	var amount = balance.current - balance.minimum;
	element.innerHTML = "Balance left $" + amount.toFixed(2);
};
balance.update = function(){
	var cb = document.getElementsByTagName("input"); 
	balance.minimum = 0;
	for(var i = 0; i < cb.length; i++){
		var thisBill = budget.all[i];
		if(cb[i].checked && thisBill.due > date.day && thisBill.autobill || cb[i].checked && date.currentMonth < date.budgetMonth && thisBill.autobill){
			balance.minimum += thisBill.amount;
		}
	}
	balance.element.innerHTML = "Minimum balance $" + balance.minimum.toFixed(2);
};

var update = {};
update.checkboxes = function(){
	var cb = document.getElementsByTagName("input"); 
	for(var i = 0; i < cb.length; i++){
		if(cb[i].checked){
			budget.all[i].paid = true;
			setCookie(budget.all[i].category,"paid");
		} else {
			budget.all[i].paid = false;
			setCookie(budget.all[i].category,"unpaid");
		}
	}
};
update.billHeader = function(){
	var billHeader = document.getElementById("billHeader");
	billHeader.innerHTML = "";
	if(budget.current > budget.total()){
		budget.current -= 1;
	} else {
		budget.current = budget.total();
	}
	var totalLeft = date.textMonth + " Bills $" + budget.current.toFixed(2);
	var textNode = document.createTextNode(totalLeft);
	billHeader.appendChild(textNode);
};
update.all = function(){
	update.checkboxes();
	update.billHeader();
	budget.paid = budget.getTotalPaid();
	progressBar.update();
	bill.update();
};
update.messages = function(){
	balance.update();
	bill.daysCovered();
	balance.left();
};

var load = new Object();
load.checkboxStates = function(){
	var cb = document.getElementsByTagName("input"); 
	for(var i = 0; i < cb.length; i++){
		if(getCookie(budget.all[i].category) ==  "paid"){
			cb[i].checked = true;
		}
	}
};
load.all = function(){
	update.all();
	list.build();
	load.checkboxStates();
	balance.update();
	bill.daysCovered();
	update.messages();

};

var progressBar = {};
progressBar.canvas = document.getElementById("progressBar");
progressBar.ctx = progressBar.canvas.getContext("2d");
progressBar.maxWidth = progressBar.canvas.width;
progressBar.width = 0;
progressBar.currentWidth = progressBar.width;
progressBar.clear = function(){
	var ctx = progressBar.ctx;
	ctx.clearRect(0,0,progressBar.canvas.width,progressBar.canvas.height);
};
progressBar.update = function(){
	progressBar.clear();
	var ctx = progressBar.ctx;
	ctx.fillStyle = "rgb(179, 247, 176)";
	progressBar.width = (budget.paid / budget.max) * progressBar.maxWidth;
	if(progressBar.width > progressBar.currentWidth){
		progressBar.currentWidth = (budget.max - budget.current) / budget.max * progressBar.maxWidth;
	} else {
		progressBar.currentWidth = progressBar.width;
	}
	ctx.fillRect(0,0,progressBar.currentWidth,progressBar.canvas.height);
	
};

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name)
{
var c_value = document.cookie;
var c_start = c_value.indexOf(" " + c_name + "=");
if (c_start == -1)  {
  c_start = c_value.indexOf(c_name + "=");
  }
if (c_start == -1)  {
  c_value = null;
  }
else  {
  c_start = c_value.indexOf("=", c_start) + 1;
  var c_end = c_value.indexOf(";", c_start);
  if (c_end == -1)  {
c_end = c_value.length;
}
c_value = unescape(c_value.substring(c_start,c_end));
}
return c_value;
}

//Listeners
budget.form.addEventListener("change",update.messages,false);

load.all();

setInterval(update.all,1000/60);

