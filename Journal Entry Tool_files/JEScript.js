let submit1_bt = document.getElementById("submit1");
let submit2_bt = document.getElementById("submit2");
let reset_bt = document.getElementById("reset");
let checkBox1 = document.getElementById("checkBox1");
let inputBox = document.getElementById("text-area");

// Button 1: BT script
submit1_bt.addEventListener("click", function () {
	let inputText = inputBox.value;
	inputText = inputText.replace(/"/g, '');
	let outputText = "";
	outputText = bt_to_Script(inputText, 'BT', checkBox1.checked);

	$("#text-area").val(outputText);
});

// Button 2: Actuals script
submit2_bt.addEventListener("click", function () {

	let inputText = inputBox.value;
	inputText = inputText.replace(/"/g, '');
	let outputText = "";
	outputText = bt_to_Script(inputText, 'ACT', checkBox1.checked);

	$("#text-area").val(outputText);
});


// Reset button
reset_bt.addEventListener("click", function () {
	inputBox.value = "";
	$("#text-area").val("");
});


// Models
///////////////////////////////////////////////////////////////////

class entry {
	constructor() {
		this.account = '';
		this.fund = '';
		this.dept = '';
		this.program = '';
		this.project = '';
		this.scenario = '';
		this.amount = '';
		this.ref = '';
		this.description = '';
	}

}

// keeping track of which columns are included
class index {
	constructor() {
		this.accountIndex = -1;
		this.fundIndex = -1;
		this.deptIndex = -1;
		this.programIndex = -1;
		this.projectIndex = -1;
		this.scenarioIndex = -1;
		this.amountIndex = -1;
		this.refIndex = -1;
		this.descriptionIndex = -1;
	}

}



// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////

function getColumns(list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].toLowerCase().include("acct")) {

		}

	}

}


// check if a character is a number
function isDigit(c) {
	if (c >= '0' && c <= '9') {
		return true;
	}
	return false;
}

// Convert BT csv data to script
function bt_to_Script(inputText, journalType, isChecked) {
	let output = '';
	let lines = [];
	lines = inputText.split('\n');
	let entryList = [];
	let theSplit = /\t/g;
	if (isChecked) {
		theSplit = ',';
	}

	lines.forEach(element => {
		let temp = element.split(theSplit);

		if (temp[0].trim() != '') {
			let x = new entry();
			x.account = temp[0];
			x.fund = temp[1];
			x.dept = temp[2];
			x.program = temp[3];
			x.project = temp[5];
			x.scenario = temp[6];
			x.description = temp[7];
			x.ref = temp[11];
			x.amount = temp[12];

			// fix negative amount
			x.amount = x.amount.replace(',', '').trim();
			x.amount = x.amount.replace(/\(/g, '-');
			x.amount = x.amount.replace(/\)/g, '');

			// trim description to 30 characters or less
			if (x.description.length > 30) {
				x.description = x.description.slice(0, 30)
			}

			// remove scenario if Actuals
			if (journalType == 'ACT') {
				x.scenario = '';
			}

			// console.log(x);
			entryList.push(x);
		}
	});

	output = entryList_to_script(entryList);

	return output;
}

// turn entryList to script 
function entryList_to_script(list) {
	let text = "let inputs = document.getElementsByTagName('input');";
	let count = 0;

	list.forEach(entry => {

		if (entry.account != '') {
			let temp = "\n" + "inputs['ACCOUNT$" + count + "'].value='" + entry.account + "';";
			text += temp;
		}

		if (entry.fund != '') {
			let temp = "\n" + "inputs['FUND_CODE$" + count + "'].value='" + entry.fund + "';";
			text += temp;
		}

		if (entry.dept != '') {
			let temp = "\n" + "inputs['DEPTID$" + count + "'].value='" + entry.dept + "';";
			text += temp;
		}

		if (entry.program != '') {
			let temp = "\n" + "inputs['PROGRAM_CODE$" + count + "'].value='" + entry.program + "';";
			text += temp;
		}

		if (entry.project != '') {
			let temp = "\n" + "inputs['PROJECT_ID$" + count + "'].value='" + entry.project + "';";
			text += temp;
		}

		if (entry.scenario != '') {
			let temp = "\n" + "inputs['SCENARIO$" + count + "'].value='" + entry.scenario + "';";
			text += temp;
		}

		if (entry.description != '') {
			let temp = "\n" + "inputs['LINE_DESCR$" + count + "'].value='" + entry.description + "';";
			text += temp;
		}

		if (entry.ref != '') {
			let temp = "\n" + "inputs['JRNL_LN_REF$" + count + "'].value='" + entry.ref + "';";
			text = text + temp;
		}

		if (entry.amount != '') {
			let temp = "\n" + "inputs['FOREIGN_AMOUNT$" + count + "'].value='" + entry.amount + "';";
			text = text + temp;
		}

		count++;
	});
	return text;

}
