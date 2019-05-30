// Load our modules
const low = require('lowdb');
const lodashId = require('lodash-id');
const TitaniumAdapter = require('lowdb-titanium-adapter');

// Initialize the database to write to my-database.json
const adapter = new TitaniumAdapter('my-database.json', {
	// Describe the default schema.
	//
	// This will be used as the "base" state for your database. See the
	// LowDB documentation for more information. You can also handle this
	// by calling the `defaults()` method on your database instance.
	defaultValue: {
		values: []
	},
});

// Database handle
let db;

// Create our window instance
let win = Ti.UI.createWindow({
	backgroundColor: 'white',
	layout: 'vertical'
});

// Create our text submit button
let submit = Ti.UI.createButton({
	title: 'Insert',
	height: 24,
	width: 75
});

// Create our insertion text field
let insert = Ti.UI.createTextField({
	top: 50,
	height: 35,
	width: 200,
	backgroundColor: 'white',
	hintText: 'Enter a value',
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
	rightButton: submit
});

// Create our list of values to display
let records = Ti.UI.createListView({
	defaultItemTemplate: 'default',
	headerTitle: 'Values',
	sections: [],
	templates: {
		default: {
			childTemplates: [
				{
					type: 'Ti.UI.Label',
					bindId: 'value',
					properties: {
						left: 20,
						height: 44
					}
				},
				{
					type: 'Ti.UI.Button',
					bindId: 'remove',
					properties: {
						width: 75,
						height: 24,
						right: 10,
						title: 'Remove'
					},
					events: {
						click: async function report(e) {
							await db
								.get('values')
								.removeById(e.itemId)
								.write();

							await _reset();
						}
					}
				}
			]
		}
	}
});

// Add a listener to insert the provided value to the database.
//
// This will then update the table with the latest values from the
// database. This persists across restarts, meaning that if you kill
// the app and re-open it, the state will still be available and the
// last known values will be shown.
submit.addEventListener('click', async function () {
	if (insert.value.length === 0) {
		return;
	}

	await db
		.get('values')
		.insert({ value: insert.value })
		.write();

	await _reset();
});

// Unfocus the text field when clicked elsewhere
win.addEventListener('click', function (_e) {
	insert.blur();
});

// Add all window components
win.add(insert);
win.add(records);
win.open();

// Async initialization
(async function () {
	// Create the database
	db = await low(adapter);

	// Add some utilities
	db._.mixin(lodashId);

	// Set the initial state
	await _reset();
}());

// Reset handler to re-populate the list view.
//
// This will fetch the values from the table and display them in the
// list. This recreates the list from scratch as this is just for
// demonstration purposes, not necessarily for best efficiency.
async function _reset() {
	// reset the insert text
	insert.value = '';

	// fetch all values from the database
	let entries = await db.get('values').value();

	// create a section from each entry in the database
	let section = Ti.UI.createListSection({
		items: entries.map(function (record) {
			return {
				value: {
					text: record.value
				},
				properties: {
					itemId: record.id
				}
			};
		})
	});

	// update the list with the new section
	records.sections = [ section ];
}
