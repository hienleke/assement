const crypto = require('crypto');
const ICommand = require('./Icommand.js');

class TurnOnLightCommand extends ICommand {
    constructor(deviceId, brightness) {
        super();
        this.deviceId = deviceId;
        this.brightness = brightness;
        this.correlationId = crypto.randomUUID();
    }

    getDeviceID() {
        return this.deviceId;
    }

    getActionName() {
        return "TURN_ON_LIGHT";
    }

    toPayload() {
        return JSON.stringify({
            correlation_id: this.correlationId,
            action: this.getActionName(),
            params: {
                brightness: this.brightness
            }
        });
    }
}

module.exports = TurnOnLightCommand;