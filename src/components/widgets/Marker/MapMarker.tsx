import React from "react"
import PropTypes from "prop-types"

const Marker = ({ text, onClick, lat, lng }: any) => (
	// <Wrapper alt={text} onClick={onClick} />
	<div title={text} onClick={onClick}></div>
)

Marker.defaultProps = {
	onClick: null,
}

Marker.propTypes = {
	onClick: PropTypes.func,
	text: PropTypes.string.isRequired,
}

export default Marker
