const Base = require('lowdb/adapters/Base');
const root = Ti.Filesystem.applicationDataDirectory;

class TitaniumAdapter extends Base {
	/**
     * Constructs a new instance of this adapter.
     *
     * @param {string} source
     *      the source location to store database contents in.
     * @param {object} options
     *      the options used to control this adapter.
     * @returns {TitaniumAdapter}
     *      an adapter to be used for LowDB integration.
     */
	constructor(source, options = {}) {
		// override the default stringify to avoid bloating
		options.serialize = options.serialize || JSON.stringify;

		// pass to Base adapter
		super(source, options);
	}

	/**
     * Reads in a database from a source location.
     *
     * @returns {object}
     *      the content of the database source location.
     */
	read() {
		let descriptor = Ti.Filesystem.getFile(root, this.source);

		if (!descriptor.exists()) {
			this.write(this.defaultValue);
			return this.defaultValue;
		}

		let content = descriptor.read().text.trim();
		if (content.length === 0) {
			return {};
		}

		return this.deserialize(content);
	}

	/**
     * Writes a database to a target location.
     *
     * @param {object} data
     *      the database content to write to disk.
     */
	write(data) {
		let descriptor = Ti.Filesystem.getFile(root, this.source);
		let serialized = this.serialize(data);

		descriptor.write(serialized);
	}
}

// export the adapter directly
module.exports = TitaniumAdapter;
