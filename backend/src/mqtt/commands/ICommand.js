class ICommand {
    getDeviceID() {
        throw new Error("Method 'getDeviceID()' must be implemented.");
    }

    getActionName() {
        throw new Error("Method 'getActionName()' must be implemented.");
    }

    toPayload() {
        throw new Error("Method 'toPayload()' must be implemented.");
    }
}

module.exports = ICommand;