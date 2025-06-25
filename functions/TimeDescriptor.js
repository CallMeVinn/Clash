module.exports = function(options) {
    const converters = {
            days: (value) => value * 864e5,
            hours: (value) => value * 36e5,
            minutes: (value) => value * 6e4,
            seconds: (value) => value * 1e3,
            milliseconds: (value) => value,
            microseconds: (value) => value / 1e3,
            nanoseconds: (value) => value / 1e6
        };

        let totalMilliseconds = 0;

        for (const [key, value] of Object.entries(options)) {
            if (typeof value !== 'number') {
                throw new TypeError(`Expected a \`number\` for key \`${key}\`, got \`${value}\` (${typeof value})`);
            }

            const converter = converters[key];

            if (!converter) {
                throw new Error(`Unsupported time key: ${key}`);
            }

            totalMilliseconds += converter(value);
        }

        return totalMilliseconds;
}