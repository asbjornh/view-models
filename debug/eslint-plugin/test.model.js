import PropTypes from "prop-types";

import Link from "../components/link.jsx";
const LinkLonk = require("../components/link-link");

const A = {};
A.propTypes = {
  b: PropTypes.string,
  c: PropTypes.exact(Link.propTypes),
  d: PropTypes.exact({
    e: PropTypes.arrayOf(
      PropTypes.exact({
        f: PropTypes.exact(LinkLonk.propTypes),
        g: PropTypes.object
      })
    )
  }).isRequired,
  k: PropTypes.exact(LinkLonk.abc).isRequired
};
A.viewModelMeta = { b: [], c: "int" };

export default A;
