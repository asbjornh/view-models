const logError = (compilation, error) => {
  compilation.errors.push(`ViewModel plugin\n${error}`);
};

// Writes errors/warnings and status messages (if enabled)
const log = (options, compilation, { types, duration, error }) => {
  const errorLogger = logError.bind(null, compilation);

  if (error) errorLogger(error);

  if (!types || !duration) return;

  types.forEach(({ error }) => error && errorLogger(error));

  const numberOfTypes = types.reduce(
    (accum, { error, code, typeName }) =>
      accum + (!error && !!code && !!typeName ? 1 : 0),
    0
  );

  if (options.log) {
    process.stdout.write(
      `[ViewModels plugin]: Generated ${numberOfTypes} view models in ${duration}ms\n`
    );
  }
};

module.exports = { log, logError };
