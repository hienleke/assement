// commands/registry.js
const setLed = (command) => {
    return {
        action: "SET_LED",
        enabled: command.enabled,
    };
};

const setVolume = (command) => {
    return {
        action: "SET_VOLUME",
        volume: command.volume,
    };
};
export const commandRegistry = {
    SET_LED: setLed,
    SET_VOLUME: setVolume,
};

