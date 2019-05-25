const Base = require('lowdb/adapters/Base');
const root = Ti.Filesystem.applicationDataDirectory;

class TitaniumAdapter extends Base {
    /**
     * Reads in a database from a source location.
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
