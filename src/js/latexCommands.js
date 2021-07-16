const greekLetters = [
    "alpha",
    "nu",
    "beta",
    "xi",
    "Xi",
    "gamma",
    "Gamma",
    "delta",
    "Delta",
    "pi",
    "Pi",
    "epsilon",
    "rho",
    "zeta",
    "sigma",
    "Sigma",
    "eta",
    "tau",
    "theta",
    "Theta",
    "upsilon",
    "Upsilon",
    "iota",
    "phi",
    "Phi",
    "kappa",
    "chi",
    "lambda",
    "Lambda",
    "psi",
    "Psi",
    "mu",
    "omega",
    "Omega",
];
const commonCommands = ["sum", "sqrt", "int", "prod", "times", "div"];

export const autoCommands = greekLetters.concat(commonCommands).join(" ");
